const superagent = require('superagent');

module.exports.run = async (bot, msg, args) => {
    let toEval = args.join(" ");
    if(!toEval) return msg.channel.send(":x: You must provide code to evaluate!");
    else {
        let m = await msg.channel.send(`Evaluating \`${toEval}\``);
        try {
            let result = eval(toEval);
            if(typeof(result) != "string")
                result = await require("util").inspect(result, true, 0);
            let haste = await bot.haste(result);
            m.edit(bot.embed({
                title: "Evaluation success!",
                fields: [
                    {name: "Code:", value: `\`\`\`xl\n${toEval}\`\`\``},
                    {name: "Result:", value: `${result.length === 1010 ? `\`${haste.raw.replace(bot.token, "Stop it thats my discord token!", bot.config.tokens.youtube, "Stop it thats my youtube token!")}\`` : `\`\`\`xl\n${result.replace(bot.token, "Stop it thats my discord token!").replace(bot.config.tokens.youtube, "Stop it thats my youtube token!")}\`\`\``}`}
                ],
                footer: `Evaluated by ${msg.author.username} in ${m.createdTimestamp - msg.createdTimestamp}ms`
            }));
        } catch (error) {
            m.edit(bot.embed({
                title: "Evaluation failed!",
                fields: [
                    {name: "Code:", value: `\`\`\`xl\n${toEval}\`\`\``},
                    {name: "Error:", value: `\`\`\`xl\n${error}\`\`\``}
                ],
                color: 0xff0000,
                footer: `Evaluated by ${msg.author.username} in ${m.createdTimestamp - msg.createdTimestamp}ms`
            }));
        }
    }
}

module.exports.config = {
    name: "eval",
    usage: "eval (code)",
    description: "Evaluates code",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["ev"]
}