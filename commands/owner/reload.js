module.exports = class Reload {

    constructor() {
        this.config = {
            name: "reload",
            usage: "reload [command]",
            description: "Reloads a command.",
            permission: "Bot Owner",
            category: "Owner",
            aliases: ["rl", "rlcmd"]
        };
    }

    async run(bot, msg, args) {
        if (!args[0]) return msg.channel.send(`:x: Invalid usage: \`${msg.prefix}reload [command]\``);
        const m = await msg.channel.send(":arrows_counterclockwise:  Reloading command.");
        bot.reloadCmd(args[0])
            .then(() => m.edit(":white_check_mark: Command reloaded."))
            .catch(() => m.edit(":x: Command not found."));
    }

};
