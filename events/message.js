module.exports = async (bot, msg) => {
    if (!msg.guild || msg.author.bot) return;
    bot.db.collection("configs").find({ _id: msg.guild.id }).toArray(async (err, config) => {
        if (err) throw err;
        if (!config) {
            config = await bot.db.collection("configs").insertOne({ _id: msg.guild.id, mod_log: null, mod_log_cases: 0, welcome_channel: null, leave_msg: "Farewell **e{user}** we hope you enjoyed you're stay at **e{server_name}**!", prefix: "e.", anti_links: false, anti_swear: false, swear_words: ["SwearWord1", "SwearWord2"], auto_role: null });
            check(msg, config);
            msg.prefix = config.prefix;
            return processCommand(bot, msg);
        } else {
            check(msg, config);
            msg.prefix = config.prefix;
            return processCommand(bot, msg);
        }
    });
};

function check(msg, config) {
    // Swearing check
    if (config.anti_swear && !msg.member.permissions.has("ADMINISTRATOR") && msg.author.id !== msg.guild.owner.id) {
        config.swear_words.forEach(word => {
            if (msg.content.match(new RegExp(word, "gi"))) {
                msg.delete().catch(() => {});
                return msg.reply("Swearing is not allowed here :rage:!").then(m => m.delete(3500));
            }
        });
    } else {}

    // Anti links check
    if (config.anti_links && !msg.member.permissions.has("ADMINISTRATOR") && msg.author.id !== msg.guild.owner.id) {
        // Thanks Godson™#4036 for this RegEx.
        const urlMatch = /^(?:(http[s]?|ftp[s]):\/\/)?([^:\s]+)(:[0-9]+)?((?:\/\w+)*\/)([\w\-.]+[^#?\s]+)([^#\s]*)?(#[\w-]+)?$/gi.exec(msg.content);
        if (urlMatch) {
            msg.delete().catch(() => {});
            return msg.reply("Posting links is not allowed here :rage:!").then(m => m.delete(3500));
        }
    } else {}
}

function processCommand(bot, msg) {
    if (!msg.content.toLowerCase().startsWith(msg.prefix.toLowerCase())) return;
    const split = msg.content.toLowerCase().split(/\s+/g);
    const args = split.slice(1);
    const c = bot.commands.get(split[0].slice(msg.prefix.length)) || bot.aliases.get(split[0].slice(msg.prefix.length));
    if (c) {
        switch (c.config.permission) {
        case "None": { c.run(bot, msg, args); break; }
        case "Bot Owner": { checkPermission(c, "BOT_OWNER", () => { c.run(bot, msg, args); }, msg); break; }
        case "Server Owner": { checkPermission(c, "OWNER", () => { c.run(bot, msg, args); }, msg); break; }
        case "Administrator": { checkPermission(c, "ADMINISTRATOR", () => { c.run(bot, msg, args); }, msg); break; }
        case "Kick Members": { checkPermission(c, "KICK_MEMBERS", () => { c.run(bot, msg, args); }, msg); break; }
        case "Ban Members": { checkPermission(c, "BAN_MEMBERS", () => { c.run(bot, msg, args); }, msg); break; }
        case "Manage Server": { checkPermission(c, "MANAGE_GUILD", () => { c.run(bot, msg, args); }, msg); break; }
        case "Manage Roles": { checkPermission(c, "MANAGE_ROLES", () => { c.run(bot, msg, args); }, msg); break; }
        case "Manage Messages": { checkPermission(c, "MANAGE_MESSAGES", () => { c.run(bot, msg, args); }, msg); break; }
        case "Audit Log": { checkPermission(c, "VIEW_AUDIT_LOG", () => { c.run(bot, msg, args); }, msg); break; }
        default: return console.log("[ERROR] [COMMAND_HANDLER] Invalid permission provided!");
        }
    }
}

function checkPermission(cmd, permission, success = () => {}, msg) {
    if (permission === "OWNER") {
        if (msg.author.id === msg.guild.owner.id) return success();
        else return msg.channel.send(`:x: You cannot run this command as you need to be the server owner!`).then(m => m.delete(3500));
    } else if (permission === "BOT_OWNER") {
        if (msg.author.id === "302604426781261824" || msg.author.id === "199436790581559296") return success();
        else return msg.channel.send(`:x: You cannot run this command as you need to be the bot owner!`).then(m => m.delete(3500));
    } else if (msg.member.permissions.has(permission)) { return success(); } else { return msg.channel.send(`:x: You cannot run this command as it requires the \`${cmd.config.permission}\` permission!`).then(m => m.delete(3500)); }
}
