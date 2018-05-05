module.exports = (bot, member) => {
    bot.db.collection("configs").find({ _id: member.guild.id }).toArray(async (err, config) => {
        if (err) throw err;
        if (!config[0].welcome_channel) return;

        const c = member.guild.channels.get(config[0].welcome_channel);
        if (!c) return;
        if (!c.permissionsFor(bot.user).has("SEND_MESSAGES")) return;

        c.send(config.leave_msg
            .replace("e{user}", member.user.tag)
            .replace("e{server_name}", member.guild.name)
            .replace("e{server_id}", member.guild.id)
            .replace("e{server_memcount}", member.guild.members.size)
        );
    });
};
