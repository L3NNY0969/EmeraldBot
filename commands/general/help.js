const paginator = require("../../utils/paginator.js");

module.exports.run = async (bot, msg, args) => {
    if(!args[0]) {
        let general = bot.commands.filter(c => c.config.category === "General"),
            fun = bot.commands.filter(c => c.config.category === "Fun"),
            math = bot.commands.filter(c => c.config.category === "Math"),
            mod = bot.commands.filter(c => c.config.category === "Moderation"),
            music = bot.commands.filter(c => c.config.category === "Music"),
            utility = bot.commands.filter(c => c.config.category === "Utility"),
            owner = bot.commands.filter(c => c.config.category === "Owner");
        let pages = [
            {
                title: `General Commands ${general.size === 0 ? "" : `(${general.size} total)`}`,
                description: general.size === 0 ? "None" : general.map(c => `\`${c.config.name}: ${c.config.description} ${c.config.aliases.length === 0 ? "" : `(Aliases: ${c.config.aliases.join(', ')})`} ${c.config.permission === "None" ? "" : `(Perm: ${c.config.permission})`}\``).join("\n")
            },
            {
                title: `Fun Commands ${fun.size === 0 ? "" : `(${fun.size} total)`}`,
                description: fun.size === 0 ? "None" : fun.map(c => `\`${c.config.name}: ${c.config.description} ${c.config.aliases.length === 0 ? "" : `(Aliases: ${c.config.aliases.join(', ')})`} ${c.config.permission === "None" ? "" : `(Perm: ${c.config.permission})`}\``).join("\n")
            },
            {
                title: `Math Commands ${math.size === 0 ? "" : `(${math.size} total)`}`,
                description: math.size === 0 ? "None" : math.map(c => `\`${c.config.name}: ${c.config.description} ${c.config.aliases.length === 0 ? "" : `(Aliases: ${c.config.aliases.join(', ')})`} ${c.config.permission === "None" ? "" : `(Perm: ${c.config.permission})`}\``).join("\n")
            },
            {
                title: `Moderation Commands ${mod.size === 0 ? "" : `(${mod.size} total)`}`,
                description: mod.size === 0 ? "None" : mod.map(c => `\`${c.config.name}: ${c.config.description} ${c.config.aliases.length === 0 ? "" : `(Aliases: ${c.config.aliases.join(', ')})`} ${c.config.permission === "None" ? "" : `(Perm: ${c.config.permission})`}\``).join("\n")
            },
            {
                title: `Music Commands  ${music.size === 0 ? "" : `(${music.size} total)`}`,
                description: music.size === 0 ? "None" : music.map(c => `\`${c.config.name}: ${c.config.description} ${c.config.aliases.length === 0 ? "" : `(Aliases: ${c.config.aliases.join(', ')})`} ${c.config.permission === "None" ? "" : `(Perm: ${c.config.permission})`}\``).join("\n")
            },
            {
                title: `Utility Commands ${utility.size === 0 ? "" : `(${utility.size} total)`}`,
                description: utility.size === 0 ? "None" : utility.map(c => `\`${c.config.name}: ${c.config.description} ${c.config.aliases.length === 0 ? "" : `(Aliases: ${c.config.aliases.join(', ')})`} ${c.config.permission === "None" ? "" : `(Perm: ${c.config.permission})`}\``).join("\n")
            },
        ];
        if(msg.author.id === "302604426781261824" || msg.author.id === "199436790581559296") pages.push({title: `Owner Commands ${owner.size === 0 ? "" : `(${general.size} total)`}`, description: owner.size === 0 ? "None" : owner.map(c => `\`${c.config.name}: ${c.config.description} ${c.config.aliases.length === 0 ? "" : `(Aliases: ${c.config.aliases.join(', ')})`} ${c.config.permission === "None" ? "" : `(Perm: ${c.config.permission})`}\``).join("\n")});
        let session = new paginator(msg, pages, `Emerald Bot Help`, bot.color);
        await session.start();
        session.on("sessionStart", (m) => {
            console.log(`[PAGINATOR] A paginator session has been started!`);
        });
        session.on("sessionEnd", (m) => {
            console.log(`[PAGINATOR] A paginator session has been stopped!`);
        });
    } else {
        let command = bot.commands.get(args[0]);
        if(!command) return msg.channel.send(":x: That command was not found.");
        else {
            let embed = {
                title: `Command info for ${msg.prefix}${command.config.name}`,
                fields: [
                    {
                        name: `Description:`,
                        value: command.config.description
                    },
                    {
                        name: "Permission Required:",
                        value: command.config.permission
                    },
                    {
                        name: "Category:",
                        value: command.config.category
                    },
                    {
                        name: "Aliases:",
                        value: command.config.aliases.length === 0 ? "None" : command.config.aliases.join(', ')
                    }
                ],
                footer: `Command help requested by ${msg.author.tag}`,
                timestamp: true
            };
            if(command.config.usage === "None") {} else embed.fields.push({
                name: "Usage:", 
                value: `${msg.prefix}${command.config.usage}`
            });
            msg.channel.send(bot.embed(embed));
        }
    }
}

module.exports.config = {
    name: "help",
    usage: "help [command]",
    description: "Displays all of the bots commands!",
    permission: "None",
    category: "General",
    aliases: []
}