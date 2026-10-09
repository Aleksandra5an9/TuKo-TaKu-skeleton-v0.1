(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    game.scenes = game.scenes || {};

    const worlds = [
        { id: "tavern", className: "node-tavern", title: "Таверна", player: "ТуКо" },
        { id: "spaceport", className: "node-spaceport", title: "Космопорт", player: "ТаКу" },
        { id: "casino", className: "node-casino", title: "Казино", player: "ТаКу" },
        { id: "arena", className: "node-arena", title: "Арена", player: "ТуКо" }
    ];

    function playVoiceAndWait(path) {
        return new Promise(function (resolve) {
            const audio = game.audio.playVoice(path);

            if (!audio) {
                resolve();
                return;
            }

            function finish() {
                audio.removeEventListener("ended", finish);
                audio.removeEventListener("error", finish);
                resolve();
            }

            audio.addEventListener("ended", finish);
            audio.addEventListener("error", finish);

            // Если звук ещё заблокирован браузером,
            // не зависаем навсегда.
            if (!game.audio.isUnlocked()) {
                resolve();
            }
        });
    }

    function createWorldNode(world) {
        const node = document.createElement("div");
        node.className = "world-node " + world.className;
        node.dataset.world = world.id;
        node.innerHTML =
            "<span class=\"world-node-status\">ЗАКРЫТ</span>" +
            "<strong>" + world.title + "</strong>" +
            "<small>ГЛАВНЫЙ ИГРОК · " + world.player + "</small>";
        return node;
    }

    function createBoard(options, context) {
        const settings = options || {};
        const screen = document.createElement("section");
        screen.className = "screen board-screen " + (settings.screenClass || "");

        if (settings.worldsVisible) {
            screen.classList.add("board-worlds-visible");
        }

        const content = document.createElement("div");
        content.className = "screen-content board-content";

        const stage = document.createElement("div");
        stage.className = "board-stage";

        const atmosphere = document.createElement("div");
        atmosphere.className = "board-atmosphere";
        atmosphere.setAttribute("aria-hidden", "true");

        const caption = document.createElement("article");
        caption.className = "board-caption panel";
        caption.innerHTML =
            "<p class=\"eyebrow\">" + (settings.eyebrow || "ЦЕНТРАЛЬНЫЙ СТОЛ") + "</p>" +
            "<h1>" + settings.title + "</h1>" +
            "<p class=\"board-caption-text\">" + settings.text + "</p>";

        const actions = document.createElement("div");
        actions.className = "board-actions button-row";
        const actionButton = game.mechanics.createButton(settings.buttonLabel, "gold-button");
        actionButton.disabled = Boolean(settings.buttonDisabled);
        context.on(actionButton, "click", settings.onAction);
        actions.appendChild(actionButton);
        caption.appendChild(actions);

        const center = document.createElement("div");
        center.className = "board-center";
        center.innerHTML = "<span></span>" + "<small></small>";

        const balanceSeal = game.mechanics.createImage(
            "assets/images/seal_balance.png",
            "board-seal board-seal-balance",
            "Печать Равновесия"
        );
        balanceSeal.setAttribute("aria-hidden", "true");

        const navigationSeal = game.mechanics.createImage(
            "assets/images/seal_navigation.png",
            "board-seal-navigation",
            "Печать Навигации"
        );
        navigationSeal.setAttribute("aria-hidden", "true");

        const nodes = {};
        worlds.forEach(function (world) {
            nodes[world.id] = createWorldNode(world);
            stage.appendChild(nodes[world.id]);
        });

        const tukoPiece = game.mechanics.createImage(
            game.config.players.tuko.image,
            "board-piece board-piece-tuko",
            "Фигурка ТуКо"
        );
        const takuPiece = game.mechanics.createImage(
            game.config.players.taku.image,
            "board-piece board-piece-taku",
            "Фигурка ТаКу"
        );
        const stitchPiece = game.mechanics.createImage(
            game.config.images.stitch,
            "board-piece board-piece-stitch",
            "Стич"
        );

        stage.append(
            atmosphere,
            center,
            balanceSeal,
            navigationSeal,
            tukoPiece,
            takuPiece,
            stitchPiece,
            caption
        );

        content.appendChild(stage);
        screen.append(
            game.ui.createHud(context, {
                title: false,
                showPlayer: false
            }),
            content
        );

        applyBoardSeals({
            screen: screen,
            center: center
        });

        return {
            screen: screen,
            stage: stage,
            caption: caption,
            captionText: caption.querySelector(".board-caption-text"),
            button: actionButton,
            center: center,
            navigationSeal: navigationSeal,
            nodes: nodes,
            pieces: {
                tuko: tukoPiece,
                taku: takuPiece,
                stitch: stitchPiece
            }
        };
    }

    function countSeals() {
        const seals = game.state.get().seals;
        return Object.keys(seals).reduce(function (total, key) {
            return total + (seals[key] ? 1 : 0);
        }, 0);
    }

    function updateSealCount(board) {
        board.center.querySelector("small").textContent =
            "ПЕЧАТИ · " + countSeals() + " ИЗ 4";
    }

    function applyBoardSeals(board) {
        const state = game.state.get();
        const seals = state.seals || {};

        const hasBalanceSeal = Boolean(seals.balance);
        const hasNavigationSeal = Boolean(seals.navigation);

        board.screen.classList.toggle(
            "board-seal-reveal",
            hasBalanceSeal
        );

        const navigationSeal = board.screen.querySelector(
            ".board-seal-navigation"
        );

        if (hasNavigationSeal && navigationSeal) {
            /*
            * Печать уже получена.
            * Не даём CSS заново применять стартовое
            * положение/поворот.
            */
            navigationSeal.style.transition = "none";
            navigationSeal.style.opacity = "1";
            navigationSeal.style.transform =
                "translate(50%, 0) scale(1) rotate(0deg)";
        }

        board.screen.classList.toggle(
            "board-navigation-seal-reveal",
            hasNavigationSeal
        );

        updateSealCount(board);
    }

    function markTavernOpen(board) {
        board.screen.classList.add("board-tavern-open", "board-tuko-moved");
        board.nodes.tavern.classList.add("is-active", "is-revealed");
        board.nodes.tavern.querySelector(".world-node-status").textContent = "ОТКРЫТ";
        updateSealCount(board);
    }

    function markTavernComplete(board) {
        board.screen.classList.add(
            "board-tavern-open",
            "board-tavern-complete",
            "board-tuko-moved"
        );
        board.nodes.tavern.classList.add("is-active", "is-complete", "is-revealed");
        board.nodes.tavern.querySelector(".world-node-status").textContent = "ПРОЙДЕНО";
        updateSealCount(board);
    }

    function markSpaceportOpen(board) {
        markTavernComplete(board);
        board.screen.classList.add("board-spaceport-open", "board-taku-moved");
        board.nodes.spaceport.classList.add("is-active", "is-revealed");
        board.nodes.spaceport.querySelector(".world-node-status").textContent = "ОТКРЫТ";
        updateSealCount(board);
    }


    function markSpaceportComplete(board) {
        markTavernComplete(board);
        board.screen.classList.add(
            "board-spaceport-open",
            "board-spaceport-complete",
            "board-taku-moved"
        );
        board.nodes.spaceport.classList.remove("is-active");
        board.nodes.spaceport.classList.add("is-complete", "is-revealed");
        board.nodes.spaceport.querySelector(".world-node-status").textContent = "ПРОЙДЕНО";
        updateSealCount(board);
    }

    function markArenaOpen(board) {
        markSpaceportComplete(board);
        board.screen.classList.add("board-arena-open", "board-tuko-arena");
        board.nodes.arena.classList.add("is-active", "is-revealed");
        board.nodes.arena.querySelector(".world-node-status").textContent = "ОТКРЫТ";
        updateSealCount(board);
    }

    function markArenaComplete(board) {
        markSpaceportComplete(board);
        board.screen.classList.add(
            "board-arena-open",
            "board-arena-complete",
            "board-tuko-arena",
            "board-tuko-center"
        );
        board.nodes.arena.classList.remove("is-active");
        board.nodes.arena.classList.add("is-complete", "is-revealed");
        board.nodes.arena.querySelector(".world-node-status").textContent = "ПРОЙДЕНО";
        board.nodes.tavern.classList.remove("is-active");
        board.nodes.spaceport.classList.remove("is-active");
        updateSealCount(board);
    }

    function markCasinoOpen(board) {
        markArenaComplete(board);
        board.screen.classList.add("board-casino-open", "board-taku-casino");
        board.nodes.casino.classList.add("is-active", "is-revealed");
        board.nodes.casino.querySelector(".world-node-status").textContent = "ОТКРЫТ";
        updateSealCount(board);
    }

    function markCasinoComplete(board) {
        markArenaComplete(board);
        board.screen.classList.add(
            "board-casino-open",
            "board-casino-complete",
            "board-taku-casino",
            "board-taku-center"
        );
        board.nodes.casino.classList.remove("is-active");
        board.nodes.casino.classList.add("is-complete", "is-revealed");
        board.nodes.casino.querySelector(".world-node-status").textContent = "ПРОЙДЕНО";
        board.nodes.arena.classList.remove("is-active");
        updateSealCount(board);
    }

    game.scenes.board_intro = {
        id: "board_intro",

        mount: function (root, context) {
            game.audio.unlock();

            const screen = document.createElement("section");
            screen.className = "screen board-screen board-intro-screen";

            const stage = document.createElement("div");
            stage.className = "board-stage";

            const tukoPiece = game.mechanics.createImage(
                game.config.players.tuko.image,
                "board-piece board-piece-tuko",
                "Фигурка ТуКо"
            );

            const takuPiece = game.mechanics.createImage(
                game.config.players.taku.image,
                "board-piece board-piece-taku",
                "Фигурка ТаКу"
            );

            const stitchPiece = game.mechanics.createImage(
                game.config.images.stitch,
                "board-piece board-piece-stitch",
                "Стич"
            );

            stage.append(tukoPiece, takuPiece, stitchPiece);
            screen.append(stage);
            root.appendChild(screen);

            context.timeout(function () {
                screen.classList.add("board-ready");
            }, 60);

            function wait(ms) {
                return new Promise(function (resolve) {
                    context.timeout(resolve, ms);
                });
            }

            function playVoiceAndWait(path, speakingPiece) {
                return new Promise(function (resolve) {
                    const audio = game.audio.playVoice(path);

                    if (!audio) {
                        resolve();
                        return;
                    }

                    if (speakingPiece) {
                        speakingPiece.classList.add("is-speaking");
                    }

                    function finish() {
                        if (speakingPiece) {
                            speakingPiece.classList.remove("is-speaking");
                        }

                        audio.removeEventListener("ended", finish);
                        audio.removeEventListener("error", finish);
                        resolve();
                    }

                    audio.addEventListener("ended", finish);
                    audio.addEventListener("error", finish);
                });
            }

            function createRulesScreen() {
                const rules = document.createElement("div");
                rules.className = "board-intro-rules";

                rules.style.cssText = `
                    position: absolute;
                    z-index: 20;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: min(620px, 82vw);
                    padding: 38px 48px 34px;
                    box-sizing: border-box;
                    text-align: center;
                    background: rgba(8, 10, 20, 0.94);
                    border: 1px solid rgba(216, 168, 62, 0.75);
                    border-radius: 14px;
                    box-shadow:
                        0 0 0 1px rgba(216, 168, 62, 0.12),
                        0 20px 70px rgba(0, 0, 0, 0.65),
                        inset 0 0 40px rgba(216, 168, 62, 0.04);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `;

                rules.innerHTML =
                    "<p style=\"" +
                        "margin:0 0 12px;" +
                        "font-size:12px;" +
                        "letter-spacing:4px;" +
                        "color:#d8a83e;" +
                    "\">ПРАВИЛА ИГРЫ</p>" +

                    "<div style=\"" +
                        "font-size:20px;" +
                        "line-height:1.8;" +
                        "letter-spacing:3px;" +
                        "color:#fff;" +
                        "font-weight:600;" +
                        "margin-bottom:22px;" +
                    "\">" +
                        "ЧЕТЫРЕ МИРА<br>" +
                        "ЧЕТЫРЕ ПЕЧАТИ.<br>" +
                        "ОДИН ПУТЬ ОБРАТНО." +
                    "</div>" +

                    "<p style=\"" +
                        "margin:0 auto 28px;" +
                        "max-width:480px;" +
                        "font-size:15px;" +
                        "line-height:1.7;" +
                        "color:rgba(255,255,255,0.72);" +
                    "\">" +
                        "Каждый пройденный мир открывает одну печать.<br>" +
                        "Соберите все четыре, чтобы открыть путь к центру." +
                    "</p>";

                const button = game.mechanics.createButton(
                    "ПРОДОЛЖИТЬ",
                    "gold-button"
                );

                rules.appendChild(button);
                screen.appendChild(rules);

                return {
                    element: rules,
                    button: button
                };
            }

            function createDiceScreen() {
                const diceWrap = document.createElement("div");

                diceWrap.className = "board-intro-dice";

                diceWrap.style.cssText = `
                    position: absolute;
                    z-index: 20;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                `;

                

                const dice = game.mechanics.createImage(
                    "assets/images/dice.png",
                    "board-die-image",
                    "Магическая кость"
                );

                dice.style.cssText = `
                    width: 150px;
                    height: 150px;
                    object-fit: contain;
                    border: none;
                    outline: none;
                    box-shadow: none;
                    background: transparent;
                    margin-bottom: 24px;
                    cursor: pointer;
                `;

                const button = game.mechanics.createButton(
                    "БРОСИТЬ КОСТЬ",
                    "gold-button"
                );

                diceWrap.append(dice, button);
                screen.appendChild(diceWrap);

                return {
                    element: diceWrap,
                    dice: dice,
                    button: button
                };
            }

            async function startDialogue() {
                await wait(1000);

                await playVoiceAndWait("assets/audio/host_1.mp3");

                await wait(1300);

                await playVoiceAndWait(
                    "assets/audio/Tuko_1.mp3",
                    tukoPiece
                );

                await wait(1500);

                await playVoiceAndWait("assets/audio/host_2.mp3");

                await wait(1500);

                await playVoiceAndWait("assets/audio/host_3.mp3");

                await wait(1500);

                await playVoiceAndWait(
                    "assets/audio/Taku_1.mp3",
                    takuPiece
                );

                await wait(1200);

                await playVoiceAndWait("assets/audio/host_4.mp3");

                await wait(1200);

                const rules = createRulesScreen();

                requestAnimationFrame(function () {
                    rules.element.style.opacity = "1";
                });

                context.on(rules.button, "click", async function () {
                    rules.button.disabled = true;

                    rules.element.style.opacity = "0";

                    await wait(500);

                    rules.element.remove();

                    await playVoiceAndWait("assets/audio/host_5.mp3");

                    await wait(1000);

                    await playVoiceAndWait(
                        "assets/audio/Tuko_2.mp3",
                        tukoPiece
                    );

                    await wait(1200);

                    await playVoiceAndWait("assets/audio/host_6.mp3");

                    await wait(1100);

                    await playVoiceAndWait("assets/audio/host_7.mp3");

                    await wait(1000);

                    await playVoiceAndWait("assets/audio/host_8.mp3");

                    await wait(1000);

                    const diceScreen = createDiceScreen();

                    /* Рамка передачи мыши */
                    const handover = document.createElement("div");
                    handover.className = "board-handover";

                    handover.innerHTML =
                        "<div class=\"board-handover-label\">ПЕРЕДАЙТЕ МЫШЬ</div>" +
                        "<div class=\"board-handover-title\">ПЕРВЫЙ ХОД</div>" +
                        "<div class=\"board-handover-player\">Главный игрок — ТуКо</div>" +
                        "<div class=\"board-handover-text\">" +
                            "Первый мир принадлежит ТуКо.<br>" +
                            "ТаКу пока может давать исключительно непрошеные советы." +
                        "</div>";

                    diceScreen.element.appendChild(handover);

                    requestAnimationFrame(function () {
                        handover.classList.add("is-visible");
                    });

                    /* Кнопка броска остаётся внизу */
                    diceScreen.button.textContent = "БРОСИТЬ КОСТЬ";

                    let dicePhase = "waiting";
                    let result = null;

                    context.on(diceScreen.button, "click", function () {

                        if (dicePhase === "waiting") {
                            dicePhase = "rolling";

                            diceScreen.button.disabled = true;
                            diceScreen.button.textContent = "БРОСОК…";

                            diceScreen.dice.classList.add("is-rolling");

                            context.timeout(function () {
                                diceScreen.dice.classList.remove("is-rolling");

                                dicePhase = "ready";

                                result = document.createElement("div");
                                result.className = "board-dice-result";

                                result.innerHTML =
                                    "<div class=\"board-dice-result-number\">ВЫПАЛО ТРИ</div>" +
                                    "<div class=\"board-dice-result-text\">" +
                                        "ТУКО ОТПРАВЛЯЕТСЯ В ТАВЕРНУ" +
                                    "</div>";

                                diceScreen.element.appendChild(result);

                                requestAnimationFrame(function () {
                                    result.classList.add("is-visible");
                                });

                                handover.classList.add("is-hidden");

                                context.timeout(function () {
                                    handover.remove();
                                }, 600);

                                diceScreen.button.textContent = "Я ГОТОВА";
                                diceScreen.button.disabled = false;

                                game.state.patch({
                                    pathSteps: {
                                        tuko: 3,
                                        taku: game.state.get().pathSteps.taku
                                    }
                                });

                            }, 1200);

                            return;
                        }

                        if (dicePhase === "ready") {
                            dicePhase = "moving";

                            diceScreen.button.disabled = true;
                            diceScreen.button.textContent = "ТУКО ИДЁТ…";

                            if (result) {
                                result.remove();
                            }

                            diceScreen.button.remove();

                            diceScreen.element.style.pointerEvents = "none";

                            const stage = screen.querySelector(".board-stage");

                            if (stage) {
                                const scaleX = stage.clientWidth / 1920;
                                const scaleY = stage.clientHeight / 1080;

                                screen.style.setProperty("--tuko-move-x-70", (-220 * scaleX) + "px");
                                screen.style.setProperty("--tuko-move-y-70", (-300 * scaleY) + "px");
                                screen.style.setProperty("--tuko-move-x-100", (-300 * scaleX) + "px");
                                screen.style.setProperty("--tuko-move-y-100", (-580 * scaleY) + "px");
                            }

                            tukoPiece.classList.add("board-piece-go-tavern");
                            game.audio.playVoice("assets/audio/board_piece_move.mp3");

                            context.timeout(function () {

                                const tavernIntro = document.createElement("div");
                                tavernIntro.className = "tavern-entry-overlay";

                                const tavernTitle = document.createElement("div");
                                tavernTitle.className = "tavern-entry-title";
                                tavernTitle.innerHTML = "Таверна между<br>Мирами";

                                tavernIntro.appendChild(tavernTitle);
                                screen.appendChild(tavernIntro);

                                requestAnimationFrame(function () {
                                    tavernIntro.classList.add("is-dark");
                                });

                                context.timeout(function () {
                                    tavernIntro.classList.add("is-title-visible");
                                }, 1200);

                                context.timeout(function () {
                                    tavernIntro.classList.add("is-green");
                                }, 3000);

                                context.timeout(function () {
                                    game.audio.stop("voice");

                                    context.goTo("tavern_arrival", {
                                        checkpointId: "tavern_arrival",
                                        save: false
                                    });

                                }, 4500);

                            }, 5600);
                        }
                    });

                    diceScreen.button.focus();
                });
            }

            startDialogue();
        },

        unmount: function () {}
    };

    game.scenes.board_after_tavern = {
        id: "board_after_tavern",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "tuko" });

            let pixieReleased = false;

            const board = createBoard({
                title: "",
                text: "",
                buttonLabel: "",
                buttonDisabled: true,
                showPlayer: false,
                worldsVisible: false,
                screenClass: "board-after-tavern-screen",
                onAction: function () {}
            }, context);

            board.caption.remove();
            board.screen.classList.add("board-tavern-open","board-tavern-complete");
            board.nodes.tavern.classList.add(
                "is-active",
                "is-complete",
                "is-revealed"
            );
            board.nodes.tavern.querySelector(".world-node-status").textContent = "ПРОЙДЕНО";
            updateSealCount(board);

            const stage = board.stage;

            const pixieButton = document.createElement("button");
            pixieButton.type = "button";
            pixieButton.className = "board-pixie-event";
            pixieButton.setAttribute(
                "aria-label",
                "Отпустить пикси с каблука ТуКо"
            );
            pixieButton.title = "Отпустить пикси";

            const pixieImage = game.mechanics.createImage(
                game.config.images.pixie,
                "board-pixie-image",
                "Пикси"
            );

            const pixieFallback = document.createElement("span");
            pixieFallback.className = "board-pixie-fallback";
            pixieFallback.setAttribute("aria-hidden", "true");

            pixieImage.addEventListener("error", function () {
                pixieButton.classList.add("use-pixie-fallback");
            }, { once: true });

            pixieButton.append(pixieImage, pixieFallback);
            stage.appendChild(pixieButton);

            root.appendChild(board.screen);

            const scaleX = stage.clientWidth / 1920;
            const scaleY = stage.clientHeight / 1080;

            board.screen.style.setProperty("--tuko-return-x",(-300 * scaleX) + "px");
            board.screen.style.setProperty("--tuko-return-y",(-580 * scaleY) + "px");
            board.screen.classList.add("board-tuko-returned");

            board.screen.style.setProperty(
                "--taku-spaceport-x",
                (300 * scaleX) + "px"
            );

            board.screen.style.setProperty(
                "--taku-spaceport-y",
                (-580 * scaleY) + "px"
            );

            board.screen.classList.add("board-taku-spaceport-position");

            function revealSeal() {
                game.state.patch({
                    seals: {
                        balance: true
                    }
                });

                board.screen.classList.add("board-seal-reveal");

                game.audio.playVoice("assets/audio/seal_reveal.mp3");
            }

            async function startScene() {
                board.screen.classList.add("board-ready", "board-pixie-ready");
                pixieButton.disabled = true;

                await new Promise(function (resolve) {
                    context.timeout(resolve, 1000);
                });
                await playVoiceAndWait("assets/audio/host_9.mp3");

                pixieButton.disabled = false;
                pixieButton.focus();
            }

            context.on(pixieButton, "click", async function () {
                if (pixieReleased) {
                    return;
                }
                pixieReleased = true;
                pixieButton.disabled = true;

                game.audio.playVoice("assets/audio/pixie_fly.mp3");

                board.screen.classList.add("board-pixie-released");

                // Ждём, пока Пикси полностью улетит
                await new Promise(function (resolve) {
                    context.timeout(resolve, 3000);
                });

                // Появление Печати + звук
                revealSeal();

                // Даём Печати немного побыть на экране
                await new Promise(function (resolve) {
                    context.timeout(resolve, 3000);
                });

                // Ведущий говорит и ОБЯЗАТЕЛЬНО заканчивает речь
                await playVoiceAndWait("assets/audio/host_10.mp3");

                // Небольшая пауза после реплики
                await new Promise(function (resolve) {
                    context.timeout(resolve, 2000);
                });

                // Только теперь передаём ход ТаКу
                context.goTo("handover_taku_1", {
                    checkpointId: "handover_taku_1",
                    save: true,
                    saveReason: "ход передан ТаКу после Таверны"
                });
            });

            startScene();
        },

        unmount: function () {}
    };

    game.scenes.handover_taku_1 = {
        id: "handover_taku_1",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            const screen = document.createElement("section");
            screen.className = "screen handover-screen board-handover-screen";

            const card = document.createElement("article");
            card.className = "handover-card panel handover-card-taku";

            const avatarWrap = document.createElement("div");
            avatarWrap.className = "handover-avatar-wrap";
            avatarWrap.appendChild(
                game.mechanics.createImage(
                    game.config.players.taku.image,
                    "handover-avatar",
                    "ТаКу"
                )
            );

            const copy = document.createElement("div");
            copy.className = "handover-copy";
            copy.innerHTML =
                "<p class=\"eyebrow\">ПЕРЕДАЙТЕ МЫШЬ ТАКУ</p>" +
                "<span class=\"handover-turn\">СЛЕДУЮЩИЙ ХОД</span>" +
                "<h1>Главный игрок — ТаКу</h1>" +
                "<p>Теперь мышь переходит ТаКу. ТуКо может подсказывать, комментировать и делать вид, что вообще не нервничает.</p>";

            const readyButton = game.mechanics.createButton("Я ГОТОВА", "gold-button");
            context.on(readyButton, "click", function () {
                context.goTo("board_roll_spaceport", {
                    checkpointId: "board_roll_spaceport",
                    save: true,
                    saveReason: "первый бросок ТаКу"
                });
            });

            copy.appendChild(readyButton);
            card.append(avatarWrap, copy);
            screen.append(
                game.ui.createHud(context, { title: "Передача хода", showPlayer: false }),
                card
            );
            root.appendChild(screen);

            context.timeout(function () {
                screen.classList.add("handover-ready");
            }, 60);

            game.ui.showSubtitle("Главный игрок — ТаКу. Передайте мышь Рите.");
            readyButton.focus();
        },

        unmount: function () {}
    };

    game.scenes.board_roll_spaceport = {
        id: "board_roll_spaceport",

        mount: function (root, context) {
            let phase = game.state.get().pathSteps.taku >= 3 ? "open" : "waiting";
            let board;

            function handleAction() {
                if (phase === "open") {
                    context.goTo("spaceport_intro", {
                        checkpointId: "spaceport_intro",
                        save: true,
                        saveReason: "вход в Порт Нулевой Орбиты"
                    });
                    return;
                }

                if (phase !== "waiting") {
                    return;
                }

                phase = "rolling";
                game.audio.unlock();

                board.button.disabled = true;
                board.button.textContent = "КОСТЬ РЕШАЕТ…";

                board.die.classList.add("is-rolling");

                context.timeout(function () {
                    phase = "open";

                    board.die.classList.remove("is-rolling");

                    board.die.src = "assets/images/dice.png";
                    board.die.setAttribute(
                        "aria-label",
                        "На кости выпало три"
                    );

                    board.button.disabled = false;
                    board.button.textContent = "СЛЕДУЮЩАЯ ГЛАВА — КОСМОПОРТ";

                    game.state.patch({
                        pathSteps: {
                            tuko: game.state.get().pathSteps.tuko,
                            taku: 3
                        }
                    });

                    board.screen.classList.add("board-taku-going-spaceport");
                    const scaleX = board.stage.clientWidth / 1920;
                    const scaleY = board.stage.clientHeight / 1080;
                    board.screen.style.setProperty(
                        "--taku-move-x-70",
                        (220 * scaleX) + "px"
                    );

                    board.screen.style.setProperty(
                        "--taku-move-y-70",
                        (-300 * scaleY) + "px"
                    );

                    board.screen.style.setProperty(
                        "--taku-move-x-100",
                        (300 * scaleX) + "px"
                    );

                    board.screen.style.setProperty(
                        "--taku-move-y-100",
                        (-580 * scaleY) + "px"
                    );
                    board.pieces.taku.classList.add("board-piece-go-spaceport");
                    game.audio.playVoice("assets/audio/board_piece_move.mp3");
                    
                    context.timeout(function () {

                   board.pieces.taku.classList.remove("board-piece-go-spaceport");

                    board.screen.classList.add("board-spaceport-open","board-taku-moved");

                    board.nodes.spaceport.classList.add("is-active","is-revealed");

                    board.nodes.spaceport.querySelector(".world-node-status").textContent = "ОТКРЫТ";

                    updateSealCount(board);

                    board.screen.classList.remove("board-taku-moved");

                    const finalScaleX = board.stage.clientWidth / 1920;
                    const finalScaleY = board.stage.clientHeight / 1080;

                    board.pieces.taku.style.transform =
                        "translate(" +
                        (300 * finalScaleX) +
                        "px, " +
                        (-580 * finalScaleY) +
                        "px) scale(0.65)";

                    board.button.disabled = false;
                    board.button.textContent = "СЛЕДУЮЩАЯ ГЛАВА — КОСМОПОРТ";

                    game.save.write("первый бросок ТаКу: выпало три");
                    game.ui.showSubtitle("Выпало три. ТаКу отправляется в Космопорт.");

                }, 5600);
                }, 1100);
            }

            board = createBoard({
                eyebrow: "",
                title: "",
                text: "",
                buttonLabel: phase === "open"
                    ? "СЛЕДУЮЩАЯ ГЛАВА — КОСМОПОРТ"
                    : "БРОСИТЬ КОСТЬ",
                buttonDisabled: phase === "waiting",
                showPlayer: false,
                worldsVisible: true,
                screenClass: "board-roll-screen board-roll-spaceport-screen",
                onAction: handleAction
            }, context);

            /* Убираем весь caption, но сохраняем кнопку */
            const actions = board.caption.querySelector(".board-actions");
            board.caption.remove();
            board.stage.appendChild(actions);
            actions.style.transform = "translateY(380px)";

            const die = game.mechanics.createImage(
                "assets/images/dice.png",
                "board-die board-die-image-only",
                phase === "open"
                    ? "На кости выпало три"
                    : "Магическая кость ещё не брошена"
            );

            board.die = die;
            board.stage.appendChild(die);
            die.style.position = "absolute";
            die.style.left = "50%";
            die.style.top = "50%";
            die.style.width = "150px";
            die.style.height = "130px";
            die.style.transform = "translate(-50%, -50%)";

            if (phase === "open") {
                markSpaceportOpen(board);
            } else {
                board.screen.classList.add(
                    "board-tavern-open",
                    "board-tavern-complete"
                );

                board.nodes.tavern.classList.add(
                    "is-active",
                    "is-complete",
                    "is-revealed"
                );

                board.nodes.tavern.querySelector(".world-node-status").textContent =
                    "ПРОЙДЕНО";

                updateSealCount(board);
            }

            root.appendChild(board.screen);

            const scaleX = board.stage.clientWidth / 1920;
            const scaleY = board.stage.clientHeight / 1080;

            board.screen.style.setProperty(
                "--tuko-return-x",
                (-300 * scaleX) + "px"
            );

            board.screen.style.setProperty(
                "--tuko-return-y",
                (-580 * scaleY) + "px"
            );

            board.screen.classList.add("board-tuko-returned");

            context.timeout(function () {
                board.screen.classList.add("board-ready");
            }, 60);

            if (phase === "waiting") {
                playVoiceAndWait("assets/audio/host_11.mp3").then(function () {
                    board.button.disabled = false;
                    board.button.focus();
                });
            } else {
                board.button.focus();
            }
        },

        unmount: function () {}
    };

    game.scenes.board_after_spaceport = {
        id: "board_after_spaceport",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            const board = createBoard({
                eyebrow: "ПЕЧАТЬ НАВИГАЦИИ · ПОЛУЧЕНА",
                title: "Возвращение",
                text: "ТаКу вернулась на Центральный стол.",
                buttonLabel: "",
                buttonDisabled: true,
                showPlayer: true,
                worldsVisible: true,
                screenClass: "board-after-spaceport-screen",
                onAction: function () {}
            }, context);

            markSpaceportComplete(board);

            board.screen.classList.add("board-seal-reveal");

            /* ТаКу остаётся у Космопорта */
            board.screen.classList.remove("board-taku-moved");

            board.button.remove();

            root.appendChild(board.screen);
            board.caption.style.display = "none";

            const scaleX = board.stage.clientWidth / 1920;
            const scaleY = board.stage.clientHeight / 1080;

            board.screen.style.setProperty(
                "--taku-move-x-100",
                (300 * scaleX) + "px"
            );

            board.screen.style.setProperty(
                "--taku-move-y-100",
                (-580 * scaleY) + "px"
            );

            board.screen.classList.add("board-taku-spaceport-position");

            /* ТуКо возвращается ровно к Таверне */
            board.screen.classList.remove("board-tuko-moved");

            board.screen.style.setProperty(
                "--tuko-return-x",
                (-300 * scaleX) + "px"
            );

            board.screen.style.setProperty(
                "--tuko-return-y",
                (-580 * scaleY) + "px"
            );

            board.screen.classList.add("board-tuko-returned");

            context.timeout(function () {
                board.screen.classList.add("board-ready");
            }, 80);

            context.timeout(async function () {

                board.screen.classList.add(
                    "board-seal-reveal",
                    "board-navigation-seal-reveal"
                );

                game.audio.playVoice(
                    "assets/audio/seal_reveal.mp3"
                );

                const currentSeals = game.state.get().seals || {};
                const currentPathSteps = game.state.get().pathSteps || {};

                game.state.patch({
                    seals: {
                        ...currentSeals,
                        balance: currentSeals.balance || currentPathSteps.tuko >= 3,
                        navigation: true
                    }
                });

                await new Promise(function (resolve) {
                context.timeout(resolve, 2000);
                });
                await playVoiceAndWait(
                    "assets/audio/host_12.mp3"
                );
                context.timeout(function () {
                    board.caption.style.display = "";
                    board.caption.querySelector("h1").textContent =
                        "Следующий ход — ТуКо";

                    const actions =
                        board.caption.querySelector(".board-actions");

                    const nextButton =
                        game.mechanics.createButton(
                            "ПЕРЕДАТЬ ХОД ТуКо",
                            "gold-button"
                        );

                    context.on(nextButton, "click", function () {
                        context.goTo("handover_tuko_2", {
                            checkpointId: "handover_tuko_2",
                            save: true,
                            saveReason: "передача второго хода ТуКо"
                        });
                    });

                    actions.appendChild(nextButton);
                    nextButton.focus();

                }, 1500);

            }, 1000);
        },

        unmount: function () {}
    };

    game.scenes.handover_tuko_2 = {
        id: "handover_tuko_2",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "tuko" });

            const screen = document.createElement("section");
            screen.className = "screen handover-screen board-handover-screen";

            const card = document.createElement("article");
            card.className = "handover-card panel handover-card-tuko handover-card-tuko-second";

            const avatarWrap = document.createElement("div");
            avatarWrap.className = "handover-avatar-wrap";
            avatarWrap.appendChild(
                game.mechanics.createImage(
                    game.config.players.tuko.image,
                    "handover-avatar",
                    "ТуКо"
                )
            );

            const copy = document.createElement("div");
            copy.className = "handover-copy";
            copy.innerHTML =
                "<p class=\"eyebrow\">ПЕРЕДАЙТЕ МЫШЬ</p>" +
                "<span class=\"handover-turn\">ВТОРОЙ ХОД</span>" +
                "<h1>Главный игрок — ТуКо</h1>" +
                "<p>Путь продолжается. Следующий мир уже ждёт. Вперед ТуКо.</p>";

            const readyButton = game.mechanics.createButton("Я ГОТОВА", "gold-button");
            context.on(readyButton, "click", function () {
                context.goTo("board_roll_arena", {
                    checkpointId: "board_roll_arena",
                    save: true,
                    saveReason: "второй бросок ТуКо"
                });
            });

            copy.appendChild(readyButton);
            card.append(avatarWrap, copy);
            screen.append(
                game.ui.createHud(context, { title: "Передача хода", showPlayer: false }),
                card
            );
            root.appendChild(screen);

            context.timeout(function () {
                screen.classList.add("handover-ready");
                readyButton.focus();
            }, 60);
        },

        unmount: function () {}
    };

    game.scenes.board_roll_arena = {
        id: "board_roll_arena",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "tuko" });

            let phase =
                game.state.get().pathSteps.tuko >= 6
                    ? "open"
                    : "waiting";

            let board;

            function handleAction() {

                if (phase === "open") {
                    context.goTo("arena_intro", {
                        checkpointId: "arena_intro",
                        save: true,
                        saveReason: "вход на Древнюю арену"
                    });
                    return;
                }

                if (phase !== "waiting") {
                    return;
                }

                phase = "rolling";

                game.audio.unlock();

                board.button.disabled = true;
                board.button.textContent = "КОСТЬ РЕШАЕТ…";

                board.die.classList.add("is-rolling");

                context.timeout(function () {

                    phase = "open";

                    board.die.classList.remove("is-rolling");

                    board.die.src = "assets/images/dice.png";
                    board.die.setAttribute(
                        "aria-label",
                        "На кости выпало три"
                    );

                    board.button.disabled = false;
                    board.button.textContent =
                        "СЛЕДУЮЩАЯ ГЛАВА — АРЕНА";

                    game.state.patch({
                        pathSteps: {
                            tuko: 6,
                            taku: game.state.get().pathSteps.taku
                        }
                    });

                    game.save.write(
                        "второй бросок ТуКо: выпало три"
                    );

                    game.ui.showSubtitle(
                        "Выпало три. ТуКо отправляется на Арену."
                    );

                    board.button.disabled = true;
                    board.button.textContent = "ТУКО ИДЁТ…";

                    board.pieces.tuko.classList.add("board-piece-go-arena");
                    game.audio.playVoice(
                            "assets/audio/board_piece_move.mp3"
                        );

                    context.timeout(function () {

                        board.screen.classList.remove(
                            "board-tuko-returned"
                        );

                        board.pieces.tuko.classList.remove(
                            "board-piece-go-arena"
                        );

                        board.screen.classList.add(
                            "board-arena-open"
                        );

                        board.nodes.arena.classList.add(
                            "is-active",
                            "is-revealed"
                        );

                        board.nodes.arena.querySelector(
                            ".world-node-status"
                        ).textContent = "ОТКРЫТ";

                        updateSealCount(board);

                        board.pieces.tuko.style.transition = "none";

                        board.screen.classList.remove(
                            "board-tuko-returned"
                        );

                        board.pieces.tuko.classList.remove(
                            "board-piece-go-arena"
                        );

                        board.screen.classList.add(
                            "board-arena-open"
                        );

                        board.nodes.arena.classList.add(
                            "is-active",
                            "is-revealed"
                        );

                        board.nodes.arena.querySelector(
                            ".world-node-status"
                        ).textContent = "ОТКРЫТ";

                        updateSealCount(board);

                        board.pieces.tuko.style.left = "63%";
                        board.pieces.tuko.style.bottom = "29%";
                        board.pieces.tuko.style.transform =
                            "rotate(7deg) scale(1.05)";

                        board.button.disabled = false;
                        board.button.textContent =
                            "СЛЕДУЮЩАЯ ГЛАВА — АРЕНА";

                        board.button.disabled = false;
                        board.button.textContent =
                            "СЛЕДУЮЩАЯ ГЛАВА — АРЕНА";

                    }, 5000);

                }, 1100);
            }

            board = createBoard({
                eyebrow: "",
                title: "",
                text: "",
                buttonLabel:
                    phase === "open"
                        ? "СЛЕДУЮЩАЯ ГЛАВА — АРЕНА"
                        : "БРОСИТЬ КОСТЬ",
                buttonDisabled: false,
                showPlayer: false,
                worldsVisible: true,
                screenClass:
                    "board-roll-screen board-roll-arena-screen",
                onAction: handleAction
            }, context);

            const actions = board.caption.querySelector(".board-actions");

            board.caption.remove();
            board.stage.appendChild(actions);

            actions.style.position = "absolute";
            actions.style.left = "50%";
            actions.style.top = "calc(50% + 95px)";
            actions.style.transform = "translateX(-50%)";
            actions.style.marginTop = "0";
            actions.style.width = "max-content";
            actions.style.zIndex = "15";

            /*
            * Кость — та же картинка,
            * что используется в board_roll_spaceport.
            */
            const die = game.mechanics.createImage(
                "assets/images/dice.png",
                "board-die board-die-image-only",
                phase === "open"
                    ? "На кости выпало три"
                    : "Магическая кость ещё не брошена"
            );

            board.die = die;

            board.stage.appendChild(die);

            die.style.position = "absolute";
            die.style.left = "50%";
            die.style.top = "50%";
            die.style.width = "150px";
            die.style.height = "130px";
            die.style.transform =
                "translate(-50%, -50%)";

    if (phase === "open") {

        markArenaOpen(board);

        if (phase === "waiting") {
            board.screen.classList.add(
                "board-tuko-returned"
            );
        }

    } else {

        markSpaceportComplete(board);
    }

    root.appendChild(board.screen);

    /* Фигурки НЕ идут в новый мир на этом экране.
    ТуКо остаётся у Таверны.
    ТаКу остаётся у Космопорта. */

    board.screen.classList.remove(
        "board-tuko-moved",
        "board-taku-moved",
        "board-tuko-arena"
    );

    const scaleX =
        board.stage.clientWidth / 1920;

    const scaleY =
        board.stage.clientHeight / 1080;

    board.screen.style.setProperty(
        "--tuko-arena-x-70",
        (220 * scaleX) + "px"
    );

    board.screen.style.setProperty(
        "--tuko-arena-y-70",
        (-60 * scaleY) + "px"
    );

    board.screen.style.setProperty(
        "--tuko-arena-x-100",
        (380 * scaleX) + "px"
    );

    board.screen.style.setProperty(
        "--tuko-arena-y-100",
        (-120 * scaleY) + "px"
    );

    /* ТуКо — положение у Таверны */
    board.screen.style.setProperty(
        "--tuko-return-x",
        (-300 * scaleX) + "px"
    );

    board.screen.style.setProperty(
        "--tuko-return-y",
        (-580 * scaleY) + "px"
    );

    board.screen.classList.add(
        "board-tuko-returned"
    );


    /* ТаКу — положение у Космопорта */
    board.screen.style.setProperty(
        "--taku-move-x-100",
        (300 * scaleX) + "px"
    );

    board.screen.style.setProperty(
        "--taku-move-y-100",
        (-580 * scaleY) + "px"
    );

    board.screen.classList.add(
        "board-taku-spaceport-position"
    );

    context.timeout(function () {
        board.screen.classList.add(
            "board-ready"
        );

        board.button.focus();

    }, 60);
        },

        unmount: function () {}
    };

    game.scenes.board_after_arena = {
        id: "board_after_arena",

        mount: function (root, context) {

            game.state.patch({
                activePlayer: "tuko"
            });

            let rollPhase = "waiting";
            let board;

            /*
            * =========================================================
            * ОЗВУЧКА + АНИМАЦИЯ ГОВОРЯЩЕЙ ФИГУРКИ
            * =========================================================
            */
            function playCasinoLine(path, speakingPiece) {

                return new Promise(function (resolve) {

                    const audio = game.audio.playVoice(path);

                    if (!audio) {
                        resolve();
                        return;
                    }

                    if (speakingPiece) {
                        speakingPiece.classList.add(
                            "is-speaking"
                        );
                    }

                    function finish() {

                        if (speakingPiece) {
                            speakingPiece.classList.remove(
                                "is-speaking"
                            );
                        }

                        audio.removeEventListener(
                            "ended",
                            finish
                        );

                        audio.removeEventListener(
                            "error",
                            finish
                        );

                        resolve();
                    }

                    audio.addEventListener(
                        "ended",
                        finish
                    );

                    audio.addEventListener(
                        "error",
                        finish
                    );
                });
            }

            function wait(ms) {
                return new Promise(function (resolve) {
                    context.timeout(resolve, ms);
                });
            }


            /*
            * =========================================================
            * БРОСОК КОСТИ
            * =========================================================
            */
            async function handleRoll() {

                if (rollPhase === "open") {

                    context.goTo("casino_door_transition", {
                        checkpointId: "casino_door_transition",
                        save: true,
                        saveReason: "вход в Магическое казино"
                    });

                    return;
                }

                if (rollPhase !== "waiting") {
                    return;
                }

                rollPhase = "rolling";

                game.audio.unlock();

                board.button.disabled = true;
                board.button.textContent =
                    "КОСТЬ РЕШАЕТ…";

                /*
                * Кость начинает крутиться.
                */
                board.die.classList.add(
                    "is-rolling"
                );

                /*
                * Ровно как в board_roll_spaceport.
                */
                await wait(1100);

                rollPhase = "open";

                board.die.classList.remove(
                    "is-rolling"
                );

                /*
                * Оставляем PNG.
                */
                board.die.src =
                    "assets/images/dice.png";

                board.die.setAttribute(
                    "aria-label",
                    "На кости выпало три"
                );

                /*
                * Последний мировой шаг ТаКу.
                */
                game.state.patch({
                    pathSteps: {
                        tuko:
                            game.state.get().pathSteps.tuko,

                        taku: 6
                    }
                });

                game.save.write(
                    "последний бросок ТаКу: выпало три"
                );

                /*
                * =====================================================
                * HOST 5
                * Только ПОСЛЕ броска.
                * =====================================================
                */
                await wait(400);

                await playCasinoLine(
                    "assets/audio/Casino_host_5.mp3"
                );

                await wait(350);

                /*
                * =====================================================
                * ТАКУ → КАЗИНО
                * =====================================================
                */

                board.button.textContent =
                    "ТАKУ ИДЁТ…";

                const scaleX =
                    board.stage.clientWidth / 1920;

                const scaleY =
                    board.stage.clientHeight / 1080;


                /*
                * -----------------------------------------------------
                * Стартовая позиция = КОСМОПОРТ
                *
                * Это те же координаты, которые используются
                * в предыдущем рабочем движении ТаКу.
                * -----------------------------------------------------
                */
                board.screen.style.setProperty(
                    "--taku-casino-start-x",
                    (300 * scaleX) + "px"
                );

                board.screen.style.setProperty(
                    "--taku-casino-start-y",
                    (-580 * scaleY) + "px"
                );


                /*
                * -----------------------------------------------------
                * Промежуточная точка.
                *
                * Зеркалим движение ТуКо к Арене:
                *
                * ТуКо:
                *   -300 / -580
                *        ↓
                *    220 / -60
                *        ↓
                *    380 / -120
                *
                * ТаКу:
                *    300 / -580
                *        ↓
                *   -220 / -60
                *        ↓
                *   -380 / -120
                *
                * То есть движение справа сверху
                * вниз и влево.
                * -----------------------------------------------------
                */
                board.screen.style.setProperty(
                    "--taku-casino-x-70",
                    (-220 * scaleX) + "px"
                );

                board.screen.style.setProperty(
                    "--taku-casino-y-70",
                    (-60 * scaleY) + "px"
                );

                board.screen.style.setProperty(
                    "--taku-casino-x-100",
                    (-380 * scaleX) + "px"
                );

                board.screen.style.setProperty(
                    "--taku-casino-y-100",
                    (-120 * scaleY) + "px"
                );


                /*
                * ТаКу в момент старта должна быть именно
                * на позиции Космопорта.
                */
                board.screen.classList.add(
                    "board-taku-spaceport-position"
                );


                /*
                * -----------------------------------------------------
                * Временная анимация.
                *
                * Используем уникальное имя,
                * чтобы старый CSS .board-piece-go-casino
                * вообще не участвовал.
                * -----------------------------------------------------
                */
                board.pieces.taku.style.animation =
                    "takuGoToCasinoAfterArena 5s ease-in-out forwards";


                /*
                * Добавляем keyframes один раз.
                */
                if (!document.getElementById(
                    "tuko-taku-casino-after-arena-style"
                )) {

                    const style =
                        document.createElement("style");

                    style.id =
                        "tuko-taku-casino-after-arena-style";

                    style.textContent = `
                        @keyframes takuGoToCasinoAfterArena {

                            0% {
                                transform:
                                    translate(
                                        var(--taku-casino-start-x),
                                        var(--taku-casino-start-y)
                                    )
                                    scale(0.65);
                            }

                            70% {
                                transform:
                                    translate(
                                        var(--taku-casino-x-70),
                                        var(--taku-casino-y-70)
                                    )
                                    scale(0.65);
                            }

                            100% {
                                transform:
                                    translate(
                                        var(--taku-casino-x-100),
                                        var(--taku-casino-y-100)
                                    )
                                    scale(0.65);
                            }
                        }
                    `;

                    document.head.appendChild(
                        style
                    );
                }


                /*
                * Звук одновременно с движением.
                */
                game.audio.playVoice(
                    "assets/audio/board_piece_move.mp3"
                );


                /*
                * Ждём полные 5 секунд анимации.
                */
                await wait(5600);


                /*
                * =====================================================
                * ФИНАЛЬНАЯ ФИКСАЦИЯ У КАЗИНО
                * =====================================================
                *
                * Никакого второго движения.
                */
                board.pieces.taku.style.transition =
                    "none";

                board.pieces.taku.style.animation =
                    "none";

                board.screen.classList.remove(
                    "board-taku-spaceport-position"
                );

                board.screen.classList.add(
                    "board-casino-open",
                    "board-taku-casino"
                );

                board.nodes.casino.classList.add(
                    "is-active",
                    "is-revealed"
                );

                board.nodes.casino
                    .querySelector(
                        ".world-node-status"
                    )
                    .textContent = "ОТКРЫТ";

                /*
                * =========================================================
                * ЗАТЕМНЕНИЕ СТОЛА → ФОКУС НА КАЗИНО
                * =========================================================
                */
                const casinoIntro = document.createElement("div");

                casinoIntro.className =
                    "casino-entry-overlay";

                board.screen.appendChild(
                    casinoIntro
                );

                requestAnimationFrame(function () {
                    casinoIntro.classList.add(
                        "is-dark"
                    );
                });

                updateSealCount(board);


                /*
                * Кнопка становится переходом в Казино.
                */
                board.button.disabled = false;

                board.button.textContent =
                    "СЛЕДУЮЩАЯ ГЛАВА — КАЗИНО";


                /*
                * Возвращаем обычный transition.
                */
                requestAnimationFrame(
                    function () {

                        board.pieces.taku.style.transition =
                            "";

                        board.pieces.taku.style.animation =
                            "";
                    }
                );

                board.button.focus();
            }


            /*
            * =========================================================
            * СОЗДАЁМ ЦЕНТРАЛЬНЫЙ СТОЛ
            * =========================================================
            */
            board = createBoard({
                eyebrow: "",
                title: "",
                text: "",
                buttonLabel: "БРОСИТЬ КОСТЬ",
                buttonDisabled: true,
                showPlayer: true,
                worldsVisible: true,
                screenClass:
                    "board-after-arena-screen",
                onAction: handleRoll
            }, context);


            /*
            * =========================================================
            * АРЕНА ЗАВЕРШЕНА
            * =========================================================
            */
            markArenaComplete(board);


            /*
            * markArenaComplete() оставляет класс board-taku-moved.
            * Он нам здесь НЕ нужен:
            * он ставит ТаКу в промежуточную позицию поля.
            */
            board.screen.classList.remove(
                "board-taku-moved"
            );


            /*
            * board-tuko-arena здесь тоже больше не нужен.
            */
            board.screen.classList.remove(
                "board-tuko-arena"
            );


            /*
            * ТуКо — в центре.
            *
            * Координаты берутся из существующего
            * .board-tuko-center.
            *
            * Только убираем лишнее увеличение:
            * стандартный размер = scale(1).
            */
            board.pieces.tuko.style.transform =
                "rotate(-2deg) scale(1)";


            /*
            * =========================================================
            * КНОПКА ИЗ CAPTION
            * =========================================================
            *
            * Не удаляем её.
            */
            const actions =
                board.caption.querySelector(
                    ".board-actions"
                );

            board.caption.remove();

            board.stage.appendChild(
                actions
            );

            actions.style.position =
                "absolute";

            actions.style.left =
                "50%";

            actions.style.top =
                "calc(50% + 95px)";

            actions.style.transform =
                "translateX(-50%)";

            actions.style.marginTop =
                "0";

            actions.style.width =
                "max-content";

            actions.style.zIndex =
                "15";

            /*
            * Сначала кнопка скрыта.
            */
            actions.style.display =
                "none";

            board.button.textContent =
                "БРОСИТЬ КОСТЬ";

            board.button.disabled =
                true;


            /*
            * =========================================================
            * ТАКУ — ТОЧНО У КОСМОПОРТА
            * =========================================================
            *
            * ВАЖНО:
            * root.appendChild() должен быть ДО расчёта
            * clientWidth / clientHeight.
            */
            root.appendChild(
                board.screen
            );


            const scaleX =
                board.stage.clientWidth / 1920;

            const scaleY =
                board.stage.clientHeight / 1080;


            board.screen.style.setProperty(
                "--taku-move-x-100",
                (300 * scaleX) + "px"
            );

            board.screen.style.setProperty(
                "--taku-move-y-100",
                (-580 * scaleY) + "px"
            );

            board.screen.classList.add(
                "board-taku-spaceport-position"
            );


            /*
            * =========================================================
            * ПЕЧАТЬ АРЕНЫ
            * =========================================================
            */
            const arenaSeal =
                game.mechanics.createImage(
                    "assets/images/seal_arena.png",
                    "board-seal-arena",
                    "Печать Смелости"
                );

            arenaSeal.setAttribute(
                "aria-hidden",
                "true"
            );

            board.stage.appendChild(
                arenaSeal
            );


            /*
            * =========================================================
            * ПЛАШКА ПЕРЕДАЧИ ХОДА
            * =========================================================
            */
            const handover =
                document.createElement("div");

            handover.className =
                "board-center-wait";

            handover.style.display =
                "none";

            handover.innerHTML =
                "<span>ПЕРЕДАЙТЕ МЫШЬ</span>" +
                "<strong>ГЛАВНЫЙ ИГРОК — ТаКу</strong>";


            const handoverButton =
                game.mechanics.createButton(
                    "ПЕРЕДАТЬ ХОД ТаКу",
                    "gold-button board-center-next"
                );

            handoverButton.disabled =
                true;

            handover.appendChild(
                handoverButton
            );

            board.stage.appendChild(
                handover
            );


            /*
            * =========================================================
            * PNG-КОСТЬ
            * =========================================================
            */
            const die =
                game.mechanics.createImage(
                    "assets/images/dice.png",
                    "board-die board-die-image-only",
                    "Магическая кость ещё не брошена"
                );

            board.die = die;

            board.stage.appendChild(
                die
            );

            die.style.position =
                "absolute";

            die.style.left =
                "50%";

            die.style.top =
                "50%";

            die.style.width =
                "150px";

            die.style.height =
                "130px";

            die.style.transform =
                "translate(-50%, -50%)";

            die.style.display =
                "none";


            /*
            * =========================================================
            * МОНТИРУЕМ ЭКРАН
            * =========================================================
            */
            context.timeout(
                async function () {

                    board.screen.classList.add(
                        "board-ready"
                    );


                    /*
                    * Сохраняем третью печать.
                    */
                    const currentSeals =
                        game.state.get().seals || {};

                    game.state.patch({
                        seals: {
                            ...currentSeals,
                            arena: true
                        }
                    });

                    updateSealCount(
                        board
                    );


                    /*
                    * Появление Печати Арены.
                    */
                    board.screen.classList.add(
                        "board-arena-seal-reveal"
                    );

                    game.audio.playVoice(
                        "assets/audio/seal_reveal.mp3"
                    );

                    await wait(1800);


                    /*
                    * =================================================
                    * HOST 1
                    * =================================================
                    */
                    await playCasinoLine(
                        "assets/audio/Casino_host_1.mp3"
                    );

                    await wait(700);


                    /*
                    * =================================================
                    * TUКO 1
                    * =================================================
                    */
                    await playCasinoLine(
                        "assets/audio/Casino_tuko_1.mp3",
                        board.pieces.tuko
                    );

                    await wait(700);


                    /*
                    * =================================================
                    * HOST 2
                    * =================================================
                    */
                    await playCasinoLine(
                        "assets/audio/Casino_host_2.mp3"
                    );

                    await wait(700);


                    /*
                    * =================================================
                    * HOST 3
                    * =================================================
                    */
                    await playCasinoLine(
                        "assets/audio/Casino_host_3.mp3"
                    );

                    await wait(500);


                    /*
                    * =================================================
                    * ТЕПЕРЬ ПОЯВЛЯЕТСЯ ПЛАШКА
                    * =================================================
                    */
                    handover.style.display =
                        "grid";

                    board.screen.classList.add(
                        "board-center-waiting"
                    );

                    handoverButton.disabled =
                        false;

                    handoverButton.focus();

                },
                80
            );


            /*
            * =========================================================
            * ПЕРЕДАЧА ХОДА ТАКУ
            * =========================================================
            */
            context.on(
                handoverButton,
                "click",
                async function () {

                    handoverButton.disabled =
                        true;

                    board.screen.classList.remove(
                        "board-center-waiting"
                    );

                    handover.style.display =
                        "none";


                    game.state.patch({
                        activePlayer: "taku"
                    });


                    await wait(500);


                    /*
                    * =================================================
                    * TAKU 1
                    * =================================================
                    */
                    await playCasinoLine(
                        "assets/audio/Casino_taku_1.mp3",
                        board.pieces.taku
                    );

                    await wait(700);


                    /*
                    * =================================================
                    * HOST 4
                    * =================================================
                    */
                    await playCasinoLine(
                        "assets/audio/Casino_host_4.mp3"
                    );

                    await wait(700);


                    /*
                    * =================================================
                    * ТЕПЕРЬ ПОЯВЛЯЕТСЯ КОСТЬ + КНОПКА
                    * =================================================
                    */
                    die.style.display =
                        "";

                    actions.style.display =
                        "flex";

                    board.button.disabled =
                        false;

                    board.button.textContent =
                        "БРОСИТЬ КОСТЬ";

                    board.button.focus();
                }
            );
        },

        unmount: function () {}
    };
    
    game.scenes.handover_taku_2 = {
        id: "handover_taku_2",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            const screen = document.createElement("section");
            screen.className = "screen handover-screen board-handover-screen";

            const card = document.createElement("article");
            card.className = "handover-card panel handover-card-taku handover-card-taku-second";

            const avatarWrap = document.createElement("div");
            avatarWrap.className = "handover-avatar-wrap";
            avatarWrap.appendChild(
                game.mechanics.createImage(
                    game.config.players.taku.image,
                    "handover-avatar",
                    "ТаКу"
                )
            );

            const copy = document.createElement("div");
            copy.className = "handover-copy";
            copy.innerHTML =
                "<p class=\"eyebrow\">ПЕРЕДАЙТЕ МЫШЬ</p>" +
                "<span class=\"handover-turn\">ПОСЛЕДНИЙ МИРОВОЙ ХОД</span>" +
                "<h1>Главный игрок — ТаКу</h1>" +
                "<p>ТуКо уже ждёт у центра. Осталось добраться туда ТаКу — через место, где случайность продают по завышенной цене.</p>";

            const readyButton = game.mechanics.createButton("Я ГОТОВА", "gold-button");
            context.on(readyButton, "click", function () {
                context.goTo("board_roll_casino", {
                    checkpointId: "board_roll_casino",
                    save: true,
                    saveReason: "последний бросок ТаКу"
                });
            });

            copy.appendChild(readyButton);
            card.append(avatarWrap, copy);
            screen.append(
                game.ui.createHud(context, { title: "Передача хода", showPlayer: false }),
                card
            );
            root.appendChild(screen);

            context.timeout(function () {
                screen.classList.add("handover-ready");
                readyButton.focus();
            }, 60);
        },

        unmount: function () {}
    };

    game.scenes.board_roll_casino = {
        id: "board_roll_casino",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            let phase = game.state.get().pathSteps.taku >= 6 ? "open" : "waiting";
            let board;

            function handleAction() {
                if (phase === "open") {
                    context.goTo("casino_intro", {
                        checkpointId: "casino_intro",
                        save: true,
                        saveReason: "вход в Магическое казино"
                    });
                    return;
                }

                if (phase !== "waiting") {
                    return;
                }

                phase = "rolling";
                board.button.disabled = true;
                board.button.textContent = "КОСТЬ РЕШАЕТ…";
                board.die.classList.add("is-rolling");

                context.timeout(function () {
                    phase = "open";
                    board.die.classList.remove("is-rolling");
                    board.die.textContent = "3";
                    board.caption.querySelector("h1").textContent = "Магическое казино";
                    board.captionText.textContent =
                        "Ещё три. Какая невероятная случайность: ТаКу получает ровно столько, сколько нужно для последнего мира.";
                    board.button.disabled = false;
                    board.button.textContent = "СЛЕДУЮЩАЯ ГЛАВА — КАЗИНО";

                    game.state.patch({
                        pathSteps: {
                            tuko: game.state.get().pathSteps.tuko,
                            taku: 6
                        }
                    });

                    markCasinoOpen(board);
                    game.save.write("последний бросок ТаКу: выпало три");
                }, 1100);
            }

            board = createBoard({
                eyebrow: "ХОД ТаКу",
                title: phase === "open" ? "Магическое казино" : "Последний бросок ТаКу",
                text: phase === "open"
                    ? "Казино открыто. Последняя Печать ждёт внутри — вместе с доказательством, что Ведущий мухлюет."
                    : "Три печати уже собраны. Кость готова ещё раз продемонстрировать своё удивительное чувство драматургии.",
                buttonLabel: phase === "open"
                    ? "СЛЕДУЮЩАЯ ГЛАВА — КАЗИНО"
                    : "БРОСИТЬ КОСТЬ",
                showPlayer: true,
                worldsVisible: true,
                screenClass: "board-roll-screen board-roll-casino-screen",
                onAction: handleAction
            }, context);

            const die = document.createElement("div");
            die.className = "magic-die board-die";
            die.setAttribute(
                "aria-label",
                phase === "open" ? "На кости выпало три" : "Магическая кость ещё не брошена"
            );
            die.textContent = phase === "open" ? "3" : "?";
            board.die = die;
            board.stage.appendChild(die);

            if (phase === "open") {
                markCasinoOpen(board);
            } else {
                markArenaComplete(board);
            }

            root.appendChild(board.screen);
            context.timeout(function () {
                board.screen.classList.add("board-ready");
                board.button.focus();
            }, 60);
        },

        unmount: function () {}
    };

    game.scenes.board_after_casino = {
        id: "board_after_casino",

        mount: function (root, context) {

            /*
            * =========================================================
            * ФИНАЛ · ПЕРВЫЙ УЧАСТОК
            *
            * 1. Центральный стол сразу с тремя старыми печатями.
            * 2. ТаКу ещё стоит у Казино.
            * 3. Появляется Печать Хитрости.
            * 4. ТаКу идёт к ТуКо.
            * 5. Ведущий говорит последнюю вводную реплику.
            * 6. Проявляется центральный замок.
            * 7. Автоматический переход в finale_reveal.
            *
            * НИКАКИХ КНОПОК.
            * =========================================================
            */

            game.state.patch({
                activePlayer: "both"
            });


            /*
            * =========================================================
            * ЦЕНТРАЛЬНЫЙ СТОЛ
            *
            * В createBoard уже создаются:
            * - Печать Равновесия
            * - Печать Навигации
            *
            * Мы дополнительно добавляем:
            * - Печать Смелости
            * - Печать Хитрости
            * =========================================================
            */

            const board = createBoard({
                eyebrow: "",
                title: "",
                text: "",
                buttonLabel: "",
                buttonDisabled: true,
                showPlayer: false,
                worldsVisible: true,
                screenClass: "board-after-casino-screen",
                onAction: function () {}
            }, context);

            if (board.caption) {
                board.caption.remove();
            }


            /*
            * =========================================================
            * СОСТОЯНИЕ ПОЛЯ
            *
            * ТуКо должна быть уже в центре.
            * ТаКу пока остаётся возле Казино.
            *
            * markCasinoComplete() ставит миры в завершённое
            * состояние и включает board-taku-center,
            * поэтому ниже мы специально визуально возвращаем
            * ТаКу в позицию Казино до начала движения.
            * =========================================================
            */

            markCasinoComplete(board);


            /*
            * =========================================================
            * ПЕЧАТЬ АРЕНЫ
            *
            * Она уже получена.
            * Она должна лежать на столе СРАЗУ.
            * =========================================================
            */

            const arenaSeal = game.mechanics.createImage(
                "assets/images/seal_arena.png",
                "board-seal-arena",
                "Печать Смелости"
            );

            arenaSeal.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
            * =========================================================
            * ПЕЧАТЬ ХИТРОСТИ · ЦЕНТРАЛЬНЫЙ СТОЛ
            *
            * ВАЖНО:
            * Это НЕ печать из Казино.
            *
            * Казино:
            *     seal_cunning.png
            *
            * Центральный стол:
            *     seal_cunning_board.png
            * =========================================================
            */

            const cunningSeal = game.mechanics.createImage(
                "assets/images/seal_cunning_board.png",
                "board-seal-cunning",
                "Печать Хитрости"
            );

            cunningSeal.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
            * =========================================================
            * ЦЕНТРАЛЬНЫЙ ЗАМОК
            *
            * Полностью скрыт до нужного момента.
            * =========================================================
            */

            const centralLock = document.createElement("div");

            centralLock.className = "board-central-lock";

            centralLock.setAttribute(
                "aria-hidden",
                "true"
            );

            const centralLockImage = game.mechanics.createImage(
                "assets/images/central_lock_closed.png",
                "board-central-lock-image",
                "Закрытый центральный замок"
            );

            centralLock.appendChild(
                centralLockImage
            );


            /*
            * =========================================================
            * ДОБАВЛЯЕМ В СЦЕНУ
            * =========================================================
            */

            board.stage.append(
                arenaSeal,
                cunningSeal,
                centralLock
            );


            /*
            * КНОПКА БОЛЬШЕ НЕ НУЖНА
            */

            if (board.button) {
                board.button.remove();
            }


            /*
            * =========================================================
            * МОНТИРУЕМ ЭКРАН
            * =========================================================
            */

            root.appendChild(
                board.screen
            );


            /*
            * =========================================================
            * ВАЖНО:
            * три старые печати уже должны быть видимыми
            * при первом кадре.
            *
            * НИЧЕГО НЕ РЕВИЛИМ.
            * =========================================================
            */

            board.screen.classList.add(
                "board-previous-seals-static"
            );


            /*
            * =========================================================
            * СТАРТОВОЕ СОСТОЯНИЕ
            * =========================================================
            */

            board.screen.classList.add(
                "board-ready"
            );


            /*
            * =========================================================
            * ТАКУ ОСТАЁТСЯ У КАЗИНО
            *
            * Никакого мгновенного перехода в центр.
            * =========================================================
            */

            board.screen.classList.add(
                "board-taku-still-at-casino"
            );


            /*
            * =========================================================
            * 1. НЕБОЛЬШАЯ ПАУЗА НА СЦЕНУ
            *
            * Игрок должен успеть увидеть:
            * три старые печати,
            * ТуКо в центре,
            * ТаКу у Казино.
            * =========================================================
            */

            context.timeout(
                function () {

                    board.screen.classList.add(
                        "board-cunning-seal-reveal"
                    );

                    game.audio.playVoice(
                        "assets/audio/seal_reveal.mp3"
                    );

                },
                1600
            );


            /*
            * =========================================================
            * 2. ПЕЧАТЬ ХИТРОСТИ НЕМНОГО ПОБЫЛА НА ЭКРАНЕ
            *
            * Затем начинаем движение ТаКу.
            * =========================================================
            */

            context.timeout(
                function () {

                    board.screen.classList.remove(
                        "board-taku-still-at-casino"
                    );

                    board.screen.classList.add(
                        "board-taku-going-center"
                    );

                },
                3600
            );


            /*
            * =========================================================
            * 3. ТАКУ ДОСТИГАЕТ ЦЕНТРА
            *
            * Даём анимации закончиться.
            * =========================================================
            */

            context.timeout(
                async function () {

                    /*
                    * Небольшая пауза после движения.
                    */

                    await new Promise(function (resolve) {
                        context.timeout(resolve, 900);
                    });


                    /*
                    * =====================================================
                    * 4. ВЕДУЩИЙ
                    * =====================================================
                    *
                    * НОВЫЙ ГОЛОС:
                    *
                    * Finale_host_1.mp3
                    *
                    * Текст:
                    *
                    * «Обе фигурки дошли до центра.
                    *  Осталось последнее правило.»
                    *
                    * Используем один цельный файл.
                    */

                    const hostVoice =
                        game.audio.playVoice(
                            "assets/audio/Finale_host_1.mp3"
                        );


                    /*
                    * На всякий случай делаем защиту:
                    * если голос не загрузится,
                    * финал всё равно не зависнет.
                    */

                    await new Promise(function (resolve) {

                        if (!hostVoice) {
                            resolve();
                            return;
                        }

                        let finished = false;

                        function finish() {

                            if (finished) {
                                return;
                            }

                            finished = true;

                            hostVoice.removeEventListener(
                                "ended",
                                finish
                            );

                            hostVoice.removeEventListener(
                                "error",
                                finish
                            );

                            resolve();
                        }

                        hostVoice.addEventListener(
                            "ended",
                            finish
                        );

                        hostVoice.addEventListener(
                            "error",
                            finish
                        );

                        context.timeout(
                            finish,
                            8000
                        );
                    });


                    /*
                    * =========================================================
                    * ЦЕНТРАЛЬНЫЙ ЗАМОК
                    *
                    * Анимация и звук стартуют ОДНОВРЕМЕННО.
                    * Длительность звука: ~4.22 сек.
                    * =========================================================
                    */

                    const lockSound = new Audio(
                        "assets/audio/central_lock_activate.mp3"
                    );

                    // =====================================================
                    // ТУКО И ТАКУ ЗАМЕЧАЮТ КОСМИЧЕСКИЙ СТОЛ
                    // =====================================================

                    // Небольшая пауза после активации центрального замка.

                    await new Promise(function (resolve) {

                        context.timeout(resolve, 350);

                    });


                    // ТуКо удивляется новому положению стола.

                    await playVoiceAndWait(
                        "assets/audio/Finale_tuko_space_1.mp3"
                    );


                    // Небольшая пауза между репликами.

                    await new Promise(function (resolve) {

                        context.timeout(resolve, 400);

                    });


                    // ТаКу осознаёт, что они добрались до Центра.

                    await playVoiceAndWait(
                        "assets/audio/Finale_taku_space_1.mp3"
                    );

                    lockSound.preload = "auto";
                    lockSound.volume = 0.75;


                    /*
                    * Сначала запускаем визуальную анимацию.
                    */

                    board.screen.classList.add(
                        "board-central-lock-awakening"
                    );


                    /*
                    * Тут же запускаем звук.
                    */

                    await new Promise(function (resolve) {

                        let finished = false;

                        function finish() {

                            if (finished) {
                                return;
                            }

                            finished = true;

                            lockSound.removeEventListener(
                                "ended",
                                finish
                            );

                            lockSound.removeEventListener(
                                "error",
                                finish
                            );

                            resolve();
                        }

                        lockSound.addEventListener(
                            "ended",
                            finish
                        );

                        lockSound.addEventListener(
                            "error",
                            finish
                        );

                        const playPromise =
                            lockSound.play();

                        if (
                            playPromise &&
                            typeof playPromise.catch === "function"
                        ) {
                            playPromise.catch(
                                function () {
                                    finish();
                                }
                            );
                        }

                        /*
                        * Аудио у тебя 4.219 сек.
                        * 8 секунд — только аварийная страховка.
                        */

                        context.timeout(
                            finish,
                            8000
                        );
                    });


                    /*
                    * =========================================================
                    * ЗВУК ПОЛНОСТЬЮ ЗАКОНЧИЛСЯ.
                    *
                    * Теперь можно уходить в следующую сцену.
                    * =========================================================
                    */

                    context.goTo(
                        "finale_reveal",
                        {
                            checkpointId: "finale_reveal",
                            save: true,
                            saveReason:
                                "финал: центральный замок активирован"
                        }
                    );


                    /*
                    * =====================================================
                    * 6. АВТОМАТИЧЕСКИ В ФИНАЛ
                    *
                    * Никакой кнопки.
                    * =====================================================
                    */

                    context.goTo(
                        "finale_reveal",
                        {
                            checkpointId: "finale_reveal",
                            save: true,
                            saveReason:
                                "финал: четыре печати активны, центральный замок открыт для решения"
                        }
                    );

                },
                7000
            );
        },

        unmount: function () {}
    };

})(window);
