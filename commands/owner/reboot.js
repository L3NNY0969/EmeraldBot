module.exports.run = async (bot, msg) => {
    msg.channel.send(":wave: Rebooting");
    bot.reboot()
        .then(r => msg.channel.send(r))
        .catch(r1 => msg.channel.send(r1));
};

module.exports.config = {
    name: "reboot",
    usage: "reboot",
    description: "Reboots the bot.",
    permission: "Bot Owner",
    category: "Owner",
    aliases: []
};
