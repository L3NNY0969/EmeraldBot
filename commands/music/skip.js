module.exports.run = async (bot, msg) => {
    const player = bot.player.players.get(msg.guild.id);
    if (!msg.member.voiceChannel) return msg.channel.send(":x: You must be in a voice channel first.");
    if (player) {
        if (msg.member.voiceChannel.id !== msg.guild.me.voiceChannelID) { return msg.channel.send(":x: You must be in the same voice channel as the bot."); } else {
            if (msg.author.id !== player.queue[0].requester.id && !msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: You must be the person who requested this song or have the administrator permission!");
            player.queue.shift();
            if (player.queue.length === 0) {
                return bot.player.leaveVoice(msg.guild.id);
            } else {
                msg.channel.send("The current song has been skipped!");
                await player.play(player.queue[0].track);
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
