const { get } = require("superagent");
const { Canvas } = require("canvas-constructor");
const fs = require("fs");
const path = require("path");

module.exports = class Triggered {

    constructor() {
        this.config = {
            name: "triggered",
            usage: "triggered [mention | user_id]",
            description: "Makes you triggered",
            permission: "None",
            category: "Fun",
            aliases: ["trigger"]
        };
    }

    async run(bot, msg, args) {
        const member = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(args[0]) || msg.member;
        msg.channel.startTyping();

        try {
            const pfp = await get(member.user.displayAvatarURL);
            const t1 = await fs.readFileSync(path.join(__dirname, "..", "..", "assets", "triggered.png"));

            const t2 = new Canvas(256, 256)
                .addImage(pfp.body, 0, 0, 256, 256)
                .addImage(t1, 0, 192, 256, 64);
            const image = await t2.toBufferAsync();
            return msg.channel.send(`**${member.user.username}** is now <:emerald_triggered:438143911018496000>!`, { file: { attachment: image } }).then(() => msg.channel.stopTyping(true));
        } catch (e) {
            msg.channel.stopTyping();
            return msg.channel.send(`:x: Error:\n\n\`\`\`xl\n${e.stack}\`\`\`\n\nIf this problem persists please contact Ice#1234`);
        }
    }

};
