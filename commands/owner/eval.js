module.exports = class Eval {

    constructor() {
        this.config = {
            name: "eval",
            usage: "eval (code)",
            description: "Evaluates code",
            permission: "Bot Owner",
            category: "Owner",
            aliases: ["ev"]
        };
    }

    async run(bot, msg, args) {
        const toEval = args.join(" ");
        if (!toEval) { return msg.channel.send(":x: You must provide code to evaluate!"); } else {
            const m = await msg.channel.send(`Evaluating \`${toEval}\``);
            try {
                let result = eval(toEval);
                if (typeof result !== "string") { result = await require("util").inspect(result, { maxDepth: 0, showHidden: true }); }
                if (result.length > 1024) {
                    const haste = await bot.haste(result.replace(new RegExp(bot.token, "g"), "BAD BOI"));
                    m.edit(bot.embed({
                        title: "Evaluation success!",
                        fields: [
                            { name: "Code:", value: `\`\`\`xl\n${toEval}\`\`\`` },
                            { name: "Result:", value: haste }
                        ],
                        footer: `Evaluated by ${msg.author.username} in ${m.createdTimestamp - msg.createdTimestamp}ms`
                    }));
                } else {
                    m.edit(bot.embed({
                        title: "Evaluation success!",
                        fields: [
                            { name: "Code:", value: `\`\`\`xl\n${toEval}\`\`\`` },
                            { name: "Result:", value: `\`\`\`js\n${result.replace(new RegExp(bot.token, "g"), "BAD BOI")}\`\`\`` }
                        ],
                        footer: `Evaluated by ${msg.author.username} in ${m.createdTimestamp - msg.createdTimestamp}ms`
                    }));
                }
            } catch (error) {
                m.edit(bot.embed({
                    title: "Evaluation failed!",
                    fields: [
                        { name: "Code:", value: `\`\`\`xl\n${toEval}\`\`\`` },
                        { name: "Error:", value: `\`\`\`xl\n${error}\`\`\`` }
                    ],
                    color: 0xff0000,
                    footer: `Evaluated by ${msg.author.username} in ${m.createdTimestamp - msg.createdTimestamp}ms`
                }));
            }
        }
    }

};
