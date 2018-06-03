module.exports = (bot, guild) => {
    bot.channels.get("442766709758361601").send(`:slight_smile: I have joined \`${guild.name}\` I am now in \`${bot.guilds.size}\` servers!`);
    bot.db.collection("configs").insertOne({
        _id: guild.id,
        mod_log: null,
        mod_log_cases: 0,
        welcome_channel: null,
        welcome_msg: ":wave: Hello **{user}** welcome to **{server}**, and enjoy your stay.",
        leave_msg: "Farewell **{user}** we hope you enjoyed you're stay at **{server}**!",
        prefix: "l.",
        anti_links: false,
        anti_swear: false,
        swear_words: ["SwearWord1", "SwearWord2"],
        auto_role: null
    });
};
