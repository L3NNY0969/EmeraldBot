module.exports = class Poll {

    constructor() {
        this.config = {
            name: "poll",
            usage: "poll [question]",
            description: "Creates a poll for you.",
            permission: "None",
            category: "Utility",
            aliases: []
        };
    }

    async run(bot, msg, args) {
        if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "ADD_REACTIONS"])) return;
        if (!args.join(" ")) { return msg.channel.send(`:x: You are missing the poll question.`); }

        const answers = [];
        const tempMsgs = [];

        for (let i = 0; i < 9; i++) {
            const tempMsg = await msg.channel.send("Please enter a poll option or type `publish` to publish the poll.");
            try {
                const answer = await msg.channel.awaitMessages(m => m.author === msg.author && m.channel === msg.channel, { maxMatches: 1, time: 15000, errors: ["time"] });
                if (answer.first().content.startsWith("publish")) { tempMsgs.push(tempMsg); break; }
                answers.push({
                    emoji: this.getEmoji(i),
                    content: answer.first().content
                });
                tempMsgs.push(tempMsg);
            } catch (error) { console.error(error); }
        }
        for (const tempMsg of tempMsgs) await tempMsg.delete();
        const poll = await msg.channel.send(`${msg.author} needs feedback: **${args.join(" ")}**\n\n${answers.map(a => `${a.emoji} - ${a.content}`).join("\n")}`);
        for (const answer of answers) { // eslint-disable-line
            await poll.react(answer.emoji);
        }
    }

    getEmoji(number) {
        const numbers = [
            "\u0031\u20E3",
            "\u0032\u20E3",
            "\u0033\u20E3",
            "\u0034\u20E3",
            "\u0035\u20E3",
            "\u0036\u20E3",
            "\u0037\u20E3",
            "\u0038\u20E3",
            "\u0039\u20E3"
        ];
        return numbers[number];
    }

};
