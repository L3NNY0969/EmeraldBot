module.exports.run = async (bot, msg, args) => {
    msg.channel.send(":wave: Shutting down!");
    bot.destroy();
}

module.exports.config = {
    name: "shutdown",
    usage: "None",
    description: "Shuts down the bot!",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["turnoff"]
}