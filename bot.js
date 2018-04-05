const Discord = require('discord.js');
const bot = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START', 'TYPING_STOP', 'GUILD_SYNC', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE', 'USER_SETTINGS_UPDATE', 'USER_NOTE_UPDATE'],
    reconnect: true
});
const snekfetch = require('snekfetch');
const {readdir, readdirSync} = require('fs');

//Needed
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
global.players = new Discord.Collection();
bot.db = require("sqlite");
bot.db.open("./database.sqlite");
bot.config = require('./config.json');
bot.color = 0x55B88E;
bot.login(bot.config.tokens.discord);

//Functions
bot.embed = function(options = {}) {
    let title = options.title ? options.title : undefined;
    let thumbnail = options.thumbnail ? options.thumbnail : undefined;
    let image = options.image ? options.image : undefined;
    let description = options.description ? options.description : undefined;
    let footer = options.footer ? options.footer : undefined;
    let timestamp = options.timestamp ? options.timestamp : false;
    let footerIcon = options.footerIcon ? options.footerIcon : null;
    let fields = options.fields ? options.fields : undefined;
    let color = options.color ? options.color : bot.color;
    let author = options.author ? options.author : undefined;
    let embed = new Discord.RichEmbed();

    if(fields === undefined) {} else for(let field of fields) embed.addField(field.name, field.value, field.inline ? field.inline : false);
    if(title === undefined) {} else embed.setTitle(title);
    if(description === undefined) {} else embed.setDescription(description);
    if(color === undefined) {} else embed.setColor(color);
    if(author === undefined) {} else embed.setAuthor(author.name, author.icon, author.url ? author.url : null);
    if(timestamp === false) {} else embed.setTimestamp();
    if(footer === undefined) {} else embed.setFooter(footer, footerIcon);
    if(thumbnail === undefined) {} else embed.setThumbnail(thumbnail);
    if(image === undefined) {} else embed.setImage(image);

    return embed;
}
bot.haste = function(text) {
    return new Promise(async (res, rej) => {
        if(!text) rej("Text needs to be provided!");
        snekfetch.post("https://hastebin.com/documents").send(text).then(r => {
            res(`https://hastebin.com/${r.body.key}`);
        }).catch(e => rej(e));
    });
}
bot.escapeMarkdown = function(text) {
    return text
    .replace(/\*/g, "")
    .replace(/\`/g, "")
    .replace(/\n/g, "")
    .replace(/\</g, "")
    .replace(/\>/g, "")
    .replace(/\#/g, "")
    .replace(/\@/g, "")
    .replace(/\"/g, "")
    .replace(/\'/g, "")
    .replace(/\_/g, "")
}

//Events
bot.on("guildMemberAdd", (member) => {
    bot.db.get(`SELECT * FROM configs WHERE ${member.guild.id}`).then(config => {
        if(config.welcome_channel === null) return;
        else {
            if(config.auto_role === null) {} else member.addRole(config.auto_role, "New user").catch(e => console.log(`[INFO] Failed to auto role ${member.user.username} in ${member.guild.name}(${member.guild.id}) reason: ${e.message}`));
            let c = member.guild.channels.get(config.welcome_channel);
            if(!(c || c.permissionsFor(bot.user).has("SEND_MESSAGES"))) return; //What does it do if it cannot find the channel or the bot cannot send the message? We simply return
            else c.send(config.welcome_msg
                .replace("e{user_mention}", member)
                .replace("e{user_no_mention}", member.user.tag)
                .replace("e{server_name}", member.guild.name)
                .replace("e{server_id}", member.guild.id)
                .replace("e{server_memcount}", member.guild.members.size)
            );
        }
    });
});

bot.on("guildMemberRemove", (member) => {
    bot.db.get(`SELECT * FROM configs WHERE ${member.guild.id}`).then(config => {
        if(config.welcome_channel === null) return;
        else {
            let c = member.guild.channels.get(config.welcome_channel);
            if(c === null || c.permissionsFor(bot.user).has("SEND_MESSAGES") === false) return; //What does it do if it cannot find the channel or the bot cannot send the message? We simply return
            else c.send(config.leave_msg
                .replace("e{user}", member.user.tag)
                .replace("e{server_name}", member.guild.name)
                .replace("e{server_id}", member.guild.id)
                .replace("e{server_memcount}", member.guild.members.size)
            );
        }
    });
});

bot.on("guildCreate", guild => {
    bot.channels.get("430263132896624651").send(`:slight_smile: I have joined \`${guild.name}\` I am now in \`${bot.guilds.size}\` servers!`);
    bot.user.setActivity(`with ${bot.guilds.size} emeralds! | e.help`);
    bot.db.run("INSERT INTO configs (server, mod_log, mod_log_cases, welcome_channel, welcome_msg, leave_msg, prefix, anti_links, anti_swear, swear_words, auto_role) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [guild.id, null, 0, null, "Hello **e{user_no_mention}** and welcome to **e{server_name}**. You're member #e{server_memcount}", "Farewell **e{user}** we hope you enjoyed you're stay at **e{server_name}**!", "e.", "Disabled", "Disabled", "Word1,Word2", null]);
});

bot.on("guildDelete", guild => {
    bot.channels.get("430263132896624651").send(`:frowning: I have left \`${guild.name}\` I am now in \`${bot.guilds.size}\` servers!`);
    bot.user.setActivity(`with ${bot.guilds.size} emeralds! | e.help`);
    bot.db.run(`DELETE FROM configs WHERE server = ${guild.id}`);
});

