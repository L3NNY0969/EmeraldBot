const {RichEmbed} = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let search = args.join(" ");
    if(!search) return msg.channel.send("Please provide a search term.");

    const voiceChannel = msg.member.voiceChannel;
    if(!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');

    const voicePerms = voiceChannel.permissionsFor(bot.user);
    const textPerms = msg.channel.permissionsFor(bot.user);

    if(!textPerms.has(["SEND_MESSAGES", "EMBED_LINKS"])) return;
    if(!voicePerms.has(["CONNECT", "SPEAK"])) return;

    if(args[0].match(/https:\/\/?(www\.)?youtube\.com\/watch\?v=?(.*)/)) {
        getVideos(args[0]).then(v => {
            msg.channel.startTyping();
            handleQueue(v[0], msg, bot);
            msg.channel.stopTyping();
        });
        return;
    } else if(args[0].match(/https:\/\/?(www\.)?youtu\.be\/?(.*)/)) {
        getVideos(args[0]).then(v => {
            msg.channel.startTyping();
            handleQueue(v[0], msg, bot);
            msg.channel.stopTyping();
        });
    } else if(args[0].match(/\?|\&list=(.*)/)) {
        getVideos(args[0]).then(async v => {
            msg.channel.startTyping();
            let songs = await getVideos(search).catch(() => {
                msg.channel.stopTyping();
                msg.channel.send(":x: Playlist not found.");
                return;
            });
            for(let i = 0; i < 50; i++) {
                handleQueue(songs[i], msg, bot, true);
            }
            msg.channel.stopTyping();
            msg.channel.send(":white_check_mark: Playlist has been added.");
        });
        return;
    } else {
        let m;
        try {
            msg.channel.startTyping();
            let videos = await getVideos(`ytsearch:${search}`)
            .catch(() => {
                return msg.channel.send(`:x: No results found for: **${search}**`);
            });
            msg.channel.stopTyping();
            let num = 0;
            m = await msg.channel.send(new RichEmbed()
                .setAuthor("Song Selection:", bot.user.avatarURL)
                .setDescription(videos.map(video => `**${++num}**: [${video.info.title}](${video.info.uri})`).slice(0, 5).join("\n")+"\n\nPlease pick a number between 1 and 5 you can also type `cancel`.")    
                .setColor(bot.color)
            );
            let col = await msg.channel.awaitMessages(m => m.content > 0 && m.content < videos.length+1 && m.author.id === msg.author.id && m.channel.id === msg.channel.id, { maxMatches: 1, time: 10000, errors: ['time'] });
            if(col.first().content.match(/cancel|stop|end/)) {
                m.delete();
                return msg.channel.send(":white_check_mark: The song selection has been stopped.").then(m=>m.delete(3500));
            } else {
                let toAdd = videos[parseInt(col.first().content) - 1];
                m.delete();
                handleQueue(toAdd, msg, bot);
            }
        } catch (e) {
            msg.reply("The song selection was stopped since no value was entered.");
        }
    }
}

async function handleQueue(video, msg, bot, playlist = false) {
    const song = {
        track: video.track,
        title: bot.escapeMarkdown(video.info.title),
        author: bot.escapeMarkdown(video.info.author),
        duration: video.info.length,
        stream: video.info.isStream,
        url: video.info.uri,
        requester: msg.author
    }

    if(bot.players.get(msg.guild.id)) {
        bot.players.get(msg.guild.id).songs.push(song);
        if(playlist === true) return; else return msg.channel.send(`A new song has been added to the queue by **${msg.author.tag}** (Position: ${bot.players.get(msg.guild.id).songs.length-1}): **__${song.title}__** by **${song.author}**`)
    } else {
        bot.players.set(msg.guild.id, {
            songs: [],
            volume: 2,
            voiceChannel: msg.member.voiceChannel,
            playing: false,
            looping: false,
            con: null
        });

        bot.players.get(msg.guild.id).playing = true;
        bot.players.get(msg.guild.id).songs.push(song);

        try {
            bot.players.get(msg.guild.id).con = await bot.player.join({
                guild: msg.guild.id,
                channel: msg.member.voiceChannel.id,
                host: "localhost"
            });
            play(msg, bot);
        } catch (e) {
            msg.channel.send(`\`\`\`js\n${e.stack}\`\`\``);
        }
    }
}

async function play(msg, bot) {
    const player = bot.players.get(msg.guild.id);
    let llplayer = bot.player.get(msg.guild.id);
    llplayer.volume(50);
    await llplayer.play(player.songs[0].track);
    llplayer.on("end", async endEvent => {
        if(endEvent.reason === "REPLACED") {
            return msg.channel.send(`Now playing **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*.`);
        }
        else if(endEvent.reason === "FINISHED") {
            if(player.looping) {
                await llplayer.play(player.songs[0].track);
                return msg.channel.send(`Now playing *on loop* **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*.`);
            } else {
                player.songs.shift();
                if(player.songs.length === 0) {
                    await bot.player.leave(msg.guild.id);
                    return bot.players.delete(msg.guild.id);
                } else {
                    setTimeout(async () => {
                        await llplayer.play(player.songs[0].track);
                        return msg.channel.send(`Now playing **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*.`);
                    }, 500);
                }
            }
        }
    });
    return msg.channel.send(`Now playing **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*.`);
}

module.exports.config = {
    name: "play",
    usage: "play (search term | url | playlist url)",
    description: "Plays a song in the voice channel",
    permission: "None",
    category: "Music",
    aliases: ["p"]
}

async function getVideos(query) {
    return new Promise(async (res, rej) => {
        let superagent = require("superagent");
        let { body } = await superagent.get(`http://localhost:2333/loadtracks?identifier=${encodeURIComponent(query)}`)
            .set("Authorization", "PartyBot");
        if(!body[0]) return rej("NO_RESULTS_FOUND");
        res(body);
    });
}