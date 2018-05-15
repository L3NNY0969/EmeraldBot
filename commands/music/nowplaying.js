module.exports.run = async (bot, msg) => {
    const player = bot.player.players.get(msg.guild.id);
    if (player) {
        const embed = bot.embed({
            author: {
                name: "Current music status",
                icon: bot.user.displayAvatarURL
            },
            fields: [
                { name: "Now playing:", value: progressBar(player.queue[0], player.playerState.currentPosition, player.queue[0].duration) },
                { name: "Simplified queue:", value: mapQueueOrSlice(player.queue) }
            ]
        });
        msg.channel.send(embed);
    } else { return msg.channel.send(":x: Nothing is playing!"); }
};

module.exports.config = {
    name: "nowplaying",
    usage: "None",
    description: "Displays whats playing in the current queue.",
    permission: "None",
    category: "Music",
    aliases: ["np"]
};

function convert(time) {
    // I took this from stack overflow cuz im bad at this stuff Credit to them.
    const seconds = parseInt((time / 1000) % 60);
    const minutes = parseInt((time / (1000 * 60)) % 60);
    const hours = parseInt((time / (1000 * 60 * 60)) % 24);
    return {
        total: `\`${hours === 0 ? "" : `${pad(hours, 2)}:`}${minutes === 0 ? "" : `${pad(minutes, 2)}:`}${pad(seconds, 2)}\``,
        seconds: pad(seconds, 2),
        minutes: pad(minutes, 2),
        hours: pad(hours, 2)
    };
}

function pad(num, len) {
    let str = `${num}`;
    while (str.length < len) {
        str = `0${str}`;
    }
    return str;
}

function progressBar(npSong, playerPosition, totalTime) {
    const bar = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬".split("");
    const pos = Math.ceil(playerPosition / totalTime * 30);
    bar[pos] = "🔘";
    return `***[${npSong.title}](${npSong.url})***\n\`${bar.join("")}\` [${convert(playerPosition).total}/${convert(totalTime).total}]`;
}

function mapQueueOrSlice(songs = []) {
    if (songs.length <= 8) {
        return songs.map(s => `\`•\` ***[${s.title}](${s.url})***`).join("\n");
    } else {
        const sliced = songs.slice(0, 8);
        return `${sliced.map(s => `\`•\` ***[${s.title}](${s.url})***`).join("\n")}\n... and ${songs.length - sliced.length} more.`;
    }
}
