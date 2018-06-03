module.exports = class Support {

    constructor() {
        this.config = {
            name: "support",
            usage: "None",
            description: "Gives you a invite link to join my server",
            permission: "None",
            category: "General",
            aliases: ["server"]
        };
    }

    run(bot, msg) {
        msg.channel.send(`You can join my support server using the link down below\n<https://discord.gg/6nyBVAT>`);
    }

};
