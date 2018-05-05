module.exports.run = async (bot, msg) => {
    const player = bot.players.get(msg.guild.id);
    const llplayer = bot.player.get(msg.guild.id);
    if (llplayer) {
        if (msg.author.id !== player.songs[0].requester.id && !msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: You must be the person who requested this song or have the administrator permission!");
        if (player.looping === false) {
            player.looping = true;
            return msg.channel.send(`:white_check_mark: The player **will now repeat**.`);
        } else {
            player.looping = false;
            return msg.channel.send(`:white_check_mark: The player **will no longer repeat**.`);
        }
    } else { msg.channel.send(":x: Nothing is playing to repeat!"); }
};

module.exports.config = {
    name: "repeat",
    usage: "None",
    description: "Repeats the current playing song for ever!",
    permission: "None",
    category: "Music",
    aliases: ["loop"]
};
