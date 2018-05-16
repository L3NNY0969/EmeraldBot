module.exports = class Pause {

    constructor() {
        this.config = {
            name: "pause",
            usage: "None",
            description: "Pauses/Resumes the current song",
            permission: "None",
            category: "Music",
            aliases: []
        };
    }

    run(bot, msg) {
        const player = bot.player.players.get(msg.guild.id);
        if (!msg.member.voiceChannel) return msg.channel.send(":x: You must be in a voice channel first.");
        if (player) {
            if (msg.member.voiceChannel.id !== msg.guild.me.voiceChannelID) {
                return msg.channel.send(":x: You must be in the same voice channel as the bot.");
            } else {
                if (msg.author.id !== player.queue[0].requester.id && !msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: You must be the person who requested this song or have the administrator permission!");
                if (player.playing === true) {
                    player.pause();
                } else {
                    player.resume();
                }
                return msg.channel.send(`:white_check_mark: The player **${player.playing ? "is now resumed" : "is now paused"}**.`);
            }
        } else {
            msg.channel.send(":x: Nothing is playing!");
        }
    }

};
