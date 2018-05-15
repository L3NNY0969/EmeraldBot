const superagent = require("superagent");
const cheerio = require("cheerio");

module.exports.run = async (bot, msg, args) => {
    if (!args.join(" ")) { return msg.channel.send(":x: Please enter something to search for."); } else {
        return superagent.get(`https://www.bing.com/search?q=${encodeURIComponent(args.join(" "))}`).then(res => {
            const $ = cheerio.load(res.text);

            const results = [];

            $("li.b_algo").each((i, e) => {
                results.push({
                    title: $(e).first().find("h2").filter(a => a !== undefined).first().text() ? $(e).first().find("h2").filter(a => a !== undefined).first().text() : "No Title Specified",
                    description: $(e).first().find("p").first().text()
                });
            });

            if (results.length === 0) { return msg.channel.send(`:x: No results found for: **${args.join(" ")}**.`); } else {
                const fields = [];
                for (let i = 0; i < 5; i++) {
                    fields.push({
                        name: results[i].title ? results[i].title : "No Title Specified",
                        value: results[i].description ? results[i].description : "No Description Specified."
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
};

module.exports.config = {
    name: "bing",
    usage: "bing [search]",
    description: "Searches bing with magic.",
    permission: "None",
    category: "Utility",
    aliases: ["bingsearch"]
};
