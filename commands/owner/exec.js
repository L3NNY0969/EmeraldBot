module.exports.run = async (bot, msg, args) => {
    msg.delete().catch(() => {});
    const childProcess = require("child_process");
    const toExec = args.join(" ");
    if (!toExec) { return msg.channel.send(":x: You must provide code to execute!"); } else {
        const temp = await msg.channel.send(`Executing \`${toExec}\`. Please wait...`);
        childProcess.exec(toExec, async (err, stdout) => {
            if (err) { return temp.edit(`Execution Error:\`\`\`xl\n${err.stack}\`\`\``).then(m => m.delete(2000)); }
            if (stdout.toString().length > 1999) {
                const haste = await bot.haste(stdout.toString());
                return temp.edit(haste).then(m => m.delete(2000));
            } else {
                return temp.edit(`\`\`\`xl\n${stdout.toString()}\`\`\``).then(m => m.delete(20000));
            }
        });
    }
};

module.exports.config = {
    name: "exec",
    usage: "exec (code)",
    description: "Executes code",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["ex"]
};
