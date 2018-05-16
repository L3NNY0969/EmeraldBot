module.exports = class Avatar {

    constructor() {
        this.config = {
            name: "avatar",
            usage: "avatar [mention | user_id]",
            description: "Sends a users avatar!",
            permission: "None",
            category: "Utility",
            aliases: ["ava"]
        };
    }

    async run(bot, msg, args) {
        if (!msg.channel.permissionsFor(bot.user).has(["SEND_MESSAGES", "ATTACH_FILES"])) return;
        if (!args[0]) return msg.channel.send(":x: Please enter mention a user or enter their id!");
        const avatar = await bot.fetchUser(args[0]).user || msg.member;

        if (avatar) {
            msg.channel.send({ file: { attachment: avatar.displayAvatarURL } });
        } else {
            return msg.channel.send("Could not find that user.");
        }
    }

};
