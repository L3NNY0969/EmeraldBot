module.exports.run = async (bot, msg) => {
    msg.channel.send(bot.embed({
        author: {
            name: "Special thanks to:",
            icon: bot.user.avatarURL
        },
        footer: `Requested by ${msg.author.tag}`,
        footerIcon: msg.author.avatarURL,
        timestamp: true,
        fields: [
            { name: "Ice#1234 (Owner)", value: "For coding the bot and making it online 24/7 well minus downtime." },
            { name: "IslaNub#8347 (Owner)", value: "For creating the bot app and the cool graphics." },
            { name: "Bacon#1153", value: "For helping with a lot of code." },
            { name: "Sakeusi#2020", value: "For beta testing and suggestions!" }
        ]
    })).catch(() => {});
};

module.exports.config = {
    name: "credits",
    usage: "None",
    description: "Displays the wonderful people who made me possible!",
    permission: "None",
    category: "General",
    aliases: []
};
