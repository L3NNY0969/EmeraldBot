const os = require("os");

module.exports.run = async (bot, msg, args) => {
    let embed = bot.embed({
        author: {
            name: "Bot statistics!",
            icon: bot.user.avatarURL
        },
        fields: [            
            { name: "Music players:", value: global.players.size, inline: true },
            { name: "Servers:", value: bot.guilds.size, inline: true },
            { name: "Users:", value: bot.users.size, inline: true },
            { name: "Commands:", value: bot.commands.size, inline: true },
            { name: "CPU Usage (All Cores):", value: handleCpuUsage(), inline: true },
            { name: "Free Memory:", value: handleFreeMemory(), inline: true },
            { name: "Memory Usage:", value: handleMemoryUsage(), inline: true },
            { name: "Gateway Ping:", value: `${~~(bot.ping)}ms`, inline: true },
            { name: "Uptime:", value: handleUptime(), inline: true }
        ],
        footer: `Status report requested by ${msg.author.tag}`,
        footerIcon: msg.author.displayAvatarURL
    });
    msg.channel.send(embed);
}

module.exports.config = {
    name: "stats",
    usage: "None",
    description: "Shows my bot statistics",
    permission: "None",
    category: "General",
    aliases: ["info"]
}

function handleMemoryUsage() {
    let free = os.totalmem() - os.freemem();
	let gbConvert = free / 1073741824;
	let total = os.totalmem() / 1073741824;
    return `${gbConvert.toFixed(2)} GB / ${total.toFixed(2)} GB`;
}

function handleFreeMemory() {
    let free = os.totalmem() - os.freemem();
	let gbConvert = free / 1073741824;
    let total = os.totalmem() / 1073741824;
    let newNumber = total.toFixed(2) - gbConvert.toFixed(2);
    return `${newNumber.toFixed(2)} GB`;
}

function handleCpuUsage() {
    let total = 0;
    for(const avg of os.loadavg()) {
        total += ~~(avg * 10000 / 100);
    }
    return `${~~(total)}%`
}

function handleUptime() {
    let uptime = "";
    let seconds = Math.floor(process.uptime());
	let days = Math.floor(seconds / (3600 * 24));
	seconds -= days * 3600 * 24;
	let hrs = Math.floor(seconds / 3600);
	seconds -= hrs * 3600;
	let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if(days > 0) {
        if(days > 1) {
            uptime += `${days} days, `
        } else {
            uptime += `${days} day, `
        }
    } else uptime += "";

    if(hrs > 0) {
        if(hrs > 1) {
            uptime += `${hrs} hours, `
        } else {
            uptime += `${hrs} hour, `
        }
    } else uptime += "";

    if(minutes > 0) {
        if(minutes > 1) {
            uptime += `${minutes} minutes, `
        } else {
            uptime += `${minutes} minute, `
        }
    } else uptime += "";

    if(seconds > 1) {
        uptime += `${seconds} seconds`
    } else {
        uptime += `${seconds} second`
    }

    return uptime;
}