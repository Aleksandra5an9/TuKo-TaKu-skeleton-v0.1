(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    const registry = new Map();
    let gameRoot = null;
    let currentScene = null;
    let cleanupTasks = new Set();
    let transitionId = 0;

    function getNextChapter(sceneId) {
        const chapters = game.config.chapterOrder || [];

        if (!chapters.length) {
            return null;
        }

        // Пролог и центральное поле → первая глава
        if (
            sceneId.indexOf("prologue_") === 0 ||
            sceneId.indexOf("board_") === 0 ||
            sceneId.indexOf("handover_") === 0
        ) {
            return chapters[0].id;
        }

        const currentIndex = chapters.findIndex(function (chapter) {
            return sceneId.indexOf(chapter.id) === 0;
        });

        if (currentIndex === -1) {
            return null;
        }

        const nextChapter = chapters[currentIndex + 1];

        return nextChapter ? nextChapter.id : null;
    }

    function preloadNextChapter(sceneId) {
        if (!game.preloader) {
            return;
        }

        const nextChapter = getNextChapter(sceneId);

        if (!nextChapter) {
            return;
        }

        game.preloader.loadChapter(nextChapter);
    }

    async function runCleanup() {
        game.ui.hideSubtitle();
        game.ui.closeOverlay();

        if (currentScene && typeof currentScene.unmount === "function") {
            try {
                await currentScene.unmount();
            } catch (error) {
                console.warn("Ошибка очистки сцены:", error);
            }
        }

        cleanupTasks.forEach(function (cleanup) {
            try {
                cleanup();
            } catch (error) {
                console.warn("Ошибка общей очистки:", error);
            }
        });

        cleanupTasks.clear();
        game.audio.stop("voice");
        document.body.removeAttribute("data-scene");

        if (gameRoot) {
            gameRoot.innerHTML = "";
            gameRoot.removeAttribute("class");
        }
    }

    function createContext(sceneId) {
        return {
            sceneId: sceneId,
            state: game.state.get(),
            config: game.config,

            registerCleanup: function (cleanup) {
                cleanupTasks.add(cleanup);
                return cleanup;
            },

            on: function (target, eventName, handler, options) {
                target.addEventListener(eventName, handler, options);
                const cleanup = function () {
                    target.removeEventListener(eventName, handler, options);
                };
                cleanupTasks.add(cleanup);
                return cleanup;
            },

            timeout: function (handler, delay) {
                const id = global.setTimeout(handler, delay);
                cleanupTasks.add(function () {
                    global.clearTimeout(id);
                });
                return id;
            },

            interval: function (handler, delay) {
                const id = global.setInterval(handler, delay);
                cleanupTasks.add(function () {
                    global.clearInterval(id);
                });
                return id;
            },

            animationFrame: function (handler) {
                const id = global.requestAnimationFrame(handler);
                cleanupTasks.add(function () {
                    global.cancelAnimationFrame(id);
                });
                return id;
            },

            goTo: function (nextSceneId, options) {
                return game.engine.goTo(nextSceneId, options);
            }
        };
    }

    function renderFatalError(error) {
        gameRoot.innerHTML = "";
        const screen = document.createElement("section");
        screen.className = "screen handover-screen";
        const card = document.createElement("div");
        card.className = "handover-card panel";
        card.innerHTML = "<p class=\"eyebrow\">ОШИБКА СЦЕНЫ</p><h1>Игра споткнулась</h1><p>Закройте окно и запустите игру снова. Сохранение останется на месте.</p>";
        const button = game.mechanics.createButton("В ГЛАВНОЕ МЕНЮ", "gold-button", function () {
            game.engine.goTo("menu", { updateState: false, save: false });
        });
        card.appendChild(button);
        screen.appendChild(card);
        gameRoot.appendChild(screen);
        console.error(error);
    }

    game.engine = {
        init: function (rootElement) {
            gameRoot = rootElement;
        },

        registerScene: function (scene) {
            if (!scene || !scene.id || typeof scene.mount !== "function") {
                throw new Error("Сцена должна иметь id и mount().");
            }

            registry.set(scene.id, scene);
        },

        registerScenes: function (scenes) {
            Object.keys(scenes).forEach(function (key) {
                if (scenes[key] && scenes[key].id) {
                    game.engine.registerScene(scenes[key]);
                }
            });
        },

        hasScene: function (sceneId) {
            return registry.has(sceneId);
        },

        getCurrentSceneId: function () {
            return currentScene ? currentScene.id : null;
        },

        goTo: async function (sceneId, options) {
            const settings = options || {};
            const scene = registry.get(sceneId);
            const thisTransition = ++transitionId;

            if (!scene) {
                if (sceneId === "handover_tuko_1" || sceneId === "board_roll_tavern") {
                    return game.engine.goTo("board_intro", {
                        updateState: false,
                        save: false
                    });
                }

                renderFatalError(new Error("Сцена не зарегистрирована: " + sceneId));
                return false;
            }

            await runCleanup();

            if (thisTransition !== transitionId) {
                return false;
            }

            currentScene = scene;
            document.body.dataset.scene = sceneId;

            if (settings.updateState !== false) {
                game.state.setScene(sceneId, settings.checkpointId || sceneId);
            }

            
            try {
                // Ждём подготовки ресурсов целевой сцены.
                if (
                    game.preloader &&
                    typeof game.preloader.ensureChapterLoaded === "function"
                ) {
                    await game.preloader.ensureChapterLoaded(sceneId);
                }

                // Если за время загрузки запросили другую сцену,
                // не запускаем устаревший переход.
                if (thisTransition !== transitionId) {
                    return false;
                }

                // Запускаем сцену только после подготовки ресурсов.
                await scene.mount(gameRoot, createContext(sceneId));

                if (settings.save) {
                    game.save.write(settings.saveReason || sceneId);
                }

                // Следующая глава загружается в фоне.
                preloadNextChapter(sceneId);

                return true;
            } catch (error) {
                renderFatalError(error);
                return false;
            }

        },

        destroy: async function () {
            await runCleanup();
            currentScene = null;
        }
    };
})(window);
