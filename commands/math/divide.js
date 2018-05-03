module.exports.run = async (bot, msg, args) => {
    if(!(parseInt(args[0]) || parseInt(args[1]))) return msg.channel.send(`:x: Invalid usage | ${msg.prefix}multiply [number1] [number2]`); 
    else {
        msg.channel.send(`\`${args[0]}\` divided by \`${args[1]}\` is **${Math.floor(parseInt(args[0])/parseInt(args[1]))}**`);
    }
}

module.exports.config = {
    name: "divide",
    usage: "divide [number1] [number2]",
    description: "Divides two numbers together.",
    permission: "None",
    category: "Math",
    aliases: []
}