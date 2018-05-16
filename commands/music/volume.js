module.exports = class Volume {

    constructor() {
        this.config = {
            name: "volume",
            usage: "volume [integer]",
            description: "Sets the current volume of the song.",
            permission: "None",
            category: "Music",
            aliases: ["vol", "changevol"]
        };
    }

    run(bot, msg, args) {
        const player = bot.player.players.get(msg.guild.id);
        if (!msg.member.voiceChannel) return msg.channel.send(":x: You must be in a voice channel first.");
        if (player) {
            if (msg.member.voiceChannel.id !== msg.guild.me.voiceChannelID) {
                return msg.channel.send(":x: You must be in the same voice channel as the bot.");
            } else {
                if (msg.author.id !== player.queue[0].requester.id && !msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: You must be the person who requested this song or have the administrator permission!");
                if (!parseInt(args[0]) || parseInt(args[0]) < 10 || parseInt(args[0]) > 100) return msg.channel.send(":x: You must provide a number between 10 and 100");
                player.setVolume(parseInt(args[0]));
                return msg.channel.send(`:white_check_mark: The volume was set to ${parseInt(args[0] / 100 * 100)}%`);
            }
        }
    }

};
