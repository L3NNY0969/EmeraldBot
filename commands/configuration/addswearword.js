module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"])) return;

    if (!args[0]) {
        return msg.channel.send(bot.embed({
            title: ":x: Args Error",
            description: "Please enter a swear word to add.",
            color: 0xff0000
        }));
    }
    msg.delete().catch(() => {});
    bot.db.collection("configs").find({ _id: msg.guild.id }).toArray(async (error, config) => {
        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { swear_words: config[0].swear_words.push(args[0]) } });
        msg.channel.send(":white_check_mark: Swear word added.");
    });
};

module.exports.config = {
    name: "addswearword",
    usage: "addswearword [word]",
    description: "Adds a swear word to the servers swear word list.",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["aswearword", "asw"]
};
