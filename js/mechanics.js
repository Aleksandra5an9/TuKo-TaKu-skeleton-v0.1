(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;

    game.mechanics = {
        createImage: function (src, className, alt) {
            const image = document.createElement("img");
            image.src = src;
            image.className = className || "";
            image.alt = alt || "";
            image.draggable = false;
            return image;
        },

        createButton: function (label, className, onClick) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = className || "gold-button";
            button.textContent = label;

            if (onClick) {
                button.addEventListener("click", onClick);
            }

            return button;
        },

        formatSaveTime: function (isoDate) {
            if (!isoDate) {
                return "";
            }

            try {
                return new Intl.DateTimeFormat("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }).format(new Date(isoDate));
            } catch (error) {
                return "";
            }
        }
    };
})(window);
