module.exports.run = async (bot, msg, args) => {
    if (!args[0]) return msg.channel.send(`:x: Invalid usage: \`${msg.prefix}reload [event | command] [file]\``);
    if (args[0].match(/event|command/)) {
        switch (args[0]) {
        case "event": {
            if (!args[1]) return msg.channel.send(":x: Please enter a event name.");
            try {
                delete require.cache[require.resolve(`../../events/${args[1]}.js`)];
                msg.channel.send(":white_check_mark: Event reloaded.");
            } catch (error) {
                return msg.channel.send(":x: Event not found.");
            }
            break;
        }
        case "command": {
            if (!args[1]) return msg.channel.send(":x: Please enter a command name.");
            try {
                bot.commands.delete(args[1].split("/")[1]);
                const command = require(`../${args[1]}.js`);
                bot.commands.set(command.config.name, command);
                msg.channel.send(":white_check_mark: Command reloaded.");
                delete require.cache[require.resolve(`../${args[1]}.js`)];
            } catch (error) {
                return msg.channel.send(":x: Command not found.");
            }
            break;
        }
        }
    } else { return msg.channel.send(":x: Args did not match `event` or `command`."); }
};

module.exports.config = {
    name: "reload",
    usage: "reload [event | command] [file]",
    description: "Reloads a command or event.",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["rl"]
};
