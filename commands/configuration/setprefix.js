module.exports = class SetPrefix {

    constructor() {
        this.config = {
            name: "setprefix",
            usage: "setprefix [prefix | reset]",
            description: "Sets the servers prefix or resets it to the default.",
            permission: "Administrator",
            category: "Configuration",
            aliases: ["sprefix"]
        };
    }

    async run(bot, msg, args) {
        if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;

        if (!args[0]) {
            return msg.channel.send(bot.embed({
                title: ":x: Error!",
                description: "Please enter a new prefix to set.",
                color: 0xff0000
            }));
        }

        if (args[0].length < 2 || args[0].length > 5) {
            return msg.channel.send(bot.embed({
                title: ":x: Error!",
                description: "Please enter a prefix between 1 and 5 characters.",
                color: 0xff0000
            }));
        }

        await bot.db.collection("configs").updateOne({ _id: msg.guild.id }, { $set: { prefix: args[0] || "l." } });
        msg.channel.send(bot.embed({
            title: ":white_check_mark: Prefix updated!",
            description: "The prefix has been reset"
        }));
    }

};
