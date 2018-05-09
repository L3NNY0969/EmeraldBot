module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

    if (!args.join(" ")) {
        return msg.channel.send(bot.embed({
            title: ":x: Error!",
            description: "Please enter a leave message.\nValid placeholders:",
            fields: [
                { name: "e{user}", value: "Displays the users name and tag Ex: Ice#1234", inline: false },
                { name: "e{server_name}", value: "The name of the current server Ex: Emerald Bot", inline: false },
                { name: "e{server_id}", value: "The id of the current server Ex: 430211079340163072", inline: false },
                { name: "e{server_memcount}", value: "The current members in the current server Ex: 110", inline: false }
            ],
            color: 0xff0000
        }));
    }

    if (args.join(" ").length > 100) return msg.channel.send(":x: Max leave message length is 100 characters.");

    await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { leave_msg: args.join(" ") } });
    msg.channel.send(bot.embed({
        title: ":white_check_mark: Leave message updated!",
        description: `The leave message has been set to \`${args.join(" ")}\`.`
    }));
};


module.exports.config = {
    name: "setleave",
    usage: "setleave [message]",
    description: "Sets the servers leave message.",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["sleave"]
};
