module.exports.run = async (bot, msg, args) => {
    let player = bot.players[msg.guild.id];
    if(!msg.member.voiceChannel) return msg.channel.send(":x: You must be in a voice channel first.");
    if(player && player.playing) {
        if(msg.member.voiceChannel.id != player.voiceChannel.id) return msg.channel.send(":x: You must be in the same voice channel as the bot.");
        else {
            if(msg.author.id !== player.songs[0].requester.id || !msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: You must be the person who requested this song or have the administrator permission!");
            msg.channel.send("The current song has been skipped!");
            player.con.dispatcher.end();
        }
    } else msg.channel.send(":x: Nothing is playing to skip!");
}

module.exports.config = {
    name: "skip",
    usage: "None",
    description: "Skips the current playing song then plays the next one.",
    permission: "None",
    category: "Music",
    aliases: []
}