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
                        description: `You cannot ban the almighty lenny.`,
                        footer: `Not banned by ${msg.author.tag}`,
                        timestamp: true
                    }));
                } else if (user.user.equals(msg.author)) {
                    return msg.channel.send(bot.embed({
                        title: ":white_check_mark: User not Banned!",
                        description: `You cannot ban your self. **why would you want to do that?**`,
                        footer: `Not banned by ${msg.author.tag}`,
                        timestamp: true
                    }));
                }
                msg.delete().catch(() => {});
                const reason = args.join(" ").slice(args[0].length + 1);
                user.ban(reason || "No reason provided by banner.").then(() => {
                    msg.channel.send(`:white_check_mark: **${user.user.tag}** was banned for \`${reason || "No reason provided by banner"}\``);
                    bot.db.collection("configs").find({ _id: msg.guild.id }).toArray(async (err, config) => {
                        if (err) throw err;
                        if (!config[0].mod_log) return;

                        const channel = msg.guild.channels.get(config[0].mod_log);
                        if (!channel || !channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

                        config[0].mod_log_cases++;
                        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { mod_log_cases: config[0].mod_log_cases } });
                        await channel.send(bot.embed({
                            author: {
                                name: `User banned with a hammer.`,
                                icon: user.user.displayAvatarURL
                            },
                            fields: [
                                { name: "User", value: user.user.tag },
                                { name: "Banned By", value: msg.author.tag },
                                { name: "Reason Provided", value: reason || "No reason provided by banner." }
                            ],
                            footer: `Case #${config[0].mod_log_cases}`
                        }));
                    });
                }).catch(() => {
                    msg.channel.send(":x: This user cannot be banned.");
                });
            }
        } else {
            return msg.channel.send(":x: I am missing the `Ban Members` or the `Embed Links` permission. Please give me both permissions and try again!");
        }
    }

};
