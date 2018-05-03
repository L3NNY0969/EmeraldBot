const superagent = require("superagent");
const cheerio = require("cheerio");
const { RichEmbed } = require('discord.js');

module.exports.run = async (bot, msg, args) => {
    if(!args.join(" ")) return msg.channel.send(":x: Please enter something to search for.");
    else {
        superagent.get(`https://www.bing.com/search?q=${encodeURIComponent(args.join(" "))}`).then(res => {
            let $ = cheerio.load(res.text);

            let results = [];

            $('li.b_algo').each((i, e) => {
                results.push({
                    title: $(e).first().find('h2').filter(a => a != null).first().text(),
                    link: $(e).first().find('a').first().attr('href'),
                    description: $(e).first().find('p').first().text()
                });
            });

            if(results.length === 0) return msg.channel.send(`:x: No results found for: **${args.join(" ")}**.`);
            else {
                let fields = [];
                for(let i = 0; i < 5; i++) {
                    fields.push({
                        name: results[i].title,
                        value: results[i].description
                    });
                }
                msg.channel.send(bot.embed({
                    title: `Search results for: ${args.join(" ")}`,
                    timestamp: true,
                    fields: fields
                }));
            }
        });
    }
}

module.exports.config = {
    name: "bing",
    usage: "bing [search]",
    description: "Searches bing with magic.",
    permission: "None",
    category: "Utility",
    aliases: ["bingsearch"]
}