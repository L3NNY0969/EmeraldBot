const Command = require("../../utils/Command.js");

module.exports = class Mute extends Command {

    constructor() {
        super();
        this.config = {
            name: "mute",
            usage: "mute [id|mention]",
            description: "Mutes or Unmutes a user",
            permission: "Kick Members",
            category: "Moderation",
            aliases: []
        };
    }

    async run(bot, msg, args) {
        if (!msg.channel.permissionsFor(bot.user).has(["MANAGE_ROLES", "MANAGE_CHANNELS", "SEND_MESSAGES", "EMBED_LINKS"])) return;
        const user = msg.guild.members.get(args[0]) || msg.mentions.members.first();
        if (!user) return msg.channel.send(`:x: Invalid usage \`${msg.prefix}mute [id|username|mention]\`.`);
        let muteRole = msg.guild.roles.find("name", "LENNY_MUTE");
        if (!muteRole) {
            muteRole = await msg.guild.createRole({
                name: "LENNY_MUTE",
                permissions: [],
                color: 0x010101
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
            const reason = args.join(" ").slice(args[0].length + 1);
            await user.addRole(muteRole, `Muted by ${msg.author.tag} for ${reason || "No reason provided by muter."}`);
            msg.channel.send(bot.embed({
                title: ":white_check_mark: User Muted!",
                description: `\`${user.user.tag}\` has been muted for ${reason || "No reason provided by muter."}`,
                footer: `Muted by ${msg.author.tag}`,
                timestamp: true
            }));
            bot.db.collection("configs").find({ _id: msg.guild.id }).toArray(async (err, config) => {
                if (err) throw err;
                if (!config[0].mod_log) return;

                const channel = msg.guild.channels.get(config[0].mod_log);
                if (!channel || !channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

                config[0].mod_log_cases++;
                await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { mod_log_cases: config[0].mod_log_cases } });
                await channel.send(bot.embed({
                    author: {
                        name: `User muted with the zipper.`,
                        icon: user.user.displayAvatarURL
                    },
                    fields: [
                        { name: "User", value: user.user.tag },
                        { name: "Muted By", value: msg.author.tag },
                        { name: "Reason Provided", value: reason || "No reason provided by kicker." }
                    ],
                    footer: `Case #${config[0].mod_log_cases}`
                }));
            });
        } else {
            await user.removeRole(muteRole, `Unmuted by ${msg.author.tag}`);
            msg.channel.send(bot.embed({
                title: ":white_check_mark: User Unmuted!",
                description: `\`${user.user.tag}\` has been unmuted.`,
                footer: `Unmuted by ${msg.author.tag}`,
                timestamp: true
            }));
        }
    }

};
