const { RichEmbed } = require("discord.js");
const { EventEmitter } = require("events");

module.exports = class Paginator {
    constructor(msg, pages=[], title, color, reactionsDisabled = false) {
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
        this.usingCustom = false;
        this.reactionsDisabled = reactionsDisabled;
        this.emotes = ["440624348915695640", "440624439495884800", "440624504373510155", "440624789099642891", "440625003134844938"];
    }

    async start() {
        if(!this.enabled) await this.switchPage(0);
        if(this.reactionsDisabled) return;
        this.rCollector = this.sentMsg.createReactionCollector((reaction, user) => {
            if(this.usingCustom) {
                [
                    "emerald_menu_rewind", 
                    "emerald_menu_backward", 
                    "emerald_menu_stop",
                    "emerald_menu_forward",
                    "emerald_menu_fastforward"
                ].includes(reaction.emoji.name) && user.id === this.reactor.id && reaction.remove(user).catch(O_o=>{}) && this.rCollector.emit("collect", reaction);
                return;
            } else {
                [
                    "⏪",
                    "⬅", 
                    "⏸", 
                    "➡", 
                    "⏩", 
                    "🔢"
                ].includes(reaction.emoji.name) && user.id === this.reactor.id && reaction.remove(user).catch(O_o=>{}) && this.rCollector.emit("collect", reaction);
                return;
            }
        }, {time: 864e5});
        this.rCollector.on("collect", async r => {
            if(this.usingCustom) {
                switch(r.emoji.name) {
                    case "emerald_menu_rewind": {await this.firstPage(); break;}
                    case "emerald_menu_backward": {await this.backward(); break;}
                    case "emerald_menu_stop": {await this.end(); break;}
                    case "emerald_menu_forward": {await this.forward(); break;}
                    case "emerald_menu_fastforward": {await this.lastPage(); break;}
                }
            } else {
                switch(r.emoji.name) {
                    case "⏪": {await this.firstPage(); break;}
                    case "⬅": {await this.backward(); break;}
                    case "⏸": {await this.end(); break;}
                    case "➡": {await this.forward(); break;}
                    case "⏩": {await this.lastPage(); break;}
                    case "🔢": {await this.userInputPageSwitch(); break;}
                }
            }
        });
        this.rCollector.on("end", () => this.end());
    }

    async switchPage(pageNum) {
        this.currentPage = pageNum;
        if (this.enabled) {
            if(this.currentPage.toString().match(/-[0-9]/)) return true;
            else if(this.currentPage === this.pages.length) return true;
            else return this.sentMsg.edit(new RichEmbed().setTitle(this.pageTitle === null ? null : this.pageTitle).setColor(this.pageColor).setFooter(`Showing page ${this.currentPage+1} of ${this.pages.length}.`).addField(this.pages[this.currentPage].title, this.pages[this.currentPage].description, false));
        } else {
            this.enabled = true;
            this.sentMsg = await this.msg.channel.send(new RichEmbed().setTitle(this.pageTitle === null ? null : this.pageTitle).setColor(this.pageColor).setFooter(`Showing page ${this.currentPage+1} of ${this.pages.length}.`).addField(this.pages[0].title, this.pages[0].description, false));
            if(this.reactionsDisabled) return;
            for(var reaction of this.emotes) {
                try {
                    this.usingCustom = true;
                    if(["440624348915695640", "440625003134844938"].includes(reaction) && this.pages.length <= 2) continue;
                    else await this.sentMsg.react(reaction).catch(O_o=>{});
                } catch (error) {
                    this.usingCustom = false;
                    if(['⏪', '⏩', '🔢'].includes(reaction) && this.pages.length <= 2) continue;
                    else {
                        for(const r of ['⏪', '⬅', '⏸', '➡', '⏩', '🔢']) {
                            await this.sentMsg.react(r).catch(O_o=>{});
                        }
                    }
                }
            }
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
        let tm = await this.msg.channel.send("What page would you like to go to? **NOTE: This times out in 5 seconds, you can reply with `cancel`, `stop` to stop this selection.**");
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
            this.sentMsg.delete().catch(O_o=>{});
        } catch (error) {}
    }
}