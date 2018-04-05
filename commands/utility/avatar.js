module.exports.run = async (bot, msg, args) => {
    if(!args[0]) return msg.channel.send(":x: Please enter a username or enter their id!");
    let userID,
        mention,
        ret;
    args[0].match(/^\d{18}$/) ? userID = args[0] : args[0].match(/^((<@!?(\d{18})>)).*$/) ? mention = args[0] : ret = true;
    if(ret) return msg.channel.send(`:x: **${args[0]}** is not a valid user mention or user ID!`);
    let avatar;
    try {
        avatar = userID ? await bot.fetchUser(userID) : msg.mentions.users.first();
    } catch(error) {
        return msg.channel.send("I could not find that user.");
    }
    let avatarMatch = /^https?:\/\/(cdn.discordapp.com\/avatars)\/(.*)(\.\w{3,4})(?:[?&](.*))$/.exec(avatar.displayAvatarURL);
    try {
        if(avatarMatch) {
            let m = await msg.channel.send("Loading Avatar...");
            await msg.channel.send({
                files: [
                    {
                        attachment: avatar.displayAvatarURL,
                        name: `${avatar.username}\'s avatar${avatarMatch[3]}`
                    }
                ]
            });
            m.delete();
        }
    } catch(error) {
        msg.channel.send("Could not find that user.");
    }
}

module.exports.config = {
    name: "avatar",
    usage: "avatar [mention | user_id]",
    description: "Sends a users avatar!",
    permission: "None",
    category: "Utility",
    aliases: ["ava"]
}