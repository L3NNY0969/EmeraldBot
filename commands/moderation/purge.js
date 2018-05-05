module.exports.run = async (bot, msg, args) => {
    if (msg.channel.permissionsFor(bot.user).has("EMBED_LINKS") && msg.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) {
        const toDelete = args[0];
        if (isNaN(toDelete)) {
            return msg.channel.send(bot.embed({
                title: ":x: Error",
                description: "Please enter a valid number.",
                color: 0xff0000
            }));
        } else {
            if (!toDelete || toDelete < 2 || toDelete > 100) return msg.channel.send(bot.embed({ description: "Please provide a number between 2 and 100." }));
            const success = msg.channel.bulkDelete(args);
            if (success) return msg.channel.send(bot.embed({ title: `Purged ${toDelete} messages!` })).then(m => m.delete(1500));
        }
    } else {
        msg.channel.send(":x: I am missing the `Manage Messages` or the `Embed Links` permission. Please give me both permissions and try again!");
    }
};

module.exports.config = {
    name: "purge",
    usage: "purge (amount)",
    description: "Clear x amount of messages in chat.",
    permission: "Manage Messages",
    category: "Moderation",
    aliases: ["clear"]
};
