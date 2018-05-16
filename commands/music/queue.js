module.exports = class Queue {

    constructor() {
        this.config = {
            name: "queue",
            usage: "None",
            description: "What is in the music queue?",
            permission: "None",
            category: "Music",
            aliases: ["mqueue"]
        };
    }

    run(bot, msg) {
        const player = bot.player.players.get(msg.guild.id);
        if (player) {
            if (msg.channel.permissionsFor(bot.user).has(["EMBED_LINKS", "SEND_MESSAGES"])) {
                const queuePages = [];
                for (let i = 0; i < player.queue.length; i += 8) {
                    const sliced = player.queue.slice(i + 1, i + 8);
                    if (sliced.length === 0) return msg.channel.send(":x: The queue is empty.");
                    queuePages.push({
                        title: `Displaying songs from \`${i + 1}\` to \`${i + sliced.length}\``,
                        description: sliced.map(s => `\`•\` **[${s.title}](${s.url})**`).join("\n")
                    });
                }
                const Paginator = require("../../utils/paginator.js");
                const PaginatorSession = new Paginator(msg, queuePages, "RANDOM");
                PaginatorSession.start();
            } else { return msg.channel.send(":x: I need the `Embed Links` or the `Send Messages` permission. Please give me these permission and try again!"); }
        } else { return msg.channel.send(":x: Nothing is in queue!"); }
    }

};
