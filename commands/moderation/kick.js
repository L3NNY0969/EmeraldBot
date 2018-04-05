module.exports.run = async (bot, msg, args) => {
    if(!args[0]) return msg.channel.send(`:x: Invalid usage | \`${msg.prefix}kick (mention | user_id)\``);
    if(msg.channel.permissionsFor(bot.user).has("EMBED_LINKS") && msg.channel.permissionsFor(bot.user).has("KICK_MEMBERS")) {
        let user = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(args[0]);
        if(!user) return msg.channel.send(":x: The provided user was not found on this server.");
        else {
            let reason = args.join(" ").slice(args[0].length+1);
            if(!reason) return msg.channel.send("Please provide a reason why you are kicking this user.");
            user.kick(`Kicked by ${msg.author.tag} for ${reason}`).then(() => {
                msg.channel.send(bot.embed({
                    title: ":white_check_mark: User kicked!",
                    description: `\`${user.user.tag}\` has been kicked for \`${reason}\` successfully.`,
                    footer: `Kicked by ${msg.author.tag}`,
                    timestamp: true
                }));
            });
        }
    } else return msg.channel.send(":x: I am missing the `Kick Members` or the `Embed Links` permission. Please give me both permissions and try again!");
}

module.exports.config = {
    name: "kick",
    usage: "kick (mention | user_id)",
    description: "Kicks a user from this server for the specified reason.",
    permission: "Kick Members",
    category: "Moderation",
    aliases: []
}