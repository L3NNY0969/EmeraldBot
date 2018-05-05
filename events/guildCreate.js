module.exports = (bot, guild) => {
    bot.channels.get("430263132896624651").send(`:slight_smile: I have joined \`${guild.name}\` I am now in \`${bot.guilds.size}\` servers!`);
    bot.user.setActivity(`with ${bot.guilds.size} emeralds | e.help`);
    bot.db.collection("configs").insertOne({ _id: guild.id, mod_log: null, mod_log_cases: 0, welcome_channel: null, leave_msg: "Farewell **e{user}** we hope you enjoyed you're stay at **e{server_name}**!", prefix: "e.", anti_links: false, anti_swear: false, swear_words: ["SwearWord1", "SwearWord2"], auto_role: null });
};
