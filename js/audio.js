(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    const channels = {
        music: null,
        ambience: null,
        voice: null
    };
    let unlocked = false;

    function stopAudio(audio) {
        if (!audio) {
            return;
        }

        audio.pause();
        audio.currentTime = 0;
    }

    function createAudio(path, volume, loop) {
        const audio = new Audio(path);
        audio.preload = "auto";
        audio.volume = volume;
        audio.loop = Boolean(loop);
        return audio;
    }

    game.audio = {
        unlock: function () {
            unlocked = true;
        },

        isUnlocked: function () {
            return unlocked;
        },

        applySettings: function (settings) {
            if (!settings) {
                return;
            }

            if (channels.music) {
                channels.music.volume = settings.musicVolume;
            }
            if (channels.ambience) {
                channels.ambience.volume = settings.ambienceVolume;
            }
            if (channels.voice) {
                channels.voice.volume = settings.voiceVolume;
            }
        },

        playLoop: function (channelName, path) {
            const settings = game.state.get().settings;
            const volumeKey = channelName === "music" ? "musicVolume" : "ambienceVolume";

            this.stop(channelName);
            channels[channelName] = createAudio(path, settings[volumeKey], true);

            if (unlocked) {
                channels[channelName].play().catch(function () {});
            }

            return channels[channelName];
        },

        playVoice: function (path) {
            this.stop("voice");
            channels.voice = createAudio(path, game.state.get().settings.voiceVolume, false);

            if (unlocked) {
                channels.voice.play().catch(function () {});
            }

            return channels.voice;
        },

        stop: function (channelName) {
            stopAudio(channels[channelName]);
            channels[channelName] = null;
        },

        stopAll: function () {
            Object.keys(channels).forEach(this.stop.bind(this));
        }
    };
})(window);
