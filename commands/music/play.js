const { RichEmbed } = require("discord.js");
const { get } = require("snekfetch");

module.exports.run = async (bot, msg, args) => {
    const search = args.join(" ");

    if (!search) return msg.channel.send("Please provide a search term.");
    if (!msg.member.voiceChannel) return msg.channel.send("I'm sorry but you need to be in a voice channel to play music!");

    const voicePerms = msg.member.voiceChannel.permissionsFor(bot.user);
    const textPerms = msg.channel.permissionsFor(bot.user);

    if (!textPerms.has(["SEND_MESSAGES", "EMBED_LINKS"])) return;
    if (!voicePerms.has(["CONNECT", "SPEAK"])) return;

    if (search.match(/https:\/\/?(www\.)?youtube\.com\/watch\?v=(.*)/)) {
        return getVideos(search).then(v => {
            msg.channel.startTyping();
            handleQueue(v[0], msg, bot);
            msg.channel.stopTyping();
        }).catch(() => {
            msg.channel.stopTyping(true);
            return msg.channel.send(":x: No results where found.");
        });
    } else if (search.match(/https:\/\/?(www\.)?youtu\.be\/(.*)/)) {
        return getVideos(search).then(v => {
            msg.channel.startTyping();
            handleQueue(v[0], msg, bot);
            msg.channel.stopTyping();
        }).catch(() => {
            msg.channel.stopTyping(true);
            return msg.channel.send(":x: No results where found.");
        });
    } else if (search.match(/(\?|\&)list=(.*)/)) { // eslint-disable-line
        msg.channel.startTyping();
        return getVideos(search).then(v => {
            for (let i = 0; i < v.length; i++) {
                handleQueue(v[i], msg, bot, true);
            }
            msg.channel.stopTyping(true);
            msg.channel.send(`:white_check_mark: Playlist has been added with **${v.length}** songs.`);
        }).catch(() => {
            msg.channel.stopTyping(true);
            return msg.channel.send(":x: No results where found.");
        });
    } else {
        msg.channel.startTyping();
        const videos = await getVideos(`ytsearch:${search}`).catch(e => msg.channel.send(`\`\`\`xl\n${e.stack}\`\`\``));
        msg.channel.stopTyping();
        let num = 0;
        const m = await msg.channel.send(new RichEmbed()
            .setAuthor("Song Selection:", bot.user.avatarURL)
            .setDescription(`${videos.map(video => `**${++num}**: [${video.info.title}](${video.info.uri})`).slice(0, 5).join("\n")}\n\nPlease pick a number between 1 and 5 you can also type \`cancel\`. This times out in 15 seconds.`)
            .setColor(bot.color)
        );
        const col = await msg.channel.createMessageCollector(m1 => m1.author.id === msg.author.id && m1.channel.id === msg.channel.id, { time: 15000 });
        col.on("collect", collected => {
            if (collected.content.match(/cancel/)) {
                col.stop();
                m.delete();
                return msg.channel.send(":white_check_mark: The song selection has been stopped.").then(m2 => m2.delete(3500));
            } else if (collected.content > 0 && collected.content < videos.length + 1) {
                col.stop();
                const toAdd = videos[parseInt(collected.content) - 1];
                m.delete();
                return handleQueue(toAdd, msg, bot);
            }
        });
        col.on("end", collected => {
            if (collected.size < 1) {
                m.delete();
                return msg.reply("Since no value was entered the selection has been stopped.");
            }
        });
    }
};

async function handleQueue(video, msg, bot, playlist = false) {
    const song = {
        track: video.track,
        title: bot.escapeMarkdown(video.info.title),
        author: bot.escapeMarkdown(video.info.author),
        duration: video.info.length,
        stream: video.info.isStream,
        url: video.info.uri,
        requester: msg.author
    };

    if (bot.players.get(msg.guild.id)) {
        bot.players.get(msg.guild.id).songs.push(song);
        if (playlist === true) return; else return msg.channel.send(`A new song has been added to the queue by **${msg.author.tag}** (Position: ${bot.players.get(msg.guild.id).songs.length - 1}): **__${song.title}__** by **${song.author}**`);
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
    const llplayer = bot.player.get(msg.guild.id);
    llplayer.volume(50);
    await llplayer.play(player.songs[0].track);
    llplayer.on("end", async endEvent => {
        if (endEvent.reason === "REPLACED") {
            return msg.channel.send(`Now playing **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*.`);
        } else if (endEvent.reason === "FINISHED") {
            if (player.looping) {
                await llplayer.play(player.songs[0].track);
                return msg.channel.send(`Now playing *on loop* **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*.`);
            } else {
                player.songs.shift();
                if (player.songs.length === 0) {
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
};

async function getVideos(search) {
    const res = await get(`http://localhost:2333/loadtracks?identifier=${search}`)
        .set("Authorization", "PartyBot")
        .catch(err => {
            console.error(err);
            return null;
        });
    if (!res) throw "There was an error, try again";
    if (!res.body.length) throw "No tracks found";
    return res.body;
}
