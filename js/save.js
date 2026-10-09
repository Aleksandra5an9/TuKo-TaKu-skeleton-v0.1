(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    let storageAvailable = true;

    function readRaw() {
        if (!storageAvailable) {
            return null;
        }

        try {
            return global.localStorage.getItem(game.config.saveKey);
        } catch (error) {
            storageAvailable = false;
            console.warn("Локальное сохранение недоступно:", error);
            return null;
        }
    }

    function normalize(saved) {
        const initial = game.state.createInitial();

        if (!saved || saved.saveVersion !== game.config.saveVersion) {
            return null;
        }

        const normalized = {
            ...initial,
            ...saved,
            seals: { ...initial.seals, ...(saved.seals || {}) },
            pathSteps: { ...initial.pathSteps, ...(saved.pathSteps || {}) },
            chapterProgress: {
                ...initial.chapterProgress,
                ...(saved.chapterProgress || {})
            },
            hintUsage: { ...(saved.hintUsage || {}) },
            settings: { ...initial.settings, ...(saved.settings || {}) }
        };

        /* Восстанавливаем печати из уже пройденных миров */
        if (normalized.pathSteps.tuko >= 3) {
            normalized.seals.balance = true;
        }

        if (normalized.pathSteps.taku >= 3) {
            normalized.seals.navigation = true;
        }

        return normalized;
    }

    game.save = {
        isAvailable: function () {
            return storageAvailable;
        },

        exists: function () {
            return Boolean(this.peek());
        },

        peek: function () {
            const raw = readRaw();

            if (!raw) {
                return null;
            }

            try {
                return normalize(JSON.parse(raw));
            } catch (error) {
                console.warn("Сохранение повреждено:", error);
                return null;
            }
        },

        load: function () {
            const saved = this.peek();

            if (!saved) {
                return null;
            }

            game.state.replace(saved);
            game.audio.applySettings(saved.settings);
            return saved;
        },

        loadSettings: function () {
            if (!storageAvailable) {
                return null;
            }

            try {
                const raw = global.localStorage.getItem(game.config.settingsKey);

                if (!raw) {
                    return null;
                }

                const savedSettings = JSON.parse(raw);
                game.state.updateSettings(savedSettings);
                game.audio.applySettings(game.state.get().settings);
                return game.state.get().settings;
            } catch (error) {
                console.warn("Не удалось загрузить настройки:", error);
                return null;
            }
        },

        writeSettings: function () {
            if (!storageAvailable) {
                return false;
            }

            try {
                global.localStorage.setItem(
                    game.config.settingsKey,
                    JSON.stringify(game.state.get().settings)
                );
                return true;
            } catch (error) {
                console.warn("Не удалось сохранить настройки:", error);
                return false;
            }
        },

        write: function (reason) {
            if (!storageAvailable) {
                return false;
            }

            const snapshot = game.state.snapshot();
            snapshot.lastSavedAt = new Date().toISOString();
            snapshot.lastSaveReason = reason || "checkpoint";

            try {
                global.localStorage.setItem(game.config.saveKey, JSON.stringify(snapshot));
                game.state.patch({ lastSavedAt: snapshot.lastSavedAt });
                return true;
            } catch (error) {
                storageAvailable = false;
                console.warn("Не удалось сохранить игру:", error);
                return false;
            }
        },

        clear: function () {
            if (!storageAvailable) {
                return false;
            }

            try {
                global.localStorage.removeItem(game.config.saveKey);
                return true;
            } catch (error) {
                storageAvailable = false;
                console.warn("Не удалось удалить сохранение:", error);
                return false;
            }
        },

        summary: function () {
            const saved = this.peek();

            if (!saved) {
                return null;
            }

            return {
                sceneId: saved.sceneId,
                checkpointId: saved.checkpointId,
                title: game.config.sceneTitles[saved.sceneId] || "Сохранённая партия",
                lastSavedAt: saved.lastSavedAt
            };
        }
    };
})(window);
