module.exports = (bot, guild) => {
    bot.channels.get("452716292827512832").send(`:frowning: I have left \`${guild.name}\` I am now in \`${bot.guilds.size}\` servers!`);
    bot.db.collection("configs").deleteOne({ _id: guild.id });
};
