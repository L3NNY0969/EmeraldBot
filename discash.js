const prefix = "dc!";

async function noU(message, sql, args, bot) {
    if (message.content.startsWith(`${prefix}pay`)) {
        const who = message.guild.member(args[0]).user || await bot.fetchUser(args[0]) || message.mentions.users.first();
        return sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(async row => {
            sql.run(`UPDATE scores SET points = ${row.points - 20} WHERE userId = ${message.author.id}`);
            message.channel.send(`Your transaction is being processed...`);
            const row1 = await sql.get(`SELECT * FROM scores WHERE userId ="${who.id}"`);
            sql.run(`UPDATE scores SET points = ${row1.points + 20} WHERE userId = ${message.author.id}`);
            message.channel.send(`You have successfully completed a transaction.`);
            message.channel.send(`Your new current balance is ${row1.points + 20} Discash.`);
        });
    }
}