bot.on("warn", e => console.log(`[WARNING] ${e}`));
bot.on("error", e => console.log(`[ERROR] ${e}`));
bot.on("disconnect", e => console.log(`[DISCONNECTED] ${e}`));

bot.on("ready", async () => {
    bot.invite = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(`
-+-+-{ Bot Online }+-+-+

User: ${bot.user.tag}
Id: ${bot.user.id}
Servers: ${bot.guilds.size}
Users: ${bot.users.size}
Invite: ${bot.invite}

-+-+-+-+-+--+-+-+-+-+-+`.trim());
    let dirs = readdirSync("./commands/");
    dirs.forEach(dir => {
        readdir(`./commands/${dir}`, function(err, files) {
            let js_files = files.filter(f => f.split(".").pop() === "js");
            if(js_files.length === 0) console.log("[INFO] Skipped dir "+dir+" with reason: No commands to load!");
            else {
                js_files.forEach(function(f, i) {
                    let command = require(`./commands/${dir}/${f}`);
                    bot.commands.set(command.config.name, command);
                    for(let alias of command.config.aliases) {
                        bot.aliases.set(alias, command);
                    }
                });
            }
        });
    });
    setTimeout(() => { //We timeout here because of the message logging before all commands are loaded
        console.log(`[INFO] Finished loading all commands and their aliases... ${bot.commands.size} commands were loaded and ${bot.aliases.size} aliases where loaded!.`);
    }, 250);
    bot.user.setActivity(`with ${bot.guilds.size} emeralds! | e.help`);
});

bot.on("message", async msg => {
    if(msg.content.startsWith("<@427570319822290945> prefix")) {
        bot.db.get(`SELECT * FROM configs WHERE server = ${msg.guild.id}`).then(config => {
            if(!config) {
                bot.db.run("INSERT INTO configs (server, mod_log, mod_log_cases, welcome_channel, welcome_msg, leave_msg, prefix, anti_links, anti_swear, swear_words, auto_role) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [msg.guild.id, null, 0, null,"Hello **e{user_no_mention}** and welcome to **e{server_name}**. You're member #e{server_memcount}", "Farewell **e{user}** we hope you enjoyed you're stay at **e{server_name}**!", "e.", "Disabled", "Disabled", "Word1,Word2", null]);
                bot.db.get(`SELECT * FROM configs WHERE server = ${msg.guild.id}`).then(config1 => {
                    if(msg.channel.permissionsFor(bot.user).has("EMBED_LINKS")) {
                        msg.channel.send(bot.embed({
                            description: `The server's current prefix is \`${config1.prefix}\``
                        }));
                    } else msg.channel.send(`The server's current prefix is \`${config1.prefix}\``);
                });
            } else {
                if(msg.channel.permissionsFor(bot.user).has("EMBED_LINKS")) {
                    msg.channel.send(bot.embed({
                        description: `The server's current prefix is \`${config.prefix}\``
                    }));
                } else msg.channel.send(`The server's current prefix is \`${config.prefix}\``);
            }
        });
    }
    bot.db.get(`SELECT * FROM configs WHERE server = ${msg.guild.id}`).then(config => {
        if(!config) {
            bot.db.run("INSERT INTO configs (server, mod_log, mod_log_cases, welcome_channel, welcome_msg, leave_msg, prefix, anti_links, anti_swear, swear_words, auto_role) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [msg.guild.id, null, 0, null, "Hello **e{user_no_mention}** and welcome to **e{server_name}**. You're member #e{server_memcount}", "Farewell **e{user}** we hope you enjoyed you're stay at **e{server_name}**!", "e.", "Disabled", "Disabled", "Word1,Word2", null]);
            bot.db.get(`SELECT * FROM configs WHERE server = ${msg.guild.id}`).then(config1 => {
                if(config1.anti_swear === "Disabled" || msg.member.id === msg.guild.ownerID || msg.member.hasPermission("MANAGE_GUILD")) {} else if(config1.swear_words.split(",").some(sw=>msg.content.toLowerCase().includes(sw.toLowerCase()))) {msg.delete().catch(O_o=>{}).then(() => msg.reply("You are not allowed to swear on this server!"));}
                msg.prefix = config1.prefix;
                return processCommand(msg);
            });
         } else {
            if(config.anti_swear === "Disabled" || msg.member.id === msg.guild.ownerID || msg.member.hasPermission("MANAGE_GUILD")) {} else if(config.swear_words.split(",").some(sw=>msg.content.toLowerCase().includes(sw.toLowerCase()))) {msg.delete().catch(O_o=>{}).then(() => msg.reply("You are not allowed to swear on this server!"));}
            msg.prefix = config.prefix;
            return processCommand(msg);
        }
    });
});

//Handle commands
function processCommand(msg) {
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
        else return msg.channel.send(`:x: You cannot run this command as you need to be the server owner!`).then(m => m.delete(1500));
    } else if(permission === "BOT_OWNER") {
        if(msg.author.id === "302604426781261824" || msg.author.id === "199436790581559296") return success();
        else return msg.channel.send(`:x: You cannot run this command as you need to be the bot owner!`).then(m => m.delete(1500));
    } else {
        if(msg.member.permissions.has(permission)) return success();
        else return msg.channel.send(`:x: You cannot run this command as it requires the \`${cmd.config.permission}\` permission!`).then(m => m.delete(1500));
    }
}

process.on("SIGINT", () => {
    console.log(`[INFO] Shutting down with ${bot.players.size} players, ${bot.guilds.size} servers and ${bot.users.size} users!`);
    setTimeout(() => {
        bot.destroy();
        process.exit();
    }, 250);
});