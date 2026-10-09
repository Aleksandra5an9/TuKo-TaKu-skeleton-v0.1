(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;

    function startNewGame() {
        game.state.reset();
        game.save.clear();
        game.audio.applySettings(game.state.get().settings);
        game.engine.goTo("prologue_title", {
            checkpointId: "new_game",
            save: true,
            saveReason: "новая партия"
        });
    }

    function showBootScreen(onComplete) {
        const boot = document.createElement("div");

        boot.style.cssText = `
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            cursor: default;
        `;

        const text = document.createElement("div");

        text.textContent = "НАЖМИ F11";

        text.style.cssText = `
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 22px;
            letter-spacing: 3px;
            text-align: center;
            user-select: none;
        `;

        boot.appendChild(text);
        document.body.appendChild(boot);

        let f11Pressed = false;
        let completed = false;
        let point = null;

        function finishBoot() {
            if (completed) return;
            completed = true;

            game.audio.unlock();

            document.removeEventListener("keydown", onKeyDown, true);

            text.textContent = "ЗАГРУЗКА...";

            game.preloader.loadInitial().then(function () {
                boot.remove();

                onComplete();
            });
        }

        function createPoint() {
            if (point) return;

            text.textContent = "КЛИКНИ НА ТОЧКУ";

            point = document.createElement("div");

            const x = 10 + Math.random() * 80;
            const y = 10 + Math.random() * 80;

            point.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 12px;
                height: 12px;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                background: #d8a83e;
                box-shadow:
                    0 0 8px #d8a83e,
                    0 0 18px rgba(216, 168, 62, 0.8);
                cursor: pointer;
                animation: tukoBootPoint 1s ease-in-out infinite;
            `;

            boot.appendChild(point);

            point.addEventListener("pointerdown", function () {
                finishBoot();
            }, { once: true });
        }

        function onKeyDown(event) {
            if (event.key === "F11") {
                f11Pressed = true;

                if (!point) {
                    createPoint();
                }
            }
        }

        document.addEventListener("keydown", onKeyDown, true);

        const style = document.createElement("style");

        style.textContent = `
            @keyframes tukoBootPoint {
                0%, 100% {
                    opacity: 0.25;
                    transform: translate(-50%, -50%) scale(0.8);
                }

                50% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2);
                }
            }
        `;

        document.head.appendChild(style);
    }

    function getDebugQuery() {
        const debug = game.config.debug;

        if (!debug || !debug.enabled) {
            return { sceneId: null, presetName: null };
        }

        try {
            const params = new URLSearchParams(global.location.search);
            return {
                sceneId: params.get(debug.queryParameter || "scene"),
                presetName: params.get(debug.presetParameter || "preset")
            };
        } catch (error) {
            console.warn("Не удалось прочитать DEBUG-параметры:", error);
            return { sceneId: null, presetName: null };
        }
    }

    function resolveDebugScene(queryScene) {
        const debug = game.config.debug;

        if (!debug || !debug.enabled) {
            return null;
        }

        const requestedScene = queryScene || debug.startScene;

        if (!requestedScene) {
            return null;
        }

        if (!game.engine.hasScene(requestedScene)) {
            console.warn("DEBUG: сцена не найдена:", requestedScene);
            return null;
        }

        return requestedScene;
    }

    function applyDebugPreset(presetName) {
        if (!presetName) {
            return false;
        }

        const debug = game.config.debug;
        const presets = debug && debug.presets ? debug.presets : {};
        const preset = presets[presetName];

        if (!preset) {
            console.warn("DEBUG: preset не найден:", presetName);
            return false;
        }

        const current = game.state.get();
        const patch = {};

        if (preset.activePlayer) {
            patch.activePlayer = preset.activePlayer;
        }

        if (preset.seals) {
            patch.seals = {
                ...current.seals,
                ...preset.seals
            };
        }

        if (preset.pathSteps) {
            patch.pathSteps = {
                ...current.pathSteps,
                ...preset.pathSteps
            };
        }

        if (preset.chapterProgress) {
            patch.chapterProgress = {
                ...current.chapterProgress,
                ...preset.chapterProgress
            };
        }

        if (preset.hintUsage) {
            patch.hintUsage = {
                ...preset.hintUsage
            };
        }

        game.state.patch(patch);
        return true;
    }

    function exposeDebugControls() {
        global.TUKO_DEBUG = {
            go: function (sceneId, presetName) {
                if (!game.config.debug || !game.config.debug.enabled) {
                    console.warn("DEBUG отключён в js/config.js.");
                    return false;
                }

                if (!game.engine.hasScene(sceneId)) {
                    console.warn("DEBUG: сцена не найдена:", sceneId);
                    return false;
                }

                if (presetName) {
                    applyDebugPreset(presetName);
                }

                game.engine.goTo(sceneId, { updateState: false, save: false });
                return true;
            },

            preset: function (presetName) {
                return applyDebugPreset(presetName);
            },

            scenes: function () {
                const ids = ["menu"].concat(Object.keys(game.scenes || {}));
                console.table(ids.map(function (id) {
                    return {
                        id: id,
                        название: game.config.sceneTitles[id] || "—"
                    };
                }));
                return ids;
            },

            presets: function () {
                const presets = Object.keys((game.config.debug && game.config.debug.presets) || {});
                console.table(presets.map(function (name) {
                    return { preset: name };
                }));
                return presets;
            }
        };
    }

    const menuScene = {
        id: "menu",

        mount: function (root, context) {
            // ---- СОЗДАНИЕ ЭЛЕМЕНТОВ ----
            const screen = document.createElement("section");
            screen.className = "screen menu-screen";

            const content = document.createElement("div");
            content.className = "screen-content";

            const copy = document.createElement("div");
            copy.className = "menu-copy";

            const eyebrow = document.createElement("p");
            eyebrow.className = "eyebrow menu-eyebrow";
            eyebrow.textContent = "";
            eyebrow.dataset.fulltext = "Настольная игра, которая сыграла в ответ";

            const logo = document.createElement("img");
            logo.src = "assets/images/logo.png";
            logo.alt = "ТуКо и ТаКу";
            logo.className = "menu-logo";

            const buttons = document.createElement("div");
            buttons.className = "button-row";
            const newGameButton = game.mechanics.createButton("НАЧАТЬ ПАРТИЮ", "gold-button");
            context.on(newGameButton, "click", function () {
                game.audio.unlock();
                startNewGame();
            });

            buttons.appendChild(newGameButton);

            copy.appendChild(eyebrow);
            copy.appendChild(logo);
            copy.appendChild(buttons);

            content.appendChild(copy);
            screen.appendChild(content);
            root.appendChild(screen);
            // ---- КОНЕЦ СОЗДАНИЯ ----

            // ---- ЗВУКИ ----
            let ambienceStarted = false;

            let typeSound = null;
            try {
                typeSound = new Audio("assets/audio/typewriter.ogg");
                typeSound.volume = 0.3;
                typeSound.loop = false;
            } catch (e) {}

            const fullText = eyebrow.dataset.fulltext;
            let index = 0;

            function typeChar() {
                if (index < fullText.length) {
                    const char = fullText.charAt(index);
                    eyebrow.textContent += char;
                    index++;

                    if (index === 1 && typeSound) {
                        typeSound.currentTime = 0;
                        typeSound.play().catch(() => {});
                    }

                    const delay = 40 + Math.random() * 60;
                    context.timeout(typeChar, delay);
                } else {
                    ambienceStarted = true;
                    tryPlayAmbience();
                }
            }

            function tryPlayAmbience() {
                if (ambienceStarted && !window._tukoAmbienceStarted) {
                    game.audio.unlock();
                    game.audio.playLoop('ambience', 'assets/audio/a6f8b896323e584.mp3');
                    window._tukoAmbienceStarted = true;
                }
            }

            // Первый клик по экрану для разблокировки аудио и запуска фонового звука
            context.on(screen, 'pointerdown', function() {
                game.audio.unlock();
                tryPlayAmbience();
            }, { once: true });

            // ---- АНИМАЦИЯ ПОЯВЛЕНИЯ ----
            context.timeout(function () {
                screen.classList.add("is-ready");
                context.timeout(typeChar, 500);
            }, 60);

            newGameButton.focus();
        },

        unmount: function () {}
    };

    function init() {
        const root = document.getElementById("game-root");
        game.engine.init(root);
        game.engine.registerScene(menuScene);
        game.engine.registerScenes(game.scenes || {});
        exposeDebugControls();
        game.save.loadSettings();
        document.documentElement.style.setProperty(
            "--subtitle-scale",
            game.state.get().settings.subtitleScale
        );

        root.addEventListener("pointerdown", function unlockAudioOnce() {
            game.audio.unlock();
        }, { once: true });

        const debugQuery = getDebugQuery();
        const debugScene = resolveDebugScene(debugQuery.sceneId);

        if (debugScene) {
            const debugPreset =
                debugQuery.presetName ||
                {
                    board_roll_spaceport: "spaceport_open",
                    board_roll_arena: "arena_open",
                    board_roll_casino: "casino_open"
                }[debugScene];

            applyDebugPreset(debugPreset);
        }

        showBootScreen(function () {
            game.engine.goTo(debugScene || "menu", {
                updateState: false,
                save: false
            });

            if (debugScene) {
                console.info(
                    "DEBUG: прямой запуск сцены",
                    debugScene,
                    debugQuery.presetName ? "preset=" + debugQuery.presetName : ""
                );
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})(window);
