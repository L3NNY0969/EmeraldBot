const superagent = require("superagent");
const { Canvas } = require("canvas-constructor");
const fs = require("fs");
const path = require("path");

module.exports = (bot, member) => {
    bot.db.collection("configs").find({ _id: member.guild.id }).toArray(async (err, config) => {
        if (err) throw err;
        if (!config[0].welcome_channel) return;

        const c = member.guild.channels.get(config[0].welcome_channel);
        if (!c) return;
        if (!c.permissionsFor(bot.user).has(["ATTACH_FILES", "SEND_MESSAGES"])) return;
        if (!c.permissionsFor(bot.user).has("MANAGE_ROLES")) {} else if (!config[0].auto_role) {} else { try { member.addRole(config[0].auto_role, "Auto Role"); } catch (e) {} }

        const makeWelcome = async () => {
            const pfp = await superagent.get(member.user.displayAvatarURL);
            const bg = await fs.readFileSync(path.join(__dirname, "..", "assets", "welcome.jpg"));
            return new Canvas(700, 200)
                .addImage(bg, 0, 0, 700, 200)
                .addImage(pfp.body, 20, 25, 150, 155)
                .setTextFont("20px Arial")
                .setColor("#ffffff")
                .addText(`Welcome ${member.user.tag}`, 185, 45)
                .addText(`To ${member.guild.name}`, 185, 65)
                .addText(`You are member #${member.guild.memberCount}`, 185, 85)
                .toBufferAsync();
        };

        const welcome = await makeWelcome();
        c.send(`:wave: Hello **${member.user}**!`, { file: { attachment: welcome } });
    });
};
