module.exports = class Emojify {

    constructor() {
        this.config = {
            name: "emojify",
            usage: "emojify (text)",
            description: "Emojify's the provided text for some emoji fun.",
            permission: "None",
            category: "Fun",
            aliases: ["textemoji"]
        };
    }

    async run(bot, msg, args) {
        if (!args.join(" ")) {
            return msg.channel.send(`:x: Invalid usage: \`${msg.prefix}emojify (text)\``);
        } else {
            if (args.join(" ").length >= 50) return msg.channel.send(":x: Max length 50 characters.");
            let newMsg = "";
            for (const split of args.join(" ").split("")) {
                newMsg += split.replace(/[A-Za-z]/g, `:regional_indicator_${split.toLowerCase()}:`)
                    .replace(/\s/g, " ");
            }
            return msg.channel.send(newMsg);
        }
    }

};
