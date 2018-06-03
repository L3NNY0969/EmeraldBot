module.exports = class SetAntiSwear {

    constructor() {
        this.config = {
            name: "setantiswear",
            usage: "setantiswear [yes | no]",
            description: "Turns on or off Anti Swear. Words must be added manually.",
            permission: "Administrator",
            category: "Configuration",
            aliases: ["santiswear"]
        };
    }

    async run(bot, msg, args) {
        if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

        if (!args[0]) {
            return msg.channel.send(bot.embed({
                title: ":x: Args Error",
                description: "Please enter a valid option on or off.",
                color: 0xff0000
            }));
        }
        if (args[0] === "on") {
            await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { anti_swear: true } });
            msg.channel.send(bot.embed({
                title: ":white_check_mark: Anti swear updated!",
                description: "Anti swear has been turned on."
            }));
        } else if (args[0] === "off") {
            await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { anti_swear: false } });
            msg.channel.send(bot.embed({
                title: ":white_check_mark: Anti swear updated!",
                description: "Anti swear has been turned off."
            }));
        } else {
            return msg.channel.send(bot.embed({
                title: ":white_check_mark: Args Error",
                description: "Please enter a valid option on or off.",
                color: 0xff0000
            }));
        }
    }

};
