const superagent = require('superagent');
const cheerio = require('cheerio');

module.exports.run = async (bot, msg, args) => {
    if(!args.join(" ")) return msg.channel.send(":x: Please enter a song name.");
    else {
        msg.channel.startTyping();
        let searchResults = await loadLink(`http://www.songlyrics.com/index.php?section=search&searchW=${encodeURIComponent(args.join(" "))}&submit=Search`);
        try {
            let firstRes = await loadLink(searchResults('a', 'div.serpresult').first().attr().href);

            let title = firstRes('h1', 'div.pagetitle').text();
            let lyrics = firstRes('p#songLyricsDiv.songLyricsV14.iComment-text').text();

            msg.channel.send(`**${title}**\n${lyrics}`, {split: true});
            msg.channel.stopTyping(true);
        } catch (error) {
            msg.channel.stopTyping(true);
            return msg.channel.send(`:x: I found no results for: **${args.join(" ")}**`);
        }
    }
}

module.exports.config = {
    name: "lyrics",
    usage: "lyrics [song_title]",
    description: "Gets the lyrics from any song and sends them to you.",
    permission: "None",
    category: "Music",
    aliases: []
}

async function loadLink(link) {
    let res = await superagent.get(link);
    return cheerio.load(res.text);
}