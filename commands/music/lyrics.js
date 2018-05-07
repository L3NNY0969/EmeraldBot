const { get } = require("superagent");
const cheerio = require("cheerio");

module.exports.run = async (bot, msg, args) => {
    if (!msg.channel.permissionsFor(bot.user).has(["EMBED_LINKS", "SEND_MESSAGES"])) return;
    if (!args.join(" ")) {
        return msg.channel.send(":x: Please enter a song name.");
    } else {
        msg.channel.startTyping();
        const searchResults = await loadLink(`http://www.songlyrics.com/index.php?section=search&searchW=${encodeURIComponent(args.join(" "))}&submit=Search`);
        try {
            const firstRes = await loadLink(searchResults("a", "div.serpresult").first().attr().href);

            const title = firstRes("h1", "div.pagetitle").text();
            const lyrics = firstRes("p#songLyricsDiv.songLyricsV14.iComment-text").text();

            const embed = bot.embed({
                title: `Lyrics for: ${title.replace(/lyrics/gi, "")}`,
                description: lyrics,
                footerIcon: msg.author.displayAvatarURL,
                footer: `Lyrics requested by ${msg.author.tag}`,
                timestamp: true
            });
            msg.channel.send({ embed: embed, split: true });
            msg.channel.stopTyping(true);
        } catch (error) {
            msg.channel.stopTyping(true);
            return msg.channel.send(`:x: I found no results for: **${args.join(" ")}**`);
        }
    }
};

module.exports.config = {
    name: "lyrics",
    usage: "lyrics [song_title]",
    description: "Gets the lyrics from any song and sends them to you.",
    permission: "None",
    category: "Music",
    aliases: []
};

async function loadLink(link) {
    const res = await get(link);
    return cheerio.load(res.text);
}
