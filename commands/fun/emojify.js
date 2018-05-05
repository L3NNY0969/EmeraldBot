module.exports.run = async (bot, msg, args) => {
    if (!args.join(" ")) {
        return msg.channel.send(`:x: Invalid usage: \`${msg.prefix}emojify (text)\``);
    } else {
        if (args.join(" ").length >= 50) return msg.channel.send(":x: Max length 50 characters.");
        let newMsg = "";
        for (const split of args.join(" ").split("")) {
            newMsg += split.replace(/[A-Za-z0-9]/g, `:regional_indicator_${split.toLowerCase()}:`)
                .replace(/\s/g, " ")
                .replace(/<:[A-Za-z_]:([0-9])>/g, "");
        }
        return msg.channel.send(newMsg);
    }
};


module.exports.config = {
    name: "emojify",
    usage: "emojify (text)",
    description: "Emojify's the provided text for some emoji fun.",
    permission: "None",
    category: "Fun",
    aliases: ["textemoji"]
};
