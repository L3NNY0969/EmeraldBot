module.exports.run = async (bot, msg) => {
    msg.channel.send(":wave: Shutting down!");
    bot.destroy();
    process.exit(0);
};

module.exports.config = {
    name: "shutdown",
    usage: "None",
    description: "Shuts down the bot!",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["turnoff"]
};
