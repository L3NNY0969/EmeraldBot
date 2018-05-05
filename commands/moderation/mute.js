module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["MANAGE_ROLES", "MANAGE_CHANNELS", "SEND_MESSAGES", "EMBED_LINKS"])) return;
    const user = msg.guild.members.get(args[0]) || msg.mentions.members.first();
    if (!user) return msg.channel.send(`:x: Invalid usage \`${msg.prefix}mute [id|username|mention]\`.`);
    let muteRole = msg.guild.roles.find("name", "Emerald Mute");
    if (!muteRole) {
        muteRole = await msg.guild.createRole({
            name: "Emerald Mute",
            permissions: [],
            color: bot.color
        });
        msg.guild.channels.forEach(async (channel) => {
            await channel.overwritePermissions(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                CONNECT: false
            });
        });
    }
    if (!user.roles.has(muteRole.id)) {
        if (!args.join(" ").slice(args[0].length + 1)) return msg.channel.send(`:x: Please provide a reason for this mute`);
        await user.addRole(muteRole, `Muted by ${msg.author.tag} for ${args.join(" ").slice(user.user.toString().length + 1)}`);
        msg.channel.send(bot.embed({
            title: ":white_check_mark: User Muted!",
            description: `\`${user.user.tag}\` has been muted for ${args.join(" ").slice(user.user.toString().length + 1)}`,
            footer: `Muted by ${msg.author.tag}`,
            timestamp: true
        }));
    } else {
        await user.removeRole(muteRole, `Unmuted by ${msg.author.tag}`);
        msg.channel.send(bot.embed({
            title: ":white_check_mark: User Unmuted!",
            description: `\`${user.user.tag}\` has been unmuted.`,
            footer: `Unmuted by ${msg.author.tag}`,
            timestamp: true
        }));
    }
};

module.exports.config = {
    name: "mute",
    usage: "mute [id|mention]",
    description: "Mutes or Unmutes a user",
    permission: "Kick Members",
    category: "Moderation",
    aliases: []
};
