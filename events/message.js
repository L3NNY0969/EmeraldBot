module.exports = async (bot, msg) => {
    bot.db.collection("configs").find({ _id: msg.guild.id }).toArray(async (err, config) => {
        config = config[0];
        if(!config) {
            config = await bot.db.collection("configs").insertOne({ _id: msg.guild.id, mod_log: null, mod_log_cases: 0, welcome_channel: null, leave_msg: "Farewell **e{user}** we hope you enjoyed you're stay at **e{server_name}**!", prefix: "e.", anti_links: false, anti_swear: false, swear_words: ["SwearWord1", "SwearWord2"], auto_role: null });
            msg.prefix = config.prefix;
            return processCommand(bot, msg);
        } else {
            msg.prefix = config.prefix;
            return processCommand(bot, msg);
        }
    });
}

function processCommand(bot, msg) {
    if(!msg.content.toLowerCase().startsWith(msg.prefix.toLowerCase())) return;
    let split = msg.content.split(/\s+/g);
    let args = split.slice(1);
    let c = bot.commands.get(split[0].slice(msg.prefix.length)) || bot.aliases.get(split[0].slice(msg.prefix.length));
    if(c) {
        switch(c.config.permission) {
            case "None": {c.run(bot, msg, args); break;}
            case "Bot Owner": {checkPermission(c, "BOT_OWNER", () => {c.run(bot, msg, args)}, msg); break;}
            case "Server Owner": {checkPermission(c, "OWNER", () => {c.run(bot, msg, args)}, msg); break;}
            case "Administrator": {checkPermission(c, "ADMINISTRATOR", () => {c.run(bot, msg, args)}, msg); break;}
            case "Kick Members": {checkPermission(c, "KICK_MEMBERS", () => {c.run(bot, msg, args)}, msg); break;}
            case "Ban Members": {checkPermission(c, "BAN_MEMBERS", () => {c.run(bot, msg, args)}, msg); break;}
            case "Manage Server": {checkPermission(c, "MANAGE_GUILD", () => {c.run(bot, msg, args)}, msg); break;}
            case "Manage Roles": {checkPermission(c, "MANAGE_ROLES", () => {c.run(bot, msg, args)}, msg); break;}
            case "Manage Messages": {checkPermission(c, "MANAGE_MESSAGES", () => {c.run(bot, msg, args)}, msg); break;}
            case "Audit Log": {checkPermission(c, "VIEW_AUDIT_LOG", () => {c.run(bot, msg, args)}, msg); break;}
            default: return console.log("[ERROR] [COMMAND_HANDLER] Invalid permission provided!")
        }
    }
}

function checkPermission(cmd, permission, success = () => {}, msg) {
    if(permission === "OWNER") {
        if(msg.author.id === msg.guild.owner.id) return success();
        else return msg.channel.send(`:x: You cannot run this command as you need to be the server owner!`).then(m => m.delete(3500));
    } else if(permission === "BOT_OWNER") {
        if(msg.author.id === "302604426781261824" || msg.author.id === "199436790581559296") return success();
        else return msg.channel.send(`:x: You cannot run this command as you need to be the bot owner!`).then(m => m.delete(3500));
    } else {
        if(msg.member.permissions.has(permission)) return success();
        else return msg.channel.send(`:x: You cannot run this command as it requires the \`${cmd.config.permission}\` permission!`).then(m => m.delete(3500));
    }
}