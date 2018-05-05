module.exports.run = async (bot, msg) => {
    const player = bot.players.get(msg.guild.id);
    const llplayer = bot.player.get(msg.guild.id);
    if (!msg.member.voiceChannel) return msg.channel.send(":x: You must be in a voice channel first.");
    if (llplayer) {
        if (msg.member.voiceChannel.id !== player.voiceChannel.id) { return msg.channel.send(":x: You must be in the same voice channel as the bot."); } else {
            if (msg.author.id !== player.songs[0].requester.id && !msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: You must be the person who requested this song or have the administrator permission!");
            player.songs.shift();
            if (player.songs.length === 0) {
                bot.players.delete(msg.guild.id);
                return bot.player.leave(msg.guild.id);
            } else {
                msg.channel.send("The current song has been skipped!");
                await llplayer.play(player.songs[0].track);
            }
        }
    } else { msg.channel.send(":x: Nothing is playing to skip!"); }
};

module.exports.config = {
    name: "skip",
    usage: "None",
    description: "Skips the current playing song then plays the next one.",
    permission: "None",
    category: "Music",
    aliases: []
};
