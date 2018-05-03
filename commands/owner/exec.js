module.exports.run = async (bot, msg, args) => {
    msg.delete().catch(O_o=>{});
    let childProcess = require('child_process');
    let toExec = args.join(" ");
    if(!toExec) return msg.channel.send(":x: You must provide code to execute!");
    else {
        let temp = await msg.channel.send(`Executing \`${toExec}\`. Please wait...`);
        childProcess.exec(toExec, async (err, stdout, stderr) => {
            if(err) temp.edit(`Execution Error:\`\`\`xl\n${err.stack}\`\`\``).then(m=>m.delete(2000))
            else {
                if(stdout.toString().length > 1999) {
                    let haste = await bot.haste(stdout.toString());
                    temp.edit(haste).then(m=>m.delete(2000));
                } else {
                    temp.edit(`\`\`\`xl\n${stdout.toString()}\`\`\``).then(m=>m.delete(20000));
                }
            }
        });
    }
}

module.exports.config = {
    name: "exec",
    usage: "exec (code)",
    description: "Executes code",
    permission: "Bot Owner",
    category: "Owner",
    aliases: ["ex"]
}