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
        this.node.sendToWS({
            op: "play",
            guildId: this.guildId,
            track: track
        });
        this.playing = true;
        this.playerState.currentTimestamp = Date.now();
    }

    /**
     * Stops and deletes the current player.
     */
    stop() {
        this.node.sendToWS({
            op: "stop",
            guildId: this.guildId
        });
        this.manager.players.delete(this.guildId);
    }

    /**
     * Tells the player to pause.
     */
    pause() {
        this.node.sendToWS({
            op: "pause",
            guildId: this.guildId,
            pause: true
        });
        this.playing = false;
    }

    /**
     * Tells the player to resume.
     */
    resume() {
        this.node.sendToWS({
            op: "pause",
            guildId: this.guildId,
            pause: false
        });
        this.playing = true;
    }

    /**
     * Changes the players volume
     * @param {number} volume - The new volume
     */
    setVolume(volume) {
        this.node.sendToWS({
            op: "volume",
            guildId: this.guildId,
            volume: volume
        });
        this.playerState.currentVolume = volume;
    }

    /**
     * Tells the player to seek.
     * @param {number} ms - The position to seek too.
     */
    seek(ms) {
        this.node.sendToWS({
            op: "seek",
            guildId: this.guildId,
            position: ms
        });
    }

    /**
     * Provides a voice update to the guild.
     * @param {Object} data - The data Object from the VOICE_STATE_UPDATE event.
     */
    provideVoiceUpdate(data) {
        this.node.sendToWS({
            op: "voiceUpdate",
            guildId: this.guildId,
            sessionId: this.manager.client.guilds.get(this.guildId).me.voiceSessionID,
            event: data.d
        });
    }

    /**
     * Deletes the player
     */
    delete() {
        this.manager.players.delete(this.guildId);
    }

};
