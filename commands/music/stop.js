module.exports.run = async (bot, msg, args) => {
    let player = bot.players.get(msg.guild.id);
    let llplayer = bot.player.get(msg.guild.id);
    if(!msg.member.voiceChannel) return msg.channel.send(":x: You must be in a voice channel first.");
    if(llplayer) {
        if(msg.member.voiceChannel.id != player.voiceChannel.id) return msg.channel.send(":x: You must be in the same voice channel as the bot.");
        else {
            if(msg.author.id !== player.songs[0].requester.id && !msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: You must be the person who requested this song or have the administrator permission!");
            player.songs = [];
            bot.player.leave(msg.guild.id);
            msg.channel.send(":white_check_mark: The player has been stopped and the queue has been cleared.");
            return bot.players.delete(msg.guild.id);
        }
    } else msg.channel.send(":x: Nothing is playing to stop!");
}

module.exports.config = {
    name: "stop",
    usage: "None",
    description: "Stops the current song.",
    permission: "None",
    category: "Music",
    aliases: []
}