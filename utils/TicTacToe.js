const { Canvas } = require("canvas-constructor");
const { get } = require("superagent");
const fs = require("fs");
const { join } = require("path");

module.exports = class TicTacToe {

    constructor(msg, GameMap) {
        this.players = new Map();
        this.msg = msg;
        this.host = msg.author;
        this.last = 0;
        this.started = false;
        this.board = [
            { taken: false, taker: null },
            { taken: false, taker: null },
            { taken: false, taker: null },
            { taken: false, taker: null },
            { taken: false, taker: null },
            { taken: false, taker: null },
            { taken: false, taker: null },
            { taken: false, taker: null },
            { taken: false, taker: null }
        ]
        this.GameMap = GameMap;
        this.winner = false;
        this.tie = false;
    }

    async start() {
        this.started = true;
	    const player = this.players.get(this.playerKeys()[0]);
	    this.msg.channel.send(`${player}, **Has the first move.**`);
        const res = await this.msg.channel.awaitMessages(m => m.content > 0 && m.content < 10 && m.author.id === player.id && m.channel.id === this.msg.channel.id, { maxMatches: 1 });
	    this.fillSlot(this.board[parseInt(res.first().content) - 1], player);
    }

    addPlayer(user) {
        if(this.started) return this.msg.channel.send(":x: **This game is already in-progress**.");
        if(!this.players.get(user.id)) {
            this.players.set(user.id, user);
            this.msg.channel.send(`${user}, **Has joined the game. ${this.players.size === 2 ? `\n${this.host}, You can start the game now. \`i.ttt start\`**` : "**"}`);
        } else {
            this.msg.channel.send(":x: **You are already in this game!**");
        }
    }

    playerKeys() {
        return Array.from(this.players.keys());
    }

    removePlayer(user) {
        if(this.players.get(user.id)) {
            this.players.delete(user.id);
            this.msg.channel.send(`${user}, **Has left the game.**`);
        } else {
            this.msg.channel.send(":x: **You not in this game!**");
        }
    }

    async fillSlot(slot, player) {
        this.msg.channel.startTyping();
        if(slot.taken === false) {
            slot.taken = true;
            slot.taker = player.displayAvatarURL;
            this.checkForWinner(player);
            if(this.winner || this.tie) return;
            await this.drawBoard(player);
        }
        if(this.last === 1) {
            this.last = 0;
            const next = this.players.get(this.playerKeys()[0]);
            try {
                this.msg.channel.send(`${next}, **It's now your turn.**`);
                const res = await this.msg.channel.awaitMessages(m => m.content > 0 && m.content < 10 && m.author.id === next.id && m.channel.id === this.msg.channel.id, { maxMatches: 1, time: 30000, errors: ['time'] });
		        return this.fillSlot(this.board[parseInt(res.first().content) - 1], next);
            } catch (error) {
                this.msg.reply(`**You did not reply in 30 seconds... Game ended.**`);
               	return this.GameMap.delete(this.msg.channel.id);
            }
        } else if(this.last === 0) {
            this.last = 1;
            const next = this.players.get(this.playerKeys()[1]);
            try {
                this.msg.channel.send(`${next}, **It's now your turn.**`);
                const res = await this.msg.channel.awaitMessages(m => m.content > 0 && m.content < 10 && m.author.id === next.id && m.channel.id === this.msg.channel.id, { maxMatches: 1, time: 30000, errors: ['time'] });
                return this.fillSlot(this.board[parseInt(res.first().content) - 1], next);
            } catch (error) {
                this.msg.reply(`**You did not reply in 30 seconds... Game ended.**`);
                return this.GameMap.delete(this.msg.channel.id);
            }
        }
    }

    async checkForWinner(player) {
        if(this.board.filter(s=>s.taken === true).length === 9) this.tie = true;
        if(this.board[0].taker === player.displayAvatarURL && this.board[1].taker === player.displayAvatarURL && this.board[2].taker === player.displayAvatarURL) this.winner = true;
        if(this.board[3].taker === player.displayAvatarURL && this.board[4].taker === player.displayAvatarURL && this.board[5].taker === player.displayAvatarURL) this.winner = true;
        if(this.board[6].taker === player.displayAvatarURL && this.board[7].taker === player.displayAvatarURL && this.board[8].taker === player.displayAvatarURL) this.winner = true;

        if(this.board[0].taker === player.displayAvatarURL && this.board[3].taker === player.displayAvatarURL && this.board[6].taker === player.displayAvatarURL) this.winner = true;
        if(this.board[1].taker === player.displayAvatarURL && this.board[4].taker === player.displayAvatarURL && this.board[7].taker === player.displayAvatarURL) this.winner = true;
        if(this.board[2].taker === player.displayAvatarURL && this.board[5].taker === player.displayAvatarURL && this.board[8].taker === player.displayAvatarURL) this.winner = true;

        if(this.board[0].taker === player.displayAvatarURL && this.board[4].taker === player.displayAvatarURL && this.board[8].taker === player.displayAvatarURL) this.winner = true;
        if(this.board[2].taker === player.displayAvatarURL && this.board[4].taker === player.displayAvatarURL && this.board[6].taker === player.displayAvatarURL) this.winner = true;

        if(this.winner) {
            await this.drawBoard(player);
            this.msg.channel.send(`${player}, **Has won the game of Tic Tac Toe :tada:!**`);
            return this.GameMap.delete(this.msg.channel.id);
        }

        if(this.tie) {
            const host = this.players.get(this.playerKeys()[0]);
            const guest = this.players.get(this.playerKeys()[1]);
            await this.drawBoard(player);
            this.msg.channel.send(`${host} ${guest}, **It's a tie, Better luck next time.**`);
            return this.GameMap.delete(this.msg.channel.id);
        }
    }

    async drawBoard(player) {
	    try {
            const user1 = await this.getTaker(this.board[0]);
            const user2 = await this.getTaker(this.board[1]);
            const user3 = await this.getTaker(this.board[2]);
            const user4 = await this.getTaker(this.board[3]);
            const user5 = await this.getTaker(this.board[4]);
            const user6 = await this.getTaker(this.board[5]);
            const user7 = await this.getTaker(this.board[6]);
            const user8 = await this.getTaker(this.board[7]);
            const user9 = await this.getTaker(this.board[8]);
    
            const tic_tac_toe_board = await fs.readFileSync(join(__dirname, '..', 'assets', 'tictactoe.jpg'));
            const blankSlot = await fs.readFileSync(join(__dirname, '..', 'assets', 'blank.png'))
    
            let newBoard = new Canvas(500, 500)
                .addImage(tic_tac_toe_board, 0, 0, 500, 500)
                .addImage(this.board[0].taken ? user1 : blankSlot, 0, 0, 163, 163)
                .addImage(this.board[1].taken ? user2 : blankSlot, 169, 0, 163, 163)
                .addImage(this.board[2].taken ? user3 : blankSlot, 169*2, 0, 163, 163)
                .addImage(this.board[3].taken ? user4 : blankSlot, 0, 169, 163, 163)
                .addImage(this.board[4].taken ? user5 : blankSlot, 169, 169, 163, 163)
                .addImage(this.board[5].taken ? user6 : blankSlot, 169*2, 169, 163, 163)
                .addImage(this.board[6].taken ? user7 : blankSlot, 0, 169*2, 163, 163)
                .addImage(this.board[7].taken ? user8 : blankSlot, 169, 169*2, 163, 163)
                .addImage(this.board[8].taken ? user9 : blankSlot, 169*2, 169*2, 163, 163);
            const board = await newBoard.toBufferAsync();
            await this.msg.channel.send({ file: { attachment: board } });
            this.msg.channel.stopTyping(true);
	    } catch (e) { console.error(e.stack); }
    }

    async getTaker(slot) {
        if(!slot.taker) return null;
        const res = await get(slot.taker);
        return res.body;
    }

}