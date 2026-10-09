(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    let subtitleElement = null;
    let toastTimer = null;

    function overlayRoot() {
        return document.getElementById("overlay-root");
    }

    function uiFlags() {
        return game.config.ui || {};
    }

    function overlayMessagesEnabled() {
        return uiFlags().overlayMessages !== false;
    }

    function toastMessagesEnabled() {
        return uiFlags().toastMessages !== false;
    }

    function closeOverlay() {
        const root = overlayRoot();
        root.querySelectorAll(".modal-backdrop, .status-toast").forEach(function (element) {
            element.remove();
        });
    }

    function settingSlider(label, key, min, max, step) {
        const row = document.createElement("label");
        row.className = "setting-row";

        const title = document.createElement("span");
        title.textContent = label;

        const input = document.createElement("input");
        input.type = "range";
        input.min = String(min);
        input.max = String(max);
        input.step = String(step);
        input.value = String(game.state.get().settings[key]);
        input.dataset.settingKey = key;

        row.append(title, input);
        return row;
    }

    game.ui = {
        closeOverlay: closeOverlay,

        createHud: function (context, options) {
            const settings = options || {};
            const state = game.state.get();
            const hud = document.createElement("header");
            hud.className = "game-hud";

            const status = document.createElement("div");
            status.className = "hud-status";

            const actions = document.createElement("div");
            actions.className = "hud-actions";

            if (overlayMessagesEnabled()) {
                const repeatButton = game.mechanics.createButton("↻", "icon-button");
                repeatButton.setAttribute("aria-label", "Повторить последнюю реплику");
                repeatButton.title = "Повторить реплику";
                context.on(repeatButton, "click", function () {
                    game.ui.repeatSubtitle();
                });
                actions.appendChild(repeatButton);
            }


            hud.append(status, actions);
            return hud;
        },

        showSubtitle: function (text) {
            if (!overlayMessagesEnabled()) {
                return;
            }

            const root = overlayRoot();
            const settings = game.state.get().settings;

            if (!settings.subtitles) {
                return;
            }

            if (!subtitleElement) {
                subtitleElement = document.createElement("div");
                subtitleElement.className = "subtitle-box";
                subtitleElement.setAttribute("role", "status");
                root.appendChild(subtitleElement);
            }

            subtitleElement.textContent = text;
            subtitleElement.dataset.lastText = text;
        },

        hideSubtitle: function () {
            if (subtitleElement) {
                subtitleElement.remove();
                subtitleElement = null;
            }
        },

        repeatSubtitle: function () {
            if (!overlayMessagesEnabled() || !subtitleElement || !subtitleElement.dataset.lastText) {
                return;
            }

            subtitleElement.animate(
                [
                    { transform: "translateX(50%) scale(1)" },
                    { transform: "translateX(50%) scale(1.025)" },
                    { transform: "translateX(50%) scale(1)" }
                ],
                { duration: 320 }
            );
        },

        toast: function (text) {
            if (!toastMessagesEnabled()) {
                return;
            }

            const root = overlayRoot();
            const oldToast = root.querySelector(".status-toast");

            if (oldToast) {
                oldToast.remove();
            }
            if (toastTimer) {
                global.clearTimeout(toastTimer);
            }

            const toast = document.createElement("div");
            toast.className = "status-toast";
            toast.setAttribute("role", "status");
            toast.textContent = text;
            root.appendChild(toast);

            toastTimer = global.setTimeout(function () {
                toast.remove();
                toastTimer = null;
            }, 2600);
        },

        showSettings: function () {
            closeOverlay();

            const backdrop = document.createElement("div");
            backdrop.className = "modal-backdrop";

            const card = document.createElement("section");
            card.className = "modal-card panel";
            card.setAttribute("role", "dialog");
            card.setAttribute("aria-modal", "true");
            card.setAttribute("aria-labelledby", "settings-title");

            const title = document.createElement("h2");
            title.id = "settings-title";
            title.textContent = "Настройки";

            const form = document.createElement("div");
            form.append(
                settingSlider("Музыка", "musicVolume", 0, 1, 0.05),
                settingSlider("Окружение", "ambienceVolume", 0, 1, 0.05),
                settingSlider("Эффекты", "effectsVolume", 0, 1, 0.05),
                settingSlider("Голос", "voiceVolume", 0, 1, 0.05)
            );

            if (overlayMessagesEnabled()) {
                form.appendChild(
                    settingSlider("Размер субтитров", "subtitleScale", 0.85, 1.35, 0.05)
                );

                const subtitleRow = document.createElement("label");
                subtitleRow.className = "setting-row";
                const subtitleLabel = document.createElement("span");
                subtitleLabel.textContent = "Субтитры";
                const subtitleToggle = document.createElement("input");
                subtitleToggle.type = "checkbox";
                subtitleToggle.checked = game.state.get().settings.subtitles;
                subtitleToggle.dataset.settingKey = "subtitles";
                subtitleRow.append(subtitleLabel, subtitleToggle);
                form.appendChild(subtitleRow);
            }

            const actions = document.createElement("div");
            actions.className = "button-row";
            actions.style.marginTop = "24px";
            const closeButton = game.mechanics.createButton("ГОТОВО", "gold-button", closeOverlay);
            actions.appendChild(closeButton);

            form.addEventListener("input", function (event) {
                const input = event.target;
                const key = input.dataset.settingKey;

                if (!key) {
                    return;
                }

                const value = input.type === "checkbox" ? input.checked : Number(input.value);
                game.state.updateSettings({ [key]: value });
                game.audio.applySettings(game.state.get().settings);
                document.documentElement.style.setProperty("--subtitle-scale", game.state.get().settings.subtitleScale);
                game.save.writeSettings();

                if (!game.state.get().settings.subtitles) {
                    game.ui.hideSubtitle();
                }
            });

            card.append(title, form, actions);
            backdrop.appendChild(card);
            overlayRoot().appendChild(backdrop);
            closeButton.focus();
        },

        
    };
})(window);
