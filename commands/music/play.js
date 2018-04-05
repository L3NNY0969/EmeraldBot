const {RichEmbed} = require("discord.js");
const ytdl = require("ytdl-core");
const request = require('request');

module.exports.run = async (bot, msg, args) => {
    const YTApi = require("yt-api").Client;
    const ytapi = new YTApi(bot.config.tokens.youtube);
    let search = args.join(" ");
    if(!search) return msg.channel.send("Please provide a search term.");
    const voiceChannel = msg.member.voiceChannel;
    if(!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
    const perms = voiceChannel.permissionsFor(bot.user);
    if(!perms.has("CONNECT")) {
        return msg.channel.send(":x: I cannot connect to your voice channel, Please make sure i have the correct permission!");
    }
    if(!perms.has("SPEAK")) {
        return msg.channel.send(":x: I cannot speak to your voice channel, Please make sure i have the correct permission!");
    }
    let watchMatch = /https:\/\/?(www\.)?youtube\.com\/watch\?v=?([A-Za-z0-9\-_]+)/.exec(search);
    let shortWatchMatch = /https:\/\/?(www\.)?youtu\.be\/?([A-Za-z0-9\-_]+)/.exec(search);
    let playlistMatch = /(\?|\&)list=([^#\&\?]+)/.exec(search);
    if(watchMatch) {
        ytapi.getVideoByID(watchMatch[2]).then(videoInfo => {
            return handleQueue(videoInfo, msg, bot);
        }).catch(() => {
            return msg.channel.send(":x: Invalid url provided!");
        });
        return;
    } else if(shortWatchMatch) {
        ytapi.getVideoByID(shortWatchMatch[2]).then(videoInfo => {
            return handleQueue(videoInfo, msg, bot);
        }).catch(() => {
            return msg.channel.send(":x: Invalid url provided!");
        });
        return;
    } else if(playlistMatch) {
        ytapi.getPlaylist(playlistMatch[2]).then(async pl => {
            for(let i = 0; i < 25 && i < pl.playlistVideos.length; i++) await handleQueue(pl.playlistVideos[i], msg, bot, true);
            msg.channel.send(`:white_check_mark: Playlist **${pl.playlistTitle}** was added to the queue!`);
        }).catch(() => msg.channel.send("Playlist not found!"));
        return;
    } else {
        ytapi.searchForVideos(search, 10).then(async videos => {
            if(msg.channel.permissionsFor(bot.user).has("EMBED_LINKS")) {
                let m;
                try {
                    let num = 0;
                    m = await msg.channel.send(new RichEmbed()
                        .setAuthor("Song Selection:", bot.user.avatarURL)
                        .setDescription(videos.map(video => `**${++num}**: [${video.title}](${video.url})`).join("\n")+"\n\nPlease pick a number between 1 and "+videos.length+".")                
                        .setColor(bot.color)
                    );
                    let col = await msg.channel.awaitMessages(m => m.content > 0 && m.content < videos.length+1 && m.author.id === msg.author.id && m.channel.id === msg.channel.id, { maxMatches: 1, time: 10000, errors: ['time'] });
                    let toAdd = videos[parseInt(col.first().content) - 1];
                    ytapi.getVideoByID(toAdd.videoID).then(info => {
                        m.delete();
                        handleQueue(info, msg, bot);
                    }).catch(() => {
                        return msg.channel.send(`That video was either not found or has been deleted please try again with a differed number.\n\nTo rerun the command use: \`${msg.prefix}play ${search}\``);
                    });
                } catch (e) {
                    m.delete();
                    return msg.reply(`Since no value was entered I stopped the video selection.`);
                }
            } else return msg.channel.send(":x: I need the `Embed Links` permission!");
        }).catch(() => {
            return msg.channel.send(":x: No videos were found for your request!");
        });
        return;
    }
}

async function handleQueue(video, msg, bot, playlist = false) {
    const song = {
        title: bot.escapeMarkdown(video.title),
        url: video.url,
        stats: video.statistics,
        duration: video.duration,
        requester: msg.author,
        author: bot.escapeMarkdown(video.channel.user)
    }
    if(!bot.players[msg.guild.id]) bot.players[msg.guild.id] = bot.players[msg.guild.id] = {
        songs: [],
        volume: 2,
        voiceChannel: msg.member.voiceChannel,
        playing: false,
        looping: false,
        con: null
    }
    if(bot.players[msg.guild.id].playing) {
        if(bot.players[msg.guild.id].songs.length === 45) return msg.channel.send(":x: You have reached the limit of 45 songs in the queue.");
        bot.players[msg.guild.id].songs.push(song);
        if(playlist === true) return; else return msg.channel.send(`A new song has been added to the queue by **${msg.author.tag}** (Pos: ${bot.players[msg.guild.id].songs.length-1}): **__${song.title}__** by **${song.author}** (${song.duration.days}${song.duration.hours}${song.duration.minutes}${song.duration.seconds})`)
    } else {
        bot.players[msg.guild.id].playing = true;
        bot.players[msg.guild.id].songs.push(song);
        try {
            bot.players[msg.guild.id].con = await msg.member.voiceChannel.join();
            play(msg, bot);
        } catch (e) {
            msg.channel.send(`\`\`\`js\n${e.stack}\`\`\``);
        }
    }
}

function play(msg, bot) {
    const player = bot.players[msg.guild.id];
    const dispatcher = player.con.playStream(ytdl(player.songs[0].url, {filter: "audioonly"}));
    dispatcher.setVolume(50/100);
    dispatcher.on("end", () => {
        if(player.voiceChannel.members.filter(m=>!m.user.bot).size >= 1) {
            if(player.looping) {
                return play(msg, bot);
            } else {
                player.songs.shift();
                if(player.songs.length === 0) {
                    player.con.disconnect();
                    return delete bot.players[msg.guild.id];
                } else {
                    setTimeout(() => play(msg, bot), 250);
                }
            }
        } else {
            player.songs = [];
            player.voiceChannel.leave();
            return;
        }
    });
    if(player.looping) return msg.channel.send(`Now playing *(looped)* **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*`);
    else return msg.channel.send(`Now playing **${player.songs[0].title}** as requested by *${player.songs[0].requester.tag}*`);
}

module.exports.config = {
    name: "play",
    usage: "play (search term | url | playlist url)",
    description: "Plays a song in the voice channel",
    permission: "None",
    category: "Music",
    aliases: []
}