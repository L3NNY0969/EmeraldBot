module.exports.run = async (bot, msg, args) => {
    msg.channel.send(":wave: Rebooting...");
    setTimeout(() => {
        process.exit();
    }, 5000);
}

module.exports.config = {
    name: "reboot",
    usage: "None",
    description: "Restarts/Reboots the bot",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["restart"]
}
