const { get } = require("superagent");
const { Canvas } = require("canvas-constructor");

module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "ATTACH_FILES"])) return;
    msg.channel.startTyping();
    const member = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(args[0]) || msg.member;
    const Inverted = await makeImage(member);
    return msg.channel.send(`**${member.user.tag}** is now inverted.`, { file: { attachment: Inverted } })
        .then(() => msg.channel.stopTyping());
};

async function makeImage(member) {
    const pfp = await get(member.user.displayAvatarURL);
    return new Canvas(256, 256)
        .addImage(pfp.body, 0, 0, 256, 256)
        .setGlobalCompositeOperation("difference")
        .setColor("white")
        .addRect(0, 0, 256, 256)
        .toBufferAsync();
}

module.exports.config = {
    name: "invert",
    usage: "invert [mention | id]",
    description: "Inverts a user or yourself.",
    permission: "None",
    category: "Fun",
    aliases: []
};
