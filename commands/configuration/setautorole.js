module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

    if (msg.mentions.roles.first() || args[0] === "reset" || msg.guild.roles.get(args[0])) {
        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { auto_role: msg.mentions.roles.first() ? msg.mentions.roles.first().id : msg.guild.roles.find("id", args[0]) ? msg.guild.roles.find("id", args[0]).id : null } });
        msg.channel.send(bot.embed({
            title: ":white_check_mark: Auto role updated!",
            description: `The auto role ${msg.mentions.roles.first() ? `was updated to ${msg.mentions.roles.first()}` : msg.guild.roles.get(args[0]) ? `was updated to ${msg.guild.roles.get(args[0])}` : "has been reset"}\nUsers who join will receive this role.`
        }));
    } else {
        return msg.channel.send(bot.embed({
            title: ":x: Error!",
            description: "Please enter the role id, reset or simply mention the role *not recommended for large servers*.",
            color: 0xff0000
        }));
    }
};

module.exports.config = {
    name: "setautorole",
    usage: "setautorole [id | @role | reset]",
    description: "Enables/Disables the servers auto role.",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["sautorole"]
};
