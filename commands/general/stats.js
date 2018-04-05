module.exports.run = async (bot, msg, args) => {
    let embed = bot.embed({
        author: {
            name: "Bot statistics!",
            icon: bot.user.avatarURL
        },
        fields: [
            {
                name: "Servers:",
                value: bot.guilds.size,
                inline: true,
            },
            {
                name: "Users:",
                value: bot.users.size,
                inline: true,
            },
            {
                name: "Commands Loaded:",
                value: bot.commands.size,
                inline: true
            },
            {
                name: "Aliases Loaded:",
                value: bot.aliases.size,
                inline: true
            }
        ],
        footer: `Status report requested by ${msg.author.tag}`,
        footerIcon: msg.author.displayAvatarURL
    });
    msg.channel.send(embed);
}

module.exports.config = {
    name: "stats",
    usage: "None",
    description: "Shows my bot statistics",
    permission: "None",
    category: "General",
    aliases: ["info"]
}