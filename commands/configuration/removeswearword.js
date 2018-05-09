module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"])) return;

    if (!args[0]) {
        return msg.channel.send(bot.embed({
            title: ":x: Args Error",
            description: "Please enter a swear word to remove.",
            color: 0xff0000
        }));
    }
    msg.delete().catch(() => {});
    bot.db.collection("configs").find({ _id: msg.guild.id }).toArray(async (error, config) => {
        if (config[0].swear_words.indexOf(args[0])) {
            config[0].swear_words.splice(config[0].swear_words.indexOf(), 1);
            await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { swear_words: config[0].swear_words } });
            msg.channel.send(":white_check_mark: Swear word removed.");
        } else { return msg.channel.send(":x: Swear word not found."); }
    });
};

module.exports.config = {
    name: "removeswearword",
    usage: "removeswearword [word]",
    description: "Remove a swear word.",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["rswearword", "rsw"]
};
