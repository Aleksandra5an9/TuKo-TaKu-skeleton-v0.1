(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;

    game.hints = {
        getLevel: function (sceneId) {
            const usage = game.state.get().hintUsage[sceneId];
            return usage ? usage.level : 0;
        },

        recordError: function (sceneId) {
            const state = game.state.get();
            const current = state.hintUsage[sceneId] || { errors: 0, level: 0 };
            current.errors += 1;
            current.level = Math.min(4, current.errors);
            state.hintUsage[sceneId] = current;
            return current.level;
        },

        resetScene: function (sceneId) {
            delete game.state.get().hintUsage[sceneId];
        }
    };
})(window);
