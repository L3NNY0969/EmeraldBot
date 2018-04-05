module.exports.run = async (bot, msg, args) => {
    let m = await msg.channel.send("Please wait...");
    let fs = require('fs');
    let snekfetch = require('snekfetch');
    let Canvas = require('canvas-prebuilt');
    let canvas = new Canvas(256, 256);
    let ctx = canvas.getContext('2d');
    let path = require('path');
    Image = Canvas.Image;
    let user = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(args[0]) || msg.member;
    try {
        msg.channel.startTyping();
        if(!fs.existsSync(path.join(__dirname, '..', '..', 'avatars', `${user.user.id}.png`))) snekfetch.get(user.user.displayAvatarURL).pipe(fs.createWriteStream(path.join(__dirname, '..', '..', 'avatars', `${user.user.id}.png`)))
        let createTriggeredImage = async () => {
            let icon = new Image();
            let template = new Image();
            icon.src = await fs.readFileSync(path.join(__dirname, '..', '..', 'avatars', `${user.user.id}.png`));
            template.src = await fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'triggered.png'));
    
            ctx.drawImage(icon, 0, 0, 256, 256);
            ctx.drawImage(template, 0, 192);
        }
        setTimeout(() => {
            createTriggeredImage().then(() => {
                msg.channel.send(`**${user.user.username}** is now triggered!`, {
                    files: [
                        {
                            attachment: canvas.toBuffer(),
                            name: "triggered.png"
                        }
                    ]
                });
                msg.channel.stopTyping();
                fs.unlink(path.join(__dirname, '..', '..', 'avatars', `${user.user.id}.png`), (err) => {
                    if(err) return msg.channel.send(`:x: Error:\n\n\`\`\`xl\n${err.message}\`\`\`\n\nIf this problem persists please contact Ice#1234`);
                    console.log(`[INFO] Deleted ${user.user.username}'s avatar!`);
                });
                m.delete();
            });
        }, 1500);
    } catch (e) {
        msg.channel.stopTyping();
        return msg.channel.send(`:x: Error:\n\n\`\`\`xl\n${err.message}\`\`\`\n\nIf this problem persists please contact Ice#1234`);
    }
}

module.exports.config = {
    name: "triggered",
    usage: "triggered [mention | user_id]",
    description: "Makes you triggered",
    permission: "None",
    category: "Fun",
    aliases: []
}