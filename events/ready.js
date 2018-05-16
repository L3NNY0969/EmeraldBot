const { MongoClient } = require("mongodb");
const { readdirSync, readdir } = require("fs");
const AudioManager = require("../utils/music/AudioManager.js");
const { Collection, RichEmbed } = require("discord.js");
const { post } = require("snekfetch");

module.exports = async (bot) => {
    bot.ttt = new Collection();
    bot.commands = new Collection();
    bot.aliases = new Collection();
    bot.magikCooldowns = new Set();
    bot.color = 0x55B88E;
    bot.invite = await bot.generateInvite(["ADMINISTRATOR"]);

    const dirs = readdirSync("./commands/");
    dirs.forEach(dir => {
        if (dir === "disabled") return;
        readdir(`./commands/${dir}`, (err, files) => {
            if (err) throw err;
            const js_files = files.filter(f => f.split(".").pop() === "js");
            if (js_files.length === 0) { console.log(`[INFO] Skipped dir ${dir} with reason: No commands to load!`); } else {
                js_files.forEach(f => {
                    const Command = require(`../commands/${dir}/${f}`);
                    const cmd = new Command();
                    bot.commands.set(cmd.config.name, cmd);
                    for (const alias of cmd.config.aliases) {
                        bot.aliases.set(alias, cmd);
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
    bot.player = new AudioManager(bot);
    MongoClient.connect(bot.config.mongo.url, (error, client) => {
        if (error) return console.log(`[MONGO] Failed to connect to MongoDB for: ${error.message}`);
        bot.db = client.db(bot.config.mongo.database);
        console.log("[MONGO] Connected to MongoDB.");

    });
    bot.player.nodes.forEach(n => {
        n.on("ready", () => console.log("Node is ready."));
        n.on("error", e => console.error(e));
        n.on("close", c => console.log(c));
    });

    // Functions that can only be used until the bot is ready
    bot.embed = function botEmbed(options = {}) {
        const title = options.title ? options.title : undefined;
        const thumbnail = options.thumbnail ? options.thumbnail : undefined;
        const image = options.image ? options.image : undefined;
        const description = options.description ? options.description : undefined;
        const footer = options.footer ? options.footer : undefined;
        const timestamp = options.timestamp ? options.timestamp : false;
        const footerIcon = options.footerIcon ? options.footerIcon : null;
        const fields = options.fields ? options.fields : undefined;
        const color = options.color ? options.color : bot.color;
        const author = options.author ? options.author : undefined;
        const e = new RichEmbed();

        if (fields === undefined) {} else { for (const field of fields) e.addField(field.name, field.value, field.inline ? field.inline : false); }
        if (title === undefined) {} else { e.setTitle(title); }
        if (description === undefined) {} else { e.setDescription(description); }
        if (color === undefined) {} else { e.setColor(color); }
        if (author === undefined) {} else { e.setAuthor(author.name, author.icon, author.url ? author.url : null); }
        if (timestamp === false) {} else { e.setTimestamp(); }
        if (footer === undefined) {} else { e.setFooter(footer, footerIcon); }
        if (thumbnail === undefined) {} else { e.setThumbnail(thumbnail); }
        if (image === undefined) {} else { e.setImage(image); }

        return e;
    };

    bot.haste = function botHaste(text) {
        const promise = new Promise(async (res, rej) => {
            if (!text) return rej("Text needs to be provided!");
            post("https://hastebin.com/documents")
                .send(text)
                .then(r => res(`https://hastebin.com/${r.body.key}`)).catch(e => rej(e));
        });
        return promise;
    };

    bot.escapeMarkdown = function botEscapeMD(text) {
        const newText = text
            .replace(/\*/g, "")
            .replace(/`/g, "")
            .replace(/~/g, "")
            .replace(/\n/g, "")
            .replace(/</g, "")
            .replace(/>/g, "")
            .replace(/#/g, "")
            .replace(/@/g, "")
            .replace(/"/g, "")
            .replace(/'/g, "")
            .replace(/_/g, "")
            .replace(/\[/g, "")
            .replace(/\]/g, "")
            .replace(/\(/g, "")
            .replace(/\)/g, "");
        return newText;
    };

    bot.reboot = function botReboot() {
        const rebooted = new Promise(async (res, rej) => {
            if (bot.commands.size === 0 || bot.commands.size === 0) return rej(":x: Command loading failed. No commands or aliases where found.");
            bot.commands.clear();
            bot.aliases.clear();
            bot.emit("ready");
            return res(":white_check_mark: Reboot success.");
        });
        return rebooted;
    };
};
