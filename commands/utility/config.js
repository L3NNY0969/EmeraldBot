module.exports.run = async (bot, msg, args) => {
    if(!msg.channel.permissionsFor(bot.user).has("EMBED_LINKS")) return msg.channel.send(":x: I am missing the `Embed Links` permission!");
    if(!args[0]) return msg.channel.send(bot.embed({
        title: ":x: Args Error!",
        description: `Command Usage: \`${msg.prefix}config [setting] [value]\``,
        color: 0xff0000
    }));
    switch(args[0].toLowerCase()) {
        case "prefix": {
            if(!args[1]) return msg.channel.send(bot.embed({
                title: ":x: Args Error!",
                description: "Please provide a prefix to set!",
                color: 0xff0000
            }));
            if(args[1].length < 1 || args[1].length > 3) return msg.channel.send(bot.embed({
                title: ":x: Args Error!",
                description: "A prefix must be between 1 and 3 characters long!",
                color: 0xff0000
            }));
            bot.db.run(`UPDATE configs SET prefix = "${args[1]}" WHERE server = "${msg.guild.id}"`);
            msg.channel.send(bot.embed({
                title: "Prefix changed!",
                description: `:white_check_mark: The new server prefix is \`${args[1]}\`\nIf you ever forget the prefix mention me :wink:`
            }));
        }
    }
}

module.exports.config = {
    name: "config",
    usage: "config (setting) (value)",
    description: "Changes the server configuration.",
    permission: "Manage Server",
    category: "Utility",
    aliases: ["settings", "configuration"]
}