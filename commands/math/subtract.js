module.exports.run = async (bot, msg, args) => {
    if(!(parseInt(args[0]) || parseInt(args[1]))) return msg.channel.send(`:x: Invalid usage | ${msg.prefix}add [number1] [number2]`); 
    else {
        msg.channel.send(`\`${args[0]}\` minus \`${args[1]}\` is **${Math.floor(parseInt(args[0])+parseInt(args[1]))}**`);
    }
}

module.exports.config = {
    name: "subtract",
    usage: "subtract [number1] [number2]",
    description: "Subtracts two numbers together!",
    permission: "None",
    category: "Math",
    aliases: []
}