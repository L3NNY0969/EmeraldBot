const TicTacToeGame = require("../../utils/TicTacToe.js");

module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "ATTACH_FILES"])) return;
    if (!args[0]) {
        return msg.channel.send(`
:x: Invalid usage: \`${msg.prefix}tictactoe [new | join | leave | start]\`
More Help:
\`\`\`new: Creates a new Tic Tac Toe game.
join: Joins a Tic Tac Toe game.
leave: Leaves a Tic Tac Toe game.
start: Starts the Tic Tac Toe game.\`\`\``);
    }
    switch (args[0]) {
    case "new": {
        if (!bot.ttt.get(msg.channel.id)) {
            bot.ttt.set(msg.channel.id, new TicTacToeGame(msg, bot.ttt));
            bot.ttt.get(msg.channel.id).addPlayer(msg.author, msg.prefix);
        } else { return msg.channel.send(`:x: A game is already running here.`); }
        break;
    }
    case "join": {
        if (bot.ttt.get(msg.channel.id)) {
            if (bot.ttt.get(msg.channel.id).host.id === msg.author.id) return msg.channel.send(":x: You cannot play with your self.");
            bot.ttt.get(msg.channel.id).addPlayer(msg.author, msg.prefix);
        } else { return msg.channel.send(`:x: A game is already running here.`); }
        break;
    }
    case "leave": {
        if (bot.ttt.get(msg.channel.id)) {
            if (bot.ttt.get(msg.channel.id).host.id === msg.author.id) return msg.channel.send(":x: You cannot leave the game.");
            bot.ttt.get(msg.channel.id).removePlayer(msg.author);
        } else { return msg.channel.send(`:x: A game is already running here.`); }
        break;
    }
    case "start": {
        if (bot.ttt.get(msg.channel.id)) {
            if (bot.ttt.get(msg.channel.id).host.id === msg.author.id) {
                if (bot.ttt.get(msg.channel.id).players.size > 1) {
                    bot.ttt.get(msg.channel.id).start();
                } else { return msg.channel.send(":x: This game needs one more player."); }
            } else { return msg.channel.send(":x: Only the host can start the game."); }
        } else { return msg.channel.send(`:x: A game is already running here.`); }
        break;
    }
    default: {
        return msg.channel.send(`
:x: Invalid usage: \`${msg.prefix}tictactoe [new | join | leave | start]\`
More Help:
\`new: Creates a new Tic Tac Toe game.
join: Joins a Tic Tac Toe game.
leave: Leaves a Tic Tac Toe game.
start: Starts the Tic Tac Toe game.\``);
    }
    }
};

module.exports.config = {
    name: "tictactoe",
    usage: "tictactoe [new | join | leave | start]",
    description: "Tic Tac Toe anyone?",
    permission: "None",
    category: "Fun",
    aliases: ["ttt"]
};
