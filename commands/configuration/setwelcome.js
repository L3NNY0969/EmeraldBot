module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

    if (msg.mentions.channels.first() || args[0] === "reset") {
        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { welcome_channel: msg.mentions.channels.first() ? msg.mentions.channels.first().id : null } });
        msg.channel.send(bot.embed({
            title: ":white_check_mark: Welcome channel updated!",
            description: `The welcome channel ${msg.mentions.channels.first() ? `was updated to ${msg.mentions.channels.first()}` : "has been reset"}`
        }));
    } else {
        return msg.channel.send(bot.embed({
            title: ":x: Error!",
            description: "Please mention a channel or simply type reset.",
            color: 0xff0000
        }));
    }
};

module.exports.config = {
    name: "setwelcome",
    usage: "setwelcome [#channel | reset]",
    description: "Sets the channel for the server (Welcomes/Leaves will be enabled after this setting is applied).",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["swelcome"]
};
