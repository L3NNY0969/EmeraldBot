module.exports = class Invite {

    constructor() {
        this.config = {
            name: "invite",
            usage: "None",
            description: "Gives you a invite link to add me to your server",
            permission: "None",
            category: "General",
            aliases: ["inv"]
        };
    }

    run(bot, msg) {
        msg.channel.send(`Here is my invite link:\n<${bot.invite}>`);
    }

};
