const { MongoClient } = require("mongodb");
const { readdirSync, readdir } = require("fs");
const AudioManager = require("../utils/music/AudioManager.js");
const { RichEmbed } = require("discord.js");
const { post } = require("snekfetch");

module.exports = async (bot) => {
    bot.invite = await bot.generateInvite("ADMINISTRATOR");

    // Load commands
    const dirs = readdirSync("./commands/");
    dirs.forEach(dir => {
        if (dir === "disabled") return;
        readdir(`./commands/${dir}`, (err, files) => {
            if (err) throw err;
            const js_files = files.filter(f => f.split(".").pop() === "js");
            if (js_files.length === 0) { console.log(`[INFO] Skipped dir ${dir} with reason: No commands to load!`); } else {
                js_files.forEach(f => {
                    const cmd = new (require(`../commands/${dir}/${f}`))();
                    cmd.config.dirLoadedIn = `../commands/${dir}/${f}`;
                    bot.commands.set(cmd.config.name, cmd);
                    for (const alias of cmd.config.aliases) {
                        bot.aliases.set(alias, cmd);
                    }
                });
            }
        });
    });

    // Notify the bot is connected.
    console.log(`
[INFO] Connected with ${bot.guilds.size} servers and ${bot.users.size} users.
[INFO] Invite link: ${bot.invite}
`.trim());

    // Start the random game changer and creates new AudioManager for music.
    randomGame(bot);
    bot.player = new AudioManager(bot);

    // Connect to the bots DataBase
    MongoClient.connect(bot.config.mongo.url, (error, client) => {
        if (error) return console.log(`[MONGO] Failed to connect to MongoDB for: ${error.message}`);
        bot.db = client.db(bot.config.mongo.database);
        console.log("[MONGO] Connected to MongoDB.");
    });

    // AudioNode events
    bot.player.nodes.forEach(n => {
        n.on("ready", () => console.log("[LAVALINK] Node is ready."));
        n.on("error", e => console.log(`[LAVALINK] Error: ${e.message}`));
        n.on("close", c => console.log(`[LAVALINK] Close: ${c}`));
    });

    // Embeds something used throughout the entire bot btw.
    bot.embed = function botEmbed(options = {}) {
        const title = options.title || undefined;
        const thumbnail = options.thumbnail || undefined;
        const image = options.image || undefined;
        const description = options.description || undefined;
        const footer = options.footer || undefined;
        const timestamp = options.timestamp || false;
        const footerIcon = options.footerIcon || null;
        const fields = options.fields || undefined;
        const color = options.color || bot.color;
        const author = options.author || undefined;
        const e = new RichEmbed();

        if (fields === undefined) {} else { for (const field of fields) e.addField(field.name, field.value, field.inline || false); }
        if (title === undefined) {} else { e.setTitle(title); }
        if (description === undefined) {} else { e.setDescription(description); }
        if (color === undefined) {} else { e.setColor(color); }
        if (author === undefined) {} else { e.setAuthor(author.name, author.icon, author.url || null); }
        if (timestamp === false) {} else { e.setTimestamp(); }
        if (footer === undefined) {} else { e.setFooter(footer, footerIcon); }
        if (thumbnail === undefined) {} else { e.setThumbnail(thumbnail); }
        if (image === undefined) {} else { e.setImage(image); }

        return e;
    };

    // Puts the provided text on hastebin.
    bot.haste = function botHaste(text) {
        const promise = new Promise(async (res, rej) => {
            if (!text) return rej("Text needs to be provided!");
            post("https://hastebin.com/documents")
                .send(text)
                .then(r => res(`https://hastebin.com/${r.body.key}`)).catch(e => rej(e));
        });
        return promise;
    };

    // Replaces markdown with nothing
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
};

function randomGame(bot) {
    const games = [
        { name: "with Ice and AdityaTD", type: 0 },
        { name: `${bot.guilds.size} noisy guilds`, type: 2 },
        { name: "l.help | l.support | l.invite", type: 0 },
        { name: `${bot.users.size} noisy users`, type: 2 }
    ];
    setInterval(() => {
        const random = games[Math.floor(Math.random() * games.length)];
        bot.user.setActivity(random.name, { type: random.type });
    }, 60000);
}
