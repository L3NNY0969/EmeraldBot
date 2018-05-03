const {RichEmbed} = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    msg.channel.send(":ping_pong: Hit!").then(async m => {
        setTimeout(() => {
            m.edit(bot.embed({
                title: "Pong?",
                fields: [
                    {name: "Message ping:", value: `**${~~(m.createdTimestamp - msg.createdTimestamp)}**ms`},
                    {name: "API ping:", value: `**${~~(bot.ping)}**ms`}
                ],
                footer: `Requested by ${msg.author.tag}`,
                timestamp: true
            }));
        }, m.createdTimestamp - msg.createdTimestamp);
    });
}

module.exports.config = {
    name: "ping",
    usage: "None",
    description: "Pong?",
    permission: "None",
    category: "Utility",
    aliases: []
}