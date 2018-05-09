const { readdirSync, readdir } = require("fs");
const { join } = require("path");

module.exports.run = async (bot, msg, args) => {
    if (!args[0]) return msg.channel.send(`:x: Invalid usage: \`${msg.prefix}reload [event | command | util] [file]\``);
    if (args[0].match(/event|command|paginator/)) {
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
            if (!args[1]) return msg.channel.send(":x: Please enter a command name or enter all.");
            if (args[1] !== "all") {
                try {
                    bot.commands.delete(args[1].split("/")[1]);
                    const command = require(`../${args[1].split("/")[0]}/${args[1].split("/")[1]}.js`);
                    bot.commands.set(command.config.name, command);
                    msg.channel.send(":white_check_mark: That command has been reloaded.");
                    delete require.cache[require.resolve(`../${args[1].split("/")[0]}/${args[1].split("/")[1]}.js`)];
                } catch (error) {
                    return msg.channel.send(":x: That command was not found.");
                }
                break;
            } else {
                const m = await msg.channel.send("Deleting all commands and clearing aliases...");
                bot.commands.clear();
                bot.aliases.clear();
                await m.edit(`${m.content} Done\nReloading all commands...`);
                const dirs = readdirSync(join(__dirname, "..", "..", "commands"));
                dirs.forEach(dir => {
                    readdir(join(__dirname, "..", "..", "commands", dir), (err, files) => {
                        if (err) throw err;
                        const js_files = files.filter(f => f.split(".").pop() === "js");
                        if (js_files.length === 0) { console.log(`[INFO] Skipped dir ${dir} with reason: No commands to load!`); } else {
                            js_files.forEach(f => {
                                const command = require(join(__dirname, "..", "..", "commands", dir, f));
                                bot.commands.set(command.config.name, command);
                                for (const alias of command.config.aliases) {
                                    bot.aliases.set(alias, command);
                                }
                            });
                        }
                    });
                });
                await m.edit(`${m.content} Done\nAll commands and aliases were reloaded.`);
            }
        }
        }
    } else { return msg.channel.send(":x: Args did not match `event` or `command`."); }
};

module.exports.config = {
    name: "reload",
    usage: "reload [event | command | util] [file]",
    description: "Reloads a command or event.",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["rl"]
};
