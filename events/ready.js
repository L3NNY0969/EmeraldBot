const { MongoClient } = require("mongodb");
const { readdirSync, readdir } = require("fs");
const { PlayerManager } = require('discord.js-lavalink');
const { Collection, RichEmbed } = require("discord.js");
const { post } = require("superagent");

module.exports = async (bot) => {

    bot.ttt = new Map();
    bot.players = new Map();
    bot.commands = new Map();
    bot.aliases = new Map();

    bot.color = 0x55B88E;
    bot.invite = await bot.generateInvite(["ADMINISTRATOR"]);

    let dirs = readdirSync("./commands/");
    dirs.forEach(dir => {
        readdir(`./commands/${dir}`, function(err, files) {
            let js_files = files.filter(f => f.split(".").pop() === "js");
            if(js_files.length === 0) console.log(`[INFO] Skipped dir ${dir} with reason: No commands to load!`);
            else {
                js_files.forEach(function(f, i) {
                    let command = require(`../commands/${dir}/${f}`);
                    bot.commands.set(command.config.name, command);
                    for(let alias of command.config.aliases) {
                        bot.aliases.set(alias, command);
                    }
                });
            }
        });
    });
    console.log(`
[INFO] Connected with ${bot.guilds.size} emeralds and ${bot.users.size} users
[INFO] Invite link: ${bot.invite}
`.trim());
    bot.user.setActivity(`with ${bot.guilds.size} emeralds | e.help`);
    bot.player = new PlayerManager(bot, bot.config.nodes, {
        user: bot.user.id,
        shards: 1
    });
    MongoClient.connect(bot.config.mongo.url, (error, client) => {
        if(error) return console.log(`[MONGO] Failed to connect to MongoDB for: ${error.message}`);
        bot.db = client.db(bot.config.mongo.database);
        console.log("[MONGO] Connected to MongoDB.");
    });

    //Functions that can only be used until the bot is ready
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
        let embed = new RichEmbed();
    
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
            if(!text) return rej("Text needs to be provided!");
            post("https://hastebin.com/documents")
            .send(text)
            .then(r => {
                return res(`https://hastebin.com/${r.body.key}`);
            }).catch(e => rej(e));
        });
    }

    bot.escapeMarkdown = function(text) {
        return text
        .replace(/\*/g, "")
        .replace(/\`/g, "")
        .replace(/\~/g, "")
        .replace(/\\n/g, "")
        .replace(/\</g, "")
        .replace(/\>/g, "")
        .replace(/\#/g, "")
        .replace(/\@/g, "")
        .replace(/\"/g, "")
        .replace(/\'/g, "")
        .replace(/\_/g, "")
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
    }
}