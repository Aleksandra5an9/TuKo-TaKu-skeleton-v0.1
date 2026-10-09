(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    const listeners = new Set();

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function createInitialState() {
        return {
            saveVersion: game.config.saveVersion,
            sceneId: "menu",
            checkpointId: "new_game",
            activePlayer: "tuko",
            lastSavedAt: null,

            seals: {
                balance: false,
                logic: false,
                cunning: false,
                courage: false
            },

            pathSteps: {
                tuko: 0,
                taku: 0
            },

            chapterProgress: {
                tavern: 0,
                spaceport: 0,
                casino: 0,
                arena: 0,
                finale: 0
            },

            hintUsage: {},

            settings: {
                musicVolume: 0.65,
                ambienceVolume: 0.7,
                effectsVolume: 0.85,
                voiceVolume: 1,
                subtitles: true,
                subtitleScale: 1
            }
        };
    }

    let current = createInitialState();

    function notify() {
        const snapshot = clone(current);
        listeners.forEach(function (listener) {
            listener(snapshot);
        });
    }

    game.state = {
        createInitial: createInitialState,

        get: function () {
            return current;
        },

        snapshot: function () {
            return clone(current);
        },

        reset: function () {
            const preservedSettings = clone(current.settings);
            current = createInitialState();
            current.settings = preservedSettings;
            notify();
            return current;
        },

        replace: function (nextState) {
            current = clone(nextState);
            notify();
            return current;
        },

        patch: function (changes) {
            Object.keys(changes).forEach(function (key) {
                if (
                    changes[key] &&
                    typeof changes[key] === "object" &&
                    !Array.isArray(changes[key]) &&
                    current[key] &&
                    typeof current[key] === "object" &&
                    !Array.isArray(current[key])
                ) {
                    Object.assign(current[key], changes[key]);
                } else {
                    current[key] = changes[key];
                }
            });

            notify();
            return current;
        },

        setScene: function (sceneId, checkpointId) {
            current.sceneId = sceneId;
            current.checkpointId = checkpointId || sceneId;
            notify();
        },

        updateSettings: function (changes) {
            Object.keys(changes).forEach(function (key) {
                if (Object.prototype.hasOwnProperty.call(current.settings, key)) {
                    current.settings[key] = changes[key];
                }
            });
            notify();
        },

        subscribe: function (listener) {
            listeners.add(listener);
            return function () {
                listeners.delete(listener);
            };
        }
    };
})(window);
