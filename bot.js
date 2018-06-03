const { Collection, Client } = require("discord.js");
const bot = new Client({ disableEveryone: true, disabledEvents: ["TYPING_START", "TYPING_STOP", "GUILD_SYNC", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "USER_SETTINGS_UPDATE", "USER_NOTE_UPDATE"], reconnect: true });
const { readdirSync } = require("fs");

bot.config = require("./config.json");
bot.login(bot.config.tokens.discord);

// TicTacToe games, command Map, aliases Map, magik command cooldowns, the bot embed color, and the bots invite.
bot.ttt = new Collection();
bot.commands = new Collection();
bot.aliases = new Collection();
bot.magikCooldowns = new Set();
bot.color = 0x208694;

const startBot = async () => {
    bot.invite = await bot.generateInvite(["ADMINISTRATOR"]);
    const eventFiles = readdirSync("./events/");
    eventFiles.forEach(file => {
        const event = require(`./events/${file}`);
        bot.on(file.split(".")[0], (...args) => event(bot, ...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });

    process.on("SIGINT", () => {
        console.log(`[INFO] Shutting down with ${bot.player.players.size} players, ${bot.ttt.size} TicTacToe games, ${bot.guilds.size} servers and ${bot.users.size} users!`);
        setTimeout(() => {
            bot.destroy();
            process.exit();
        }, 250);
    });
};
startBot();
