module.exports.run = async (bot, msg, args) => {
    let player = bot.players[msg.guild.id];
    if(player && player.playing) {
        let format = "";
        for(let songNum = 0; songNum < player.songs.length; songNum++) {
            let song = player.songs[songNum];
            player.songs[songNum] === player.songs[0] ? format += `\`${songNum}:\` (Now playing) **[${song.title}](${song.url})**\n` : format += `\`${songNum}:\` **[${song.title}](${song.url})**\n`;
        }
        if(msg.channel.permissionsFor(bot.user).has("EMBED_LINKS")) {
            msg.channel.send(bot.embed({
                title: "Current music queue",
                description: format,
                footer: `Requested by ${msg.author.tag}`,
                timestamp: true
            }));
        } else return msg.channel.send(":x: I need the `Embed Links` permission. Please give me this permission and try again!");
    } else return msg.channel.send(":x: Nothing is in queue!");
}

module.exports.config = {
    name: "queue",
    description: "What is in the music queue?",
    permission: "None",
    category: "Music",
    aliases: []
}