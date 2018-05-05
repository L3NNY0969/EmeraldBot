module.exports.run = async (bot, msg) => {
    msg.channel.send(`Here is my invite link:\n<${bot.invite}>`);
};

module.exports.config = {
    name: "invite",
    usage: "None",
    description: "Gives you a invite link to add me to your server",
    permission: "None",
    category: "General",
    aliases: ["inv"]
};
