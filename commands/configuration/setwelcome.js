module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

    if (!msg.mentions.channels.first() || args[0] !== "none") {
        return msg.channel.send(bot.embed({
            title: ":x: Error!",
            description: "Please mention a channel or simply type none.",
            color: 0xff0000
        }));
    }

    await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { welcome_channel: msg.mentions.channels.first().id || null } });
    msg.channel.send(bot.embed({
        title: ":white_check_mark: Welcome channel updated!",
        description: `The welcome channel was updated to ${msg.mentions.channels.first() || "none"}`
    }));
};

module.exports.config = {
    name: "setwelcome",
    usage: "setwelcome [#channel | none]",
    description: "Sets the channel for the server (Welcomes/Leaves will be enabled after this setting is applied).",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["swelcome"]
};
