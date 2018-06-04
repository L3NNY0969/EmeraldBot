module.exports.run = async (bot, message, args, func) => {
    const replys = [
        "Yes",
        "No",
        "The magical 8ball isnt around please try again later.",
        "Your too gay for that",
        "Reply again hazy",
        "Hey you... Write a essay",
        "Im Gay",
        "Eat Cheese",
        "Too cheesy"
    ]
    let response = args.join(" ");
    if(!response) return;
    if(!response.includes("?")) return message.channel.send("Thats not a question. Ask a nother");
    message.channel.send("The O'Magical 8ball says, " + replys[(Math.floor(Math.random() * replys.length))]);
}

module.exports.config = {
    command: "ball"
}
