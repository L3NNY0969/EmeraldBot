module.exports.run = async (bot, msg, args) => {
    if(!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

    if(!args[0]) return msg.channel.send(bot.embed({
        title: ":x: Args Error",
        description: "Please enter a valid option on or off.",
        color: 0xff0000
    }));
    if(args[0] === "on") {
        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { anti_links: true } });
        msg.channel.send(bot.embed({
            title: ":x: Anti links updated!",
            description: "Anti links has been turned on."
        }));
    } else if(args[0] === "off") {
        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { anti_links: false } });
        msg.channel.send(bot.embed({
            title: ":x: Anti links updated!",
            description: "Anti links has been turned off."
        }));
    } else return msg.channel.send(bot.embed({
        title: ":x: Args Error",
        description: "Please enter a valid option on or off.",
        color: 0xff0000
    }));
}

module.exports.config = {
    name: "setantilinks",
    usage: "setantilinks [on | off]",
    description: "Turns on or off anti links for the server.",
    permission: "Administrator",
    category: "Configuration",
    aliases: ["santilinks"]
}