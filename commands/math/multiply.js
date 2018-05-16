module.exports = class Multiply {

    constructor() {
        this.config = {
            name: "multiply",
            usage: "multiply [number1] [number2]",
            description: "Multiplies two numbers together.",
            permission: "None",
            category: "Math",
            aliases: []
        };
    }

    run(bot, msg, args) {
        if (!(parseInt(args[0]) || parseInt(args[1]))) {
            return msg.channel.send(`:x: Invalid usage | ${msg.prefix}multiply [number1] [number2]`);
        } else {
            msg.channel.send(`\`${args[0]}\` times \`${args[1]}\` is **${Math.floor(parseInt(args[0]) * parseInt(args[1]))}**`);
        }
    }

};
