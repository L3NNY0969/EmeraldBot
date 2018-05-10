const WebSocket = require("ws");

module.exports.run = async (bot, msg, args) => {
    if (bot.magikCooldowns.has(msg.author.id)) return msg.channel.send(":x: This command has a 30 second cooldown.");

    msg.channel.startTyping();
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "ATTACH_FILES"])) return;

    const member = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(args[0]);
    if (!member) { msg.channel.send("You must provide a user to be magiked."); return msg.channel.stopTyping(true); }
    if (!args[1] || args[1] < 2 || args[1] > 10) { msg.channel.send("Please provide a depth between 2 and 10"); return msg.channel.stopTyping(true); }

    bot.magikCooldowns.add(msg.author.id);
    setTimeout(() => bot.magikCooldowns.delete(msg.author.id), 30000);

    const Con = new WebSocket("ws://127.0.0.1:25/");
    Con.on("open", () => {
        Con.send(JSON.stringify({ avatar: member.user.displayAvatarURL, depth: args[1] }));
    });
    Con.on("message", (m) => {
        msg.channel.send(`**${member.user.tag}** has been magikd!`, { file: { attachment: Buffer.from(m) } });
        msg.channel.stopTyping(true);
    });
};

module.exports.config = {
    name: "magik",
    usage: "magik [mention | id] [depth]",
    description: "Makes you or someone else Magik.",
    permission: "None",
    category: "Fun",
    aliases: []
};
