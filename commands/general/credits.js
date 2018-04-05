module.exports.run = async (bot, msg, args) => {
    msg.channel.send(bot.embed({
        author: {
            name: "Special thanks to:",
            icon: bot.user.avatarURL
        },
        footer: `Requested by ${msg.author.tag}`,
        footerIcon: msg.author.avatarURL,
        timestamp: true,
        fields: [
            {name: "Ice#1234", value: "For coding the bot and making it live."},
            {name: "IslaNub#8347", value: "For creating the bot app and the cool graphics."},
            {name: "Bacon#1153", value: "For letting me use his avatar code and helping me with some RegEx."},
            {name: "Sakeusi#7808", value: "For beta testing and suggestions!"}
        ]
    }));
}

module.exports.config = {
    name: "credits",
    usage: "None",
    description: "Displays the wonderful people who made me possible!",
    permission: "None",
    category: "General",
    aliases: []
}