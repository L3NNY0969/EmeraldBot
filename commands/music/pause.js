module.exports.run = async (bot, msg, args) => {
    let player = bot.players[msg.guild.id];
    if(!msg.member.voiceChannel) return msg.channel.send(":x: You must be in a voice channel first.");
    if(player && player.playing) {
        if(msg.member.voiceChannel.id != player.voiceChannel.id) return msg.channel.send(":x: You must be in the same voice channel as the bot.");
        else {
            if(player.con.dispatcher.paused === false) {
                player.con.dispatcher.paused = true;
                player.con.dispatcher.pause();
                return msg.channel.send(`:white_check_mark: The player is now paused.`);
            } else {
                player.con.dispatcher.paused = false;
                player.con.dispatcher.resume();
                return msg.channel.send(`:white_check_mark: The player is now resumed.`);
            }
        }
    }
}

module.exports.config = {
    name: "pause",
    usage: "None",
    description: "Pauses/Resumes the current song",
    permission: "None",
    category: "Music",
    aliases: []
}
