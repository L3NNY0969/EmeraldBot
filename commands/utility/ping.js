module.exports.run = async (bot, msg) => {
    if (!msg.channel.permissionsFor(bot.user).has(["EMBED_LINKS", "SEND_MESSAGES"])) return;
    return msg.channel.send(":ping_pong: Hit!").then(async m => {
        setTimeout(() => {
            m.edit(bot.embed({
                title: "Pong?",
                fields: [
                    { name: "Message ping:", value: `**${Math.floor(m.createdTimestamp - msg.createdTimestamp)}**ms` },
                    { name: "API ping:", value: `**${Math.floor(bot.ping)}**ms` }
                ],
                footer: `Requested by ${msg.author.tag}`,
                timestamp: true
            }));
        }, m.createdTimestamp - msg.createdTimestamp);
    });
};

module.exports.config = {
    name: "ping",
    usage: "None",
    description: "Pong?",
    permission: "None",
    category: "Utility",
    aliases: []
};
