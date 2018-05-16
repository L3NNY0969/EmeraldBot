const Command = require("../../utils/Command.js");

module.exports = class Ban extends Command {

    constructor() {
        super();
        this.config = {
            name: "ban",
            usage: "ban (mention | user_id)",
            description: "Bans a user from this server for the specified reason.",
            permission: "Ban Members",
            category: "Moderation",
            aliases: []
        };
    }

    run(bot, msg, args) {
        if (!args[0]) return msg.channel.send(`:x: Invalid usage | \`${msg.prefix}ban (mention | user_id)\``);
        if (msg.channel.permissionsFor(bot.user).has("EMBED_LINKS") && msg.channel.permissionsFor(bot.user).has("BAN_MEMBERS")) {
            const user = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(args[0]);
            if (!user) {
                return msg.channel.send(":x: The provided user was not found on this server.");
            } else {
                if (user.user.equals(bot.user)) {
                    return msg.channel.send(bot.embed({
                        title: ":white_check_mark: User not Banned!",
                        description: `You cannot ban the Emerald.`,
                        footer: `Not banned by ${msg.author.tag}`,
                        timestamp: true
                    }));
                } else if (user.user.equals(msg.author)) {
                    return msg.channel.send(bot.embed({
                        title: ":white_check_mark: User not Banned!",
                        description: `You cannot ban your self.`,
                        footer: `Not banned by ${msg.author.tag}`,
                        timestamp: true
                    }));
                }
                const reason = args.join(" ").slice(args[0].length + 1);
                if (!reason) return msg.channel.send("Please provide a reason why you are banning this user.");
                user.ban(`Banned by ${msg.author.tag} for ${reason}`).then(() => {
                    msg.channel.send(bot.embed({
                        title: ":white_check_mark: User Banned!",
                        description: `\`${user.user.tag}\` has been banned for \`${reason}\` successfully.`,
                        footer: `Banned by ${msg.author.tag}`,
                        timestamp: true
                    }));
                }).catch(() => {
                    msg.channel.send(":x: This user cannot be banned.");
                });
            }
        } else {
            return msg.channel.send(":x: I am missing the `Ban Members` or the `Embed Links` permission. Please give me both permissions and try again!");
        }
    }

};
