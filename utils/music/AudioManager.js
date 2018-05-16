const { nodes } = require("../../config.json"); // eslint-disable-line
const { EventEmitter } = require("events");
const { Client } = require("discord.js"); // eslint-disable-line
const AudioPlayer = require("./AudioPlayer.js"); // eslint-disable-line
const AudioNode = require("./AudioNode.js"); // eslint-disable-line
const { get } = require("snekfetch");

/**
 * A custom LavaLink implementation for the bot.
 * @param {Client} - The Discord.js client used.
 * @extends {EventEmitter}
 */
module.exports = class AudioManager extends EventEmitter {

    constructor(client) {
        /**
         * Create the EventEmitter.
         */
        super();

        /**
         * A Map of the players.
         * @type {Map<String, AudioPlayer>}
         */
        this.players = new Map();

        /**
         * The WebSocket used for the AudioNodes.
         * @type {Client}
         */
        this.client = client;

        /**
         * A Map of the current nodes.
         * @type {Map<String, AudioNode>}
         */
        this.nodes = new Map();
        this.launchNodes();

        this.client.on("raw", event => {
            if (event.t === "VOICE_SERVER_UPDATE") {
                const player = this.players.get(event.d.guild_id);
                if (!player) return;
                player.provideVoiceUpdate(event);
            }
        });
    }

    /**
     * Creates all of the nodes and registers
     * all of the event listeners
     * for the nodes.
     */
    launchNodes() {
        for (let i = 0; i < nodes.length; i++) {
            // Create the node
            const node = new AudioNode(this);
            node.create(nodes[i]);
            this.nodes.set(nodes[i].host, node);
        }
    }

    /**
     * Makes the bot join a voice channel.
     * @param {string} data - An object containing values for the bot to join a voice channel.
     * @param {string} data.guildId - The guild that owns voice channel.
     * @param {string} data.channelId - The voice channel in the guild.
     * @param {boolean} data.self_deafened - Determines if the bot will be deafened when the bot joins the channel.
     * @param {boolean} data.self_muted - Determines if the bot will be muted when the bot joins the channel.
     * @param {boolean} data.host - The host of the AudioNode.
     */
    connectToVoice(data) {
        this.client.ws.send({
            op: 4,
            shard: this.client.shard ? this.client.shard.id : 0,
            d: {
                guild_id: data.guildId,
                channel_id: data.channelId,
                self_deaf: data.self_deafened,
                self_mute: data.self_muted
            }
        });
        const node = this.nodes.get(data.host);
        if (!node) throw new Error(`No node with host: ${data.host} found.`);
        this._newPlayer(data, node);
    }

    /**
     * Makes the bot leave a voice channel.
     * @param {string} id - The guild id to leave the channel.
     */
    leaveVoice(id) {
        this.client.ws.send({
            op: 4,
            shard: this.client.shard ? this.client.shard.id : 0,
            d: {
                guild_id: id,
                channel_id: null,
                self_deaf: false,
                self_mute: false
            }
        });
        const player = this.players.get(id);
        if (!player) return;
        player.delete();
    }

    /**
     * Creates a new player or returns an old player.
     * @param {Object} data - The object containing player data.
     * @param {AudioNode} node - The AudioNode to use.
     * @returns {AudioPlayer}
     * @private
     */
    _newPlayer(data, node) {
        const player = this.players.get(data.guildId);
        if (player) return player;
        this.players.set(data.guildId, new AudioPlayer(data, node, this));
    }

    /**
     * Grabs videos/tracks from the lavalink REST api.
     * @param {string} search - The song to search for.
     * @param {Object} node - The node to execute the search on.
     * @returns {Promise<Array>}
     */
    getVideos(search, node) {
        return new Promise(async (resolve, reject) => {
            const res = await get(`http://${node.host}:2333/loadtracks?identifier=${search}`)
                .set("Authorization", node.password);
            if (!res.body.length) return reject("NO_RESULTS");
            return resolve(res.body);
        });
    }

};
