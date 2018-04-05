module.exports.run = async (bot, msg, args) => {
    if(!(parseInt(args[0]) || parseInt(args[1]))) return msg.channel.send(`:x: Invalid usage | ${msg.prefix}add [number1] [number2]`); 
    else {
        msg.channel.send(`\`${args[0]}\` plus \`${args[1]}\` is **${Math.floor(parseInt(args[0])+parseInt(args[1]))}**`);
    }
}

module.exports.config = {
    name: "add",
    usage: "add [number1] [number2]",
    description: "Adds to numbers together!",
    permission: "None",
    category: "Math",
    aliases: []
}