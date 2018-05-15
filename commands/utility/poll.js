module.exports.run = async (bot, msg, args) => {
    if (!args[0]) return msg.channel.send(`:x: Invalid usage: \`\``);
};

module.exports.config = {
    name: "poll",
    usage: "poll [question]",
    description: "Creates a poll out of the question you choose.",
    permission: "None",
    category: "Utility",
    aliases: []
};
