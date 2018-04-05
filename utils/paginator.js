const { RichEmbed } = require("discord.js");
const { EventEmitter } = require("events");

module.exports = class Paginator extends EventEmitter {
    constructor(msg, pages=[], title, color) {
        super();
        this.msg = msg;
        this.rCollector = null;
        this.mCollector = null;
        this.sentMsg = null;
        this.reactor = msg.author;
        this.pages = pages;
        this.currentPage = 0;
        this.pageColor = color;
        this.pageTitle = title;
        this.enabled = false;
        this.emotes = ['⏪', '⬅', '⏸', '➡', '⏩', '🔢'];
    }

    async start() {
        if(!this.enabled) await this.switchPage(0);
        this.rCollector = this.sentMsg.createReactionCollector((reaction, user) => this.emotes.includes(reaction.emoji.name) && user.id === this.reactor.id && reaction.remove(user), {time: 864e5});
        this.rCollector.on("collect", async r => {
            switch(r.emoji.name) {
                case "⏪": {await this.firstPage(); break;}
                case "⬅": {await this.backward(); break;}
                case "⏸": {await this.end(); break;}
                case "➡": {await this.forward(); break;}
                case "⏩": {await this.lastPage(); break;}
                case "🔢": {await this.userInputPageSwitch(); break;}
            }
        });
        this.rCollector.on("end", () => this.end());
    }

    async switchPage(pageNum) {
        this.currentPage = pageNum;
        if (this.enabled) {
            if(this.currentPage.toString().match(/-/)) return this.forward();
            else if(this.currentPage === this.pages.length) return this.backward();
            else return this.sentMsg.edit(new RichEmbed().setTitle(this.pageTitle).setColor(this.pageColor).setFooter(`Page [${this.currentPage+1}/${this.pages.length}]`).addField(this.pages[this.currentPage].title, this.pages[this.currentPage].description, false));
        } else {
            this.enabled = true;
            this.sentMsg = await this.msg.channel.send(new RichEmbed().setTitle(this.pageTitle).setColor(this.pageColor).setFooter(`Page [${this.currentPage+1}/${this.pages.length}]`).addField(this.pages[0].title, this.pages[0].description, false));
            for(var reaction of this.emotes) {
                if(['⏪', '⏩', '🔢'].includes(reaction) && this.pages.length === 2) continue;
                else await this.sentMsg.react(reaction);
            }
            this.emit("sessionStart", this.msg);
        }
    }

    async forward() {
        return await this.switchPage(this.currentPage+1);
    }

    async backward() {
        return await this.switchPage(this.currentPage-1);
    }

    async lastPage() {
        return await this.switchPage(this.pages.length-1);
    }

    async firstPage() {
        return await this.switchPage(0);
    }

    async userInputPageSwitch() {
        let tm = await this.msg.channel.send("What page would you like to go to? **NOTE: This times out in 5 seconds, you can reply with `cancel`, `stop` to stop this.**");
        this.mCollector = this.msg.channel.createMessageCollector(m=>m.author.id === this.reactor.id, {time: 5000, errors: ["time"]});
        this.mCollector.on("collect", m => {
            let userEnd = /cancel|end/.exec(m.content);
            if(userEnd) {
                tm.delete();
                return this.mCollector.stop();
            }
            if(!this.pages[parseInt(m.content)-1]) {
                let NAN = false;
                if(isNaN(m.content)) NAN = true;
                else NAN = false;
                this.msg.channel.send(`Invalid page provided \`[${NAN === true ? m.content : parseInt(m.content)}/${this.pages.length}\`]`).then(mm => {
                    setTimeout(() => mm.delete(), 1500);
                });
            } else this.switchPage(parseInt(m.content)-1);
            tm.delete();
            this.mCollector.stop();
        });
        this.mCollector.on("end", c => {
            if(c.size === 0) {
                this.msg.channel.send("The selection timed out!").then(m => {
                    setTimeout(() => {
                        tm.delete();
                        m.delete();
                    }, 1500);
                });
            }
        });
    }

    async end() {
        this.enabled = false;
        try {
            this.sentMsg.delete(1500).catch(O_o=>{});
            this.emit("sessionEnd", this.msg);
        } catch (error) {}
    }
}