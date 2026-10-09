(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    const serviceKeys = new Set([
        "F1", "F2", "F3", "F4", "F5", "F6",
        "F7", "F8", "F9", "F10", "F11", "F12"
    ]);

    game.input = {
        isServiceKey: function (event) {
            return serviceKeys.has(event.key) || event.ctrlKey || event.metaKey || event.altKey;
        },

        onKey: function (handler, options) {
            const settings = options || {};

            function listener(event) {
                if (game.input.isServiceKey(event)) {
                    return;
                }

                if (settings.keys && settings.keys.indexOf(event.key) === -1) {
                    return;
                }

                handler(event);
            }

            global.addEventListener("keydown", listener);

            return function () {
                global.removeEventListener("keydown", listener);
            };
        }
    };
})(window);
