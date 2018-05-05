module.exports.run = async (bot, msg, args) => {
    const match = /(p|play|play|l|listen|listening|w|watch|watching|s|stream|streaming|c|clear)/i.exec(args[0]);
    if (match) {
        switch (match[1]) {
        case "p":
        case "play":
        case "playing": {
            const newGame = args.join(" ").slice(args[0].length + 1);
            if (!newGame) { return msg.channel.send(`Invalid arguments passed. \`e.setgame [type:${match[1]}] [GAME]\``); } else {
                bot.user.setActivity(newGame.replace(/\(users\)/, bot.users.size).replace(/\(guilds\)/, bot.guilds.size), { type: "PLAYING" });
                msg.channel.send(`:white_check_mark: Playing **${newGame}**`);
            }
            break;
        }
        case "l":
        case "listen":
        case "listening": {
            const newGame = args.join(" ").slice(args[0].length + 1);
            if (!newGame) { return msg.channel.send(`Invalid arguments passed. \`e.setgame [type:${match[1]}] [GAME]\``); } else {
                bot.user.setActivity(newGame.replace(/\(users\)|\(members\)/, bot.users.size).replace(/\(guilds\)|\(servers\)/, bot.guilds.size), { type: "LISTENING" });
                msg.channel.send(`:white_check_mark: Listening to **${newGame}**`);
            }
            break;
        }
        case "w":
        case "watch":
        case "watching": {
            const newGame = args.join(" ").slice(args[0].length + 1);
            if (!newGame) { return msg.channel.send(`Invalid arguments passed. \`e.setgame [type:${match[1]}] [GAME]\``); } else {
                bot.user.setActivity(newGame.replace(/\(users\)|\(members\)/, bot.users.size).replace(/\(guilds\)|\(servers\)/, bot.guilds.size), { type: "WATCHING" });
                msg.channel.send(`:white_check_mark: Watching **${newGame}**`);
            }
            break;
        }
        case "s":
        case "stream":
        case "streaming": {
            const newGame = args.join(" ").slice(args[0].length + 1);
            if (!newGame) { return msg.channel.send(`Invalid arguments passed. \`e.setgame [type:${match[1]}] [GAME]\``); } else {
                bot.user.setActivity(newGame.replace(/\(users\)|\(members\)/, bot.users.size).replace(/\(guilds\)|\(servers\)/, bot.guilds.size), { url: "https://twitch.tv/iceemc", type: "STREAMING" });
                msg.channel.send(`:white_check_mark: Streaming **${newGame}**`);
            }
            break;
        }
        case "c":
        case "clear": {
            bot.user.setActivity(null);
            msg.channel.send(":white_check_mark: Game was successfully cleared!");
            break;
        }
        default: return msg.channel.send("You must provide a valid type: `playing, listening, watching, streaming, clear`");
        }
    } else { return msg.channel.send(":x: Invalid type provided!"); }
};

module.exports.config = {
    name: "setgame",
    usage: "setgame (type) (new game)",
    description: "Sets the game",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["changegame"]
};
