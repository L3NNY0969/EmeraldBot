const { EventEmitter } = require("events");
const AudioNode = require("./AudioNode.js"); // eslint-disable-line
const AudioManager = require("./AudioManager"); // eslint-disable-line

module.exports = class AudioPlayer extends EventEmitter {

    /**
     * Creates a new audio player.
     * @param {Object} data - The data from the connectToVoice method.
     * @param {AudioNode} node - The AudioNode used.
     * @param {AudioManager} manager - The AudioManager used.
     */
    constructor(data, node, manager) {
        /**
         * Create the EventEmitter.
         */
        super();
        /**
         * The player the connectToVoice method returned.
         * @type {Object}
         */
        this.data = data;

        /**
         * The current state of the AudioPlayer.
         */
        this.playerState = {
            currentVolume: 100,
            currentTrack: null,
            currentTimestamp: null,
            currentPosition: 0
        };

        /**
         * Whether or not the player is playing or not.
         */
        this.playing = false;

        /**
         * The AudioNode that was used.
         * @type {AudioNode}
         */
        this.node = node;

        /**
         * The AudioManager that was used.
         * @type {AudioManager}
         */
        this.manager = manager;

        /**
         * The id of the guild
         * @type {String}
         */
        this.guildId = data.guildId;

        /**
         * The queue the of the player.
         * @type {Array}
         */
        this.queue = [];

        /**
         * Wether the player is on loop or not.
         * @type {Boolean}
         */
        this.looping = false;
    }

    /**
     * Plays a song in the voice channel.
     * @param {string} track - The track to play.
     */
    play(track) {
        const obj = Object.assign({
            op: "play",
            guildId: this.guildId,
            track: track
        });
        this.node.sendToWS(obj);
        this.playing = true;
        this.playerState.currentTimestamp = Date.now();
    }

    /**
     * Stops and deletes the current player.
     */
    stop() {
        const obj = Object.assign({
            op: "stop",
            guildId: this.guildId
        });
        this.node.sendToWS(obj);
        this.manager.players.delete(this.guildId);
    }

    /**
     * Tells the player to pause.
     */
    pause() {
        const obj = Object.assign({
            op: "pause",
            guildId: this.guildId,
            pause: true
        });
        this.node.sendToWS(obj);
        this.playing = false;
    }

    /**
     * Tells the player to resume.
     */
    resume() {
        const obj = Object.assign({
            op: "pause",
            guildId: this.guildId,
            pause: false
        });
        this.node.sendToWS(obj);
        this.playing = true;
    }

    /**
     * Changes the players volume
     * @param {number} volume - The new volume
     */
    setVolume(volume) {
        const obj = Object.assign({
            op: "volume",
            guildId: this.guildId,
            volume: volume
        });
        this.node.sendToWS(obj);
        this.playerState.currentVolume = volume;
    }

    /**
     * Provides a voice update to the guild.
     * @param {Object} data - The data Object from the VOICE_STATE_UPDATE event.
     */
    provideVoiceUpdate(data) {
        const obj = Object.assign({
            op: "voiceUpdate",
            guildId: this.guildId,
            sessionId: this.manager.client.guilds.get(this.guildId).me.voiceSessionID,
            event: data.d
        });
        this.node.sendToWS(obj);
    }

    /**
     * Deletes the player
     */
    delete() {
        this.manager.players.delete(this.guildId);
    }

};
