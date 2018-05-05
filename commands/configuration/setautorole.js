module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

    if (!msg.mentions.roles.first() || args[0] !== "none" || !msg.guild.roles.find("id", args[0])) {
        return msg.channel.send(bot.embed({
            title: ":x: Error!",
            description: "Please enter the role id, none or mention the role *not recommended for big servers*.",
            color: 0xff0000
        }));
    }

    await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { auto_role: msg.mentions.roles.first().id || msg.guild.roles.find("id", args[0]).name } || null });
    msg.channel.send(bot.embed({
        title: ":white_check_mark: Auto role updated!",
        description: `The auto role was updated to ${msg.mentions.roles.first().name || msg.guild.roles.find("id", args[0]).name || "none"}\nUsers who join will receive this role.`
    }));
};

module.exports.config = {
    name: "setautorole",
    usage: "setautorole [id | @role | none]",
    description: "Enables/Disables the servers auto role feature or disables it",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["sautorole"]
};
