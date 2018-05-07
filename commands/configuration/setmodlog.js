module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

    if (msg.mentions.channels.first() || args[0] === "none") {
        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { mod_log: msg.mentions.channels.first().id || null } });
        msg.channel.send(bot.embed({
            title: ":white_check_mark: Mod log channel updated!",
            description: `The mod log channel was changed to ${msg.mentions.channels.first() || "none"}`
        }));
    } else {
        return msg.channel.send(bot.embed({
            title: ":x: Error!",
            description: "Please mention a channel or type none.",
            color: 0xff0000
        }));
    }
};

module.exports.config = {
    name: "setmodlog",
    usage: "setmodlog [#channel | none]",
    description: "Sets the Mod Logs channel for when a user is kicked, muted, unmuted, banned/unbanned.",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["smodlog"]
};
