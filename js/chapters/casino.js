(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    game.scenes = game.scenes || {};
    game.chapters = game.chapters || {};
    game.chapters.casino = { id: "casino", status: "active" };

    const ASSETS = {
        bg: "assets/images/casino_bg.png",
        rouletteBg: "assets/images/casino_roulette_bg.png",
        securityBg: "assets/images/casino_security_bg.png",

        ladyIdle: "assets/images/lady_chance_idle.png",
        ladyTalk: "assets/images/lady_chance_talk.png",
        ladySeatedIdle: "assets/images/lady_chance_seated_idle.png",
        ladySeatedTalk: "assets/images/lady_chance_seated_talk.png",

        chip: "assets/images/casino_chip_empty.png",
        lens: "assets/images/mirror_lens.png",
        key: "assets/images/service_key.png",
        golemSleep: "assets/images/casino_golem_sleep.png",
        golemAwake: "assets/images/casino_golem_awake.png",
        golemDistracted: "assets/images/casino_golem_distracted.png",
        livingCard: "assets/images/living_card.png",

        magicChipsBg: "assets/images/casino_magic_chips_table.png",

        magicScalesBalance: "assets/images/casino_magic_scales_balance.png",
        magicScalesLeft: "assets/images/casino_magic_scales_left.png",
        magicScalesRight: "assets/images/casino_magic_scales_right.png",

        magicChip: "assets/images/casino_magic_chip.png",
        magicChipSide: "assets/images/casino_magic_chip_side.png",

        magicWhite: "assets/images/casino_magic_white.png",
        magicBlack: "assets/images/casino_magic_black.png",

        blackjackBg: "assets/images/casino_blackjack_bg.png",
        blackjackPirateIdle: "assets/images/casino_blackjack_pirate_idle.png",
        blackjackPirateTalk: "assets/images/casino_blackjack_pirate_talk.png",
        blackjackRobotIdle: "assets/images/casino_blackjack_robot_idle.png",
        blackjackRobotTalk: "assets/images/casino_blackjack_robot_talk.png",
        blackjackDealerIdle: "assets/images/casino_blackjack_dealer_idle.png",
        blackjackDealerDeal: "assets/images/casino_blackjack_dealer_deal.png",

        blackjack10h: "assets/images/casino_blackjack_card_10_hearts.png",
        blackjack2c: "assets/images/casino_blackjack_card_2_clubs.png",
        blackjack2h: "assets/images/casino_blackjack_card_2_hearts.png",
        blackjack3s: "assets/images/casino_blackjack_card_3_spades.png",
        blackjack4d: "assets/images/casino_blackjack_card_4_diamonds.png",
        blackjack4c: "assets/images/casino_blackjack_card_4_clubs.png",
        blackjack5s: "assets/images/casino_blackjack_card_5_spades.png",
        blackjack5h: "assets/images/casino_blackjack_card_5_hearts.png",
        blackjack6s: "assets/images/casino_blackjack_card_6_spades.png",
        blackjack6h: "assets/images/casino_blackjack_card_6_hearts.png",
        blackjack7s: "assets/images/casino_blackjack_card_7_spades.png",
        blackjack8d: "assets/images/casino_blackjack_card_8_diamonds.png",
        blackjack8c: "assets/images/casino_blackjack_card_8_clubs.png",
        blackjack9s: "assets/images/casino_blackjack_card_9_spades.png",
        blackjackAceD: "assets/images/casino_blackjack_card_ace_diamonds.png",
        blackjackAceS: "assets/images/casino_blackjack_card_ace_spades.png",

        blackjackMagicWhite: "assets/images/casino_blackjack_magic_white.png",
        blackjackMagicBlack: "assets/images/casino_blackjack_magic_black.png",
        blackjackJoker: "assets/images/casino_blackjack_card_joker.png",
        stichBlocking: "assets/images/stich_blocking.png",

        pokerBg:
            "assets/images/poker_idle.png",

        pokerRichManIdle:
            "assets/images/poker_rich_man_idle.png",

        pokerRichManTalk:
            "assets/images/poker_rich_man_talk.png",

        pokerGolemIdle:
            "assets/images/poker_golem_idle.png",

        pokerGolemTalk:
            "assets/images/poker_golem_talk.png",

        pokerIncognitoIdle:
            "assets/images/poker_incognito_idle.png",

        pokerIncognitoTalk:
            "assets/images/poker_incognito_talk.png",

        pokerCardBack:
            "assets/images/poker_card_back.png",

        pokerCombinationsButton:
            "assets/images/poker_combinations_button.png",

        pokerCombinationsPanel:
            "assets/images/poker_combinations_panel.png",

        pokerDialogueButton:
            "assets/images/poker_dialogue_button.png",

        pokerDialoguePanel:
            "assets/images/poker_dialogue_panel.png",

        pokerLiarChoicePanel:
            "assets/images/poker_liar_choice_panel.png",

        pokerOutOfPlayPanel:
            "assets/images/poker_out_of_play_panel.png",

        pokerASpades:
            "assets/images/poker_A_spades.png",

        pokerAHearts:
            "assets/images/poker_A_hearts.png",

        pokerADiamonds:
            "assets/images/poker_A_diamonds.png",

        pokerAClubs:
            "assets/images/poker_A_clubs.png",

        pokerKSpades:
            "assets/images/poker_K_spades.png",

        pokerKHearts:
            "assets/images/poker_K_hearts.png",

        pokerKDiamonds:
            "assets/images/poker_K_diamonds.png",

        pokerKClubs:
            "assets/images/poker_K_clubs.png",

        pokerQSpades:
            "assets/images/poker_Q_spades.png",

        pokerQHearts:
            "assets/images/poker_Q_hearts.png",

        pokerQDiamonds:
            "assets/images/poker_Q_diamonds.png",

        pokerQClubs:
            "assets/images/poker_Q_clubs.png",

        pokerJSpades:
            "assets/images/poker_J_spades.png",

        pokerJHearts:
            "assets/images/poker_J_hearts.png",

        pokerJDiamonds:
            "assets/images/poker_J_diamonds.png",

        pokerJClubs:
            "assets/images/poker_J_clubs.png",

        crown: "assets/images/casino_symbol_crown.png",
        moon: "assets/images/casino_symbol_moon.png",
        star: "assets/images/casino_symbol_star.png",
        center: "assets/images/casino_symbol_center.png",
        hiddenMechanism: "assets/images/roulette_hidden_mechanism.png",

        securityMirror: "assets/images/security_mirror.png",
        alarmCrystal: "assets/images/alarm_crystal.png",
        vaultClosed: "assets/images/seal_vault_closed.png",
        vaultOpen: "assets/images/seal_vault_open.png",
        cunningSeal: "assets/images/seal_cunning.png"
    };

        const POKER_CARDS = {

        As: {
            image: ASSETS.pokerASpades,
            label: "A♠"
        },

        Ah: {
            image: ASSETS.pokerAHearts,
            label: "A♥"
        },

        Ad: {
            image: ASSETS.pokerADiamonds,
            label: "A♦"
        },

        Ac: {
            image: ASSETS.pokerAClubs,
            label: "A♣"
        },

        Ks: {
            image: ASSETS.pokerKSpades,
            label: "K♠"
        },

        Kh: {
            image: ASSETS.pokerKHearts,
            label: "K♥"
        },

        Kd: {
            image: ASSETS.pokerKDiamonds,
            label: "K♦"
        },

        Kc: {
            image: ASSETS.pokerKClubs,
            label: "K♣"
        },

        Qs: {
            image: ASSETS.pokerQSpades,
            label: "Q♠"
        },

        Qh: {
            image: ASSETS.pokerQHearts,
            label: "Q♥"
        },

        Qd: {
            image: ASSETS.pokerQDiamonds,
            label: "Q♦"
        },

        Qc: {
            image: ASSETS.pokerQClubs,
            label: "Q♣"
        },

        Js: {
            image: ASSETS.pokerJSpades,
            label: "J♠"
        },

        Jh: {
            image: ASSETS.pokerJHearts,
            label: "J♥"
        },

        Jd: {
            image: ASSETS.pokerJDiamonds,
            label: "J♦"
        },

        Jc: {
            image: ASSETS.pokerJClubs,
            label: "J♣"
        }
    };

    const BLACKJACK_CARD_DATA = {
            "10h": { image: ASSETS.blackjack10h, value: 10, label: "10♥" },
            "2c": { image: ASSETS.blackjack2c, value: 2, label: "2♣" },
            "2h": { image: ASSETS.blackjack2h, value: 2, label: "2♥" },
            "3s": { image: ASSETS.blackjack3s, value: 3, label: "3♠" },
            "4d": { image: ASSETS.blackjack4d, value: 4, label: "4♦" },
            "4c": { image: ASSETS.blackjack4c, value: 4, label: "4♣" },
            "5s": { image: ASSETS.blackjack5s, value: 5, label: "5♠" },
            "5h": { image: ASSETS.blackjack5h, value: 5, label: "5♥" },
            "6s": { image: ASSETS.blackjack6s, value: 6, label: "6♠" },
            "6h": { image: ASSETS.blackjack6h, value: 6, label: "6♥" },
            "7s": { image: ASSETS.blackjack7s, value: 7, label: "7♠" },
            "8d": { image: ASSETS.blackjack8d, value: 8, label: "8♦" },
            "8c": { image: ASSETS.blackjack8c, value: 8, label: "8♣" },
            "9s": { image: ASSETS.blackjack9s, value: 9, label: "9♠" },
            "Ad": { image: ASSETS.blackjackAceD, value: 11, label: "A♦" },
            "As": { image: ASSETS.blackjackAceS, value: 11, label: "A♠" }
        };

    const BLACKJACK_SPECIALS = {
            white: {
                image: ASSETS.blackjackMagicWhite,
                label: "БЕЛАЯ МАГИЯ",
                modifier: 2
            },
            black: {
                image: ASSETS.blackjackMagicBlack,
                label: "ЧЁРНАЯ МАГИЯ",
                modifier: -2
            },
            joker: {
                image: ASSETS.blackjackJoker,
                label: "ДЖОКЕР"
            }
        };

    const SYMBOLS = {
        crown: { id: "crown", label: "Корона", image: ASSETS.crown },
        moon: { id: "moon", label: "Луна", image: ASSETS.moon },
        star: { id: "star", label: "Звезда", image: ASSETS.star },
        center: { id: "center", label: "Знак Центра", image: ASSETS.center }
    };

    function image(src, className, alt) {
        return game.mechanics.createImage(src, className || "", alt || "");
    }

    function makeScreen(className, background) {
        const screen = document.createElement("section");
        screen.className = "screen casino-screen " + (className || "");

        const stage = document.createElement("div");
        stage.className = "casino-stage";
        stage.appendChild(image(background, "casino-background", ""));
        screen.appendChild(stage);

        return { screen: screen, stage: stage };
    }

    function playCasinoDoorTransition(root, context, nextScene, saveReason) {

        const screen = document.createElement("section");
        screen.className = "screen casino-door-transition-screen";

        /* Переход должен быть поверх текущей сцены */
        screen.style.position = "fixed";
        screen.style.inset = "0";
        screen.style.zIndex = "999999";
        screen.style.pointerEvents = "auto";
        screen.style.background = "#000";

        const video = document.createElement("video");

        video.className = "casino-door-transition-video";
        video.src = "assets/video/casino_door_transition.mp4";

        video.preload = "auto";
        video.autoplay = false;

        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        video.style.display = "block";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.style.background = "#000";

        screen.appendChild(video);
        root.appendChild(screen);

        let finished = false;
        let started = false;

        function goNext() {

            if (finished) {
                return;
            }

            finished = true;

            video.pause();
            video.remove();

            context.goTo(nextScene, {
                checkpointId: nextScene,
                save: true,
                saveReason:
                    saveReason ||
                    ("Казино: переход в " + nextScene)
            });
        }

        function startVideo() {

            if (started || finished) {
                return;
            }

            started = true;

            video.currentTime = 0;

            const playPromise = video.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {
                playPromise.catch(function (error) {

                    console.warn(
                        "Не удалось запустить casino_door_transition.mp4:",
                        error
                    );

                });
            }
        }

        /*
        * Ждём, пока видео реально будет готово.
        */
        video.addEventListener(
            "loadeddata",
            startVideo
        );

        video.addEventListener(
            "canplay",
            startVideo
        );

        /*
        * Переход только после нормального окончания
        * реально проигравшего видео.
        */
        video.addEventListener(
            "ended",
            function () {

                if (!started) {
                    return;
                }

                /*
                * Не даём ошибочному/пустому видео
                * сразу отправить игрока в следующую сцену.
                */
                if (
                    !Number.isFinite(video.duration) ||
                    video.duration <= 0
                ) {
                    return;
                }

                if (
                    video.currentTime <
                    video.duration - 0.15
                ) {
                    return;
                }

                goNext();
            }
        );

        video.addEventListener(
            "error",
            function (error) {

                console.warn(
                    "Ошибка видео casino_door_transition.mp4:",
                    error
                );

                /*
                * ВАЖНО:
                * при ошибке видео НЕ переходим автоматически
                * в следующую сцену.
                */
            }
        );

        /*
        * Если браузер уже успел загрузить видео
        * до добавления обработчиков.
        */
        context.timeout(function () {

            screen.classList.add("casino-ready");

            if (video.readyState >= 2) {
                startVideo();
            }

        }, 50);
    }

    function addHud(screen, context, title) {
        screen.prepend(
            game.ui.createHud(context, {
                title: title,
                showPlayer: true
            })
        );
    }

    function createSceneHeader(eyebrow, title, text) {
        const header = document.createElement("div");
        header.className = "casino-scene-header";
        header.innerHTML =
            "<p>" + eyebrow + "</p>" +
            "<h1>" + title + "</h1>" +
            "<span>" + text + "</span>";
        return header;
    }

    function createDialogue(context, speaker, text, buttonLabel, onClick) {
        const card = document.createElement("article");
        card.className = "casino-dialogue";

        const speakerNode = document.createElement("span");
        speakerNode.className = "casino-dialogue-speaker";
        speakerNode.textContent = speaker;

        const textNode = document.createElement("p");
        textNode.className = "casino-dialogue-text";
        textNode.textContent = text;

        const button = game.mechanics.createButton(buttonLabel || "ДАЛЬШЕ", "gold-button");
        context.on(button, "click", onClick);

        card.append(speakerNode, textNode, button);
        return {
            card: card,
            speaker: speakerNode,
            text: textNode,
            button: button
        };
    }

    function createInventory() {
        const inventory = document.createElement("div");
        inventory.className = "casino-inventory";

        [
            { id: "chip", label: "Пустая фишка", src: ASSETS.chip },
            { id: "lens", label: "Зеркальная линза", src: ASSETS.lens },
            { id: "key", label: "Служебный ключ", src: ASSETS.key }
        ].forEach(function (item) {
            const slot = document.createElement("div");
            slot.className = "casino-inventory-slot";
            slot.dataset.item = item.id;
            slot.title = item.label;
            slot.appendChild(image(item.src, "casino-inventory-icon", item.label));
            inventory.appendChild(slot);
        });

        return inventory;
    }

    function setInventoryItem(inventory, id, visible) {
        const slot = inventory.querySelector('[data-item="' + id + '"]');
        if (slot) {
            slot.classList.toggle("is-owned", Boolean(visible));
        }
    }

    function createFeedback() {
        const node = document.createElement("div");
        node.className = "casino-feedback";
        node.setAttribute("aria-live", "polite");
        return node;
    }

    function setCasinoProgress(value, reason) {
        const state = game.state.get();
        const progress = Object.assign({}, state.chapterProgress, { casino: value });
        game.state.patch({ chapterProgress: progress });
        game.save.write(reason || ("Казино: испытание " + value));
    }

    function markCunningSeal() {
        const state = game.state.get();
        const seals = Object.assign({}, state.seals, { cunning: true });
        const progress = Object.assign({}, state.chapterProgress, { casino: 3 });
        game.state.patch({ seals: seals, chapterProgress: progress });
        game.save.write("Казино пройдено: Печать Хитрости получена");
    }

    game.scenes.casino_door_transition = {

        id: "casino_door_transition",

        mount: function (root, context) {

            playCasinoDoorTransition(
                root,
                context,
                "casino_intro",
                "дверь Казино открыта"
            );
        },

        unmount: function () {}
    };

    /* =========================================================
    ВСТРЕЧА С ГОСПОЖОЙ СЛУЧАЙ
    ========================================================= */

    game.scenes.casino_intro = {
        id: "casino_intro",

        mount: function (root, context) {
            game.state.patch({
                activePlayer: "taku"
            });

            const scene = makeScreen(
                "casino-intro-screen",
                ASSETS.bg
            );

            const stage = scene.stage;

            const lady = image(
                ASSETS.ladyIdle,
                "casino-lady casino-lady-intro",
                "Госпожа Случай"
            );

            stage.appendChild(lady);

            addHud(
                scene.screen,
                context,
                "Магическое казино"
            );

            root.appendChild(scene.screen);

            let currentVoice = null;
            let finished = false;

            function wait(ms) {
                return new Promise(function (resolve) {
                    context.timeout(resolve, ms);
                });
            }

            let robotVoiceAudioContext =
                null;

            function boostVoiceAudio(
                audio,
                gainValue
            ) {

                if (
                    !audio ||
                    gainValue === undefined ||
                    gainValue <= 1
                ) {
                    return;
                }

                try {

                    const AudioContextClass =
                        window.AudioContext ||
                        window.webkitAudioContext;

                    if (
                        !AudioContextClass
                    ) {
                        audio.volume = 1;
                        return;
                    }

                    if (
                        !robotVoiceAudioContext
                    ) {
                        robotVoiceAudioContext =
                            new AudioContextClass();
                    }

                    if (
                        robotVoiceAudioContext.state ===
                        "suspended"
                    ) {
                        robotVoiceAudioContext
                            .resume()
                            .catch(function () {});
                    }

                    /*
                    * Подключаем именно этот
                    * HTMLAudioElement к усилителю.
                    */

                    const source =
                        robotVoiceAudioContext
                            .createMediaElementSource(
                                audio
                            );

                    const gain =
                        robotVoiceAudioContext
                            .createGain();

                    gain.gain.value =
                        gainValue;

                    source.connect(
                        gain
                    );

                    gain.connect(
                        robotVoiceAudioContext.destination
                    );

                    /*
                    * Сам элемент тоже ставим
                    * на максимальную громкость.
                    */

                    audio.volume =
                        1;

                } catch (error) {

                    /*
                    * Если Web Audio по какой-то
                    * причине недоступен —
                    * остаёмся на обычной громкости.
                    */

                    audio.volume =
                        1;

                    console.warn(
                        "Не удалось усилить голос:",
                        error
                    );
                }
            }

            function playLine(file, speaking) {
                return new Promise(function (resolve) {

                    currentVoice = game.audio.playVoice(
                        "assets/audio/" + file
                    );

                    if (!currentVoice) {
                        resolve();
                        return;
                    }

                    if (speaking) {
                        lady.src = ASSETS.ladyTalk;
                        lady.classList.add("is-talking");
                    } else {
                        lady.src = ASSETS.ladyIdle;
                        lady.classList.remove("is-talking");
                    }

                    let done = false;

                    function finish() {
                        if (done) {
                            return;
                        }

                        done = true;

                        lady.src = ASSETS.ladyIdle;
                        lady.classList.remove("is-talking");

                        currentVoice.removeEventListener(
                            "ended",
                            finish
                        );

                        currentVoice.removeEventListener(
                            "error",
                            finish
                        );

                        resolve();
                    }

                    currentVoice.addEventListener(
                        "ended",
                        finish
                    );

                    currentVoice.addEventListener(
                        "error",
                        finish
                    );
                });
            }

            async function startDialogue() {

                await wait(700);

                // ГОСПОЖА СЛУЧАЙ 1
                await playLine(
                    "casino_chance_1.mp3",
                    true
                );

                await wait(500);

                // ТАКУ 1
                await playLine(
                    "casino_taku_1cas.mp3",
                    false
                );

                await wait(500);

                // ГОСПОЖА СЛУЧАЙ 2
                await playLine(
                    "casino_chance_2.mp3",
                    true
                );

                await wait(500);

                // ТАКУ 2
                await playLine(
                    "casino_taku_2.mp3",
                    false
                );

                await wait(500);

                // ГОСПОЖА СЛУЧАЙ 3
                await playLine(
                    "casino_chance_3.mp3",
                    true
                );

                await wait(500);

                // ТАКУ 3
                await playLine(
                    "casino_taku_3.mp3",
                    false
                );

                await wait(500);

                // ГОСПОЖА СЛУЧАЙ 4
                await playLine(
                    "casino_chance_4.mp3",
                    true
                );

                await wait(900);

                if (finished) {
                    return;
                }

                finished = true;

                context.goTo("casino_magic_chips_golem", {
                    checkpointId: "casino_magic_chips_golem",
                    save: true,
                    saveReason: "Госпожа Случай направила к Голему"
                });
            }

            context.timeout(function () {
                scene.screen.classList.add(
                    "casino-ready"
                );

                startDialogue();
            }, 80);
        },

        unmount: function () {}
    };

    /* =========================================================
    ПЕРЕД ИСПЫТАНИЕМ 1 · ГОЛЕМ И ПРОПУСК
    ========================================================= */

    game.scenes.casino_magic_chips_golem = {
        id: "casino_magic_chips_golem",

        mount: function (root, context) {

            game.state.patch({
                activePlayer: "taku"
            });

            const scene = makeScreen(
                "casino-magic-chips-golem-screen",
                ASSETS.bg
            );

            const stage = scene.stage;

            /* -------------------------------------------------
            ОБЪЕКТЫ СЦЕНЫ
            Только:
            - Голем
            - фишка
            - автомат
            ------------------------------------------------- */

            const golem = image(
                ASSETS.golemSleep,
                "casino-golem",
                "Спящий каменный голем"
            );

            const chip = document.createElement("button");

            chip.type = "button";
            chip.className = "casino-golem-chip";
            chip.setAttribute("aria-label", "Забрать фишку");

            chip.style.background = "transparent";
            chip.style.border = "0";
            chip.style.padding = "0";
            chip.style.margin = "0";
            chip.style.appearance = "none";
            chip.style.webkitAppearance = "none";

            const chipImage = image(
                ASSETS.chip,
                "casino-golem-chip-image",
                "Фишка-пропуск"
            );

            chipImage.style.display = "block";
            chipImage.style.width = "100%";
            chipImage.style.height = "auto";
            chipImage.style.pointerEvents = "none";

            chip.appendChild(chipImage);

            chip.style.position = "absolute";
            chip.style.left = "22.7%";
            chip.style.bottom = "22%";
            chip.style.width = "clamp(48px, 4.6vw, 78px)";
            chip.style.zIndex = "100";
            chip.style.pointerEvents = "auto";
            chip.style.cursor = "pointer";

            /*
            * Сам автомат — только hotspot.
            * Автомат уже нарисован на фоне.
            */
            const machineHotspot = document.createElement("button");

            machineHotspot.type = "button";

            machineHotspot.className =
                "casino-hotspot casino-golem-machine-hotspot";

            machineHotspot.setAttribute(
                "aria-label",
                "Запустить автомат"
            );

            /* -------------------------------------------------
            СОСТОЯНИЕ
            ------------------------------------------------- */

            let golemAwake = false;
            let golemDistracted = false;
            let chipTaken = false;
            let finished = false;

            /*
            * Звук автомата.
            *
            * jackpot.mp3 может быть длинным — около 52 секунд.
            * Мы не ставим таймер.
            * Он остановится только когда игрок заберёт фишку
            * или сцена будет уничтожена.
            */
            const jackpotSound = new Audio(
                "assets/audio/jackpot.mp3"
            );

            jackpotSound.preload = "auto";

            /* -------------------------------------------------
            ЗАБРАТЬ ФИШКУ
            ------------------------------------------------- */

            function takeChip() {

                if (chipTaken || finished) {
                    return;
                }

                if (!golemDistracted) {

                    if (!golemAwake) {

                        golemAwake = true;

                        golem.src = ASSETS.golemAwake;

                        golem.classList.add("is-awake");

                        // Звук пробуждения Голема
                        const golemAwakeSound = new Audio(
                            "assets/audio/golem_awake.mp3"
                        );

                        golemAwakeSound.preload = "auto";
                        golemAwakeSound.currentTime = 0;

                        const playPromise = golemAwakeSound.play();

                        if (
                            playPromise &&
                            typeof playPromise.catch === "function"
                        ) {
                            playPromise.catch(function (error) {
                                console.warn(
                                    "Не удалось запустить golem_awake.mp3:",
                                    error
                                );
                            });
                        }
                    }

                    return;
                }

                chipTaken = true;
                finished = true;

                /* -------------------------------------------------
                ОСТАНАВЛИВАЕМ АВТОМАТ
                ------------------------------------------------- */

                jackpotSound.pause();
                jackpotSound.currentTime = 0;

                /* -------------------------------------------------
                БЛОКИРУЕМ ВЗАИМОДЕЙСТВИЕ
                ------------------------------------------------- */

                machineHotspot.disabled = true;
                chip.disabled = true;

                /* -------------------------------------------------
                АКТИВАЦИЯ ФИШКИ
                ------------------------------------------------- */

                const stageRect = stage.getBoundingClientRect();
                const chipRect = chip.getBoundingClientRect();

                const activation =
                    document.createElement("div");

                activation.className =
                    "casino-chip-activation";

                const activationChip =
                    image(
                        ASSETS.chip,
                        "casino-chip-activation-chip",
                        "Активированная фишка"
                    );

                activationChip.style.pointerEvents = "auto";
                activationChip.style.cursor = "pointer";

                let doorTransitionStarted = false;

                activationChip.addEventListener("click", function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    // Переход только от настоящего клика мыши пользователя.
                    if (!event.isTrusted) {
                        return;
                    }

                    if (doorTransitionStarted) {
                        return;
                    }

                    doorTransitionStarted = true;

                    playCasinoDoorTransition(
                        root,
                        context,
                        "casino_magic_chips",
                        "Казино: вход в испытание Магические фишки"
                    );
                });

                activationChip.style.left =
                    (chipRect.left - stageRect.left) + "px";

                activationChip.style.top =
                    (chipRect.top - stageRect.top) + "px";

                activationChip.style.width =
                    chipRect.width + "px";

                const targetX =
                    (stageRect.width / 2) -
                    (chipRect.width / 2);

                const targetY =
                    (stageRect.height / 2) -
                    (chipRect.height / 2);

                const startX =
                    chipRect.left -
                    stageRect.left;

                const startY =
                    chipRect.top -
                    stageRect.top;

                activationChip.style.setProperty(
                    "--chip-dx",
                    (targetX - startX) + "px"
                );

                activationChip.style.setProperty(
                    "--chip-dy",
                    (targetY - startY) + "px"
                );

                activation.appendChild(
                    activationChip
                );

                stage.appendChild(
                    activation
                );

                /* Скрываем только оригинальную фишку.
                Её копия уже находится поверх неё. */

                chip.style.visibility =
                    "hidden";

                /* -------------------------------------------------
                ЗАПУСКАЕМ ПОЛЁТ ФИШКИ
                ------------------------------------------------- */

                requestAnimationFrame(function () {

                    requestAnimationFrame(function () {

                        activation.classList.add(
                            "is-started"
                        );

                        context.timeout(function () {
                            activationChip.classList.add("is-ready-to-click");
                        }, 1150);

                    });

                });
        
            }

            /* -------------------------------------------------
            АВТОМАТ
            ------------------------------------------------- */

            function distractGolem() {

                if (chipTaken || finished) {
                    return;
                }

                /*
                * Если Голем уже отвлечён —
                * повторно запускать звук не нужно.
                */
                if (golemDistracted) {
                    return;
                }

                golemDistracted = true;

                /*
                * Голем снова не спит.
                * Он просто переводит внимание на автомат.
                */
                golem.src = ASSETS.golemDistracted;

                golem.classList.remove("is-awake");
                golem.classList.add("is-distracted");

                /*
                * Запускаем jackpot.mp3 с начала.
                */
                jackpotSound.currentTime = 0;

                const playPromise = jackpotSound.play();

                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function (error) {
                        console.warn(
                            "Не удалось запустить jackpot.mp3:",
                            error
                        );
                    });
                }
            }

            chip.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                takeChip();
            });

            context.on(machineHotspot, "click", distractGolem);

            /* -------------------------------------------------
            СОБИРАЕМ СЦЕНУ
            ------------------------------------------------- */

            stage.append(
                golem,
                chip,
                machineHotspot
            );

            addHud(
                scene.screen,
                context,
                "Магическое казино"
            );

            root.appendChild(
                scene.screen
            );

            context.timeout(function () {

                    scene.screen.classList.add(
                        "casino-ready"
                    );

                },
                90
            );

            /* -------------------------------------------------
            ОЧИСТКА
            ------------------------------------------------- */

            scene.screen._casinoJackpotSound =
                jackpotSound;

        },

                unmount: function () {

                    const screen =
                        document.querySelector(
                            ".casino-magic-chips-golem-screen"
                        );

                    if (
                        screen &&
                        screen._casinoJackpotSound
                    ) {

                        screen._casinoJackpotSound.pause();
                        screen._casinoJackpotSound.currentTime = 0;
                    }
                }
    };

    /* =========================================================
    ИСПЫТАНИЕ 1 · МАГИЧЕСКИЕ ФИШКИ
    ========================================================= */

    game.scenes.casino_magic_chips = {

        id: "casino_magic_chips",

        mount: function (root, context) {

            game.state.patch({
                activePlayer: "taku"
            });

            /* =====================================================
            СОСТОЯНИЕ
            ===================================================== */

            let puzzle =
                game.state.get().casinoMagicChips;

            if (
                !puzzle ||
                !Array.isArray(puzzle.history)
            ) {

                puzzle = {
                    fakeChip:
                        Math.floor(Math.random() * 9) + 1,

                    magicType:
                        Math.random() < 0.5
                            ? "white"
                            : "black",

                    history: [],
                    wrongAnswers: 0,
                    solved: false
                };

                game.state.patch({
                    casinoMagicChips: puzzle
                });
            }

            /* =====================================================
            СЦЕНА
            ===================================================== */

            const scene =
                makeScreen(
                    "casino-magic-chips-screen",
                    ASSETS.magicChipsBg
                );

            const stage =
                scene.stage;

            /* =====================================================
            ЗВУКИ ИСПЫТАНИЯ
            ===================================================== */

            const magicScalesAmbientSound =
                new Audio(
                    "assets/audio/casino_magic_scales_ambient.mp3"
                );

            magicScalesAmbientSound.loop = true;
            magicScalesAmbientSound.volume = 0.18;

            const magicScalesTutorial =
                new Audio(
                    "assets/audio/casino_scales_chance_intro.mp3"
                );

            magicScalesTutorial.preload = "auto";

            /* =====================================================
            HEADER
            ===================================================== */

            const header =
                createSceneHeader(
                    "ИСПЫТАНИЕ 1 ИЗ 3",
                    "Испытание Весов",
                    "Найдите фишку, отличающуюся своей магией."
                );

            stage.appendChild(
                header
            );

            /* =====================================================
            ВЕСЫ
            ===================================================== */

            const scales =
                image(
                    ASSETS.magicScalesBalance,
                    "casino-magic-scales",
                    "Весы Магии"
                );

            stage.appendChild(
                scales
            );

            /* =====================================================
            ЭФФЕКТ МАГИИ
            ===================================================== */

            const magicEffect =
                image(
                    ASSETS.magicWhite,
                    "casino-magic-effect",
                    ""
                );

            magicEffect.style.display =
                "none";

            stage.appendChild(
                magicEffect
            );

            /* =====================================================
            СТАТУС
            ===================================================== */

            const status =
                document.createElement("div");

            status.className =
                "casino-magic-status";

            stage.appendChild(
                status
            );

            /* =====================================================
            ЖУРНАЛ
            ===================================================== */

            const journal =
                document.createElement("section");

            journal.className =
                "casino-magic-journal";

            journal.innerHTML =
                "<h2>ЖУРНАЛ ПРОВЕРОК</h2>" +
                "<div class=\"casino-magic-journal-body\"></div>";

            stage.appendChild(
                journal
            );

            const journalBody =
                journal.querySelector(
                    ".casino-magic-journal-body"
                );

            /* =====================================================
            9 ФИШЕК
            ===================================================== */

            const chipsField =
                document.createElement("div");

            chipsField.className =
                "casino-magic-chips-field";

            stage.appendChild(
                chipsField
            );

            const chips =
                new Map();

            for (
                let id = 1;
                id <= 9;
                id++
            ) {

                const button =
                    document.createElement("button");

                button.type =
                    "button";

                button.className =
                    "casino-magic-chip-button";

                button.dataset.chipId =
                    String(id);

                const chipImage =
                    image(
                        ASSETS.magicChip,
                        "casino-magic-chip-image",
                        "Фишка " + id
                    );

                const number =
                    document.createElement("span");

                number.className =
                    "casino-magic-chip-number";

                number.textContent =
                    String(id);

                button.append(
                    chipImage,
                    number
                );

                chipsField.appendChild(
                    button
                );

                chips.set(
                    id,
                    {
                        button: button,
                        side: null,
                        selected: false
                    }
                );
            }

            /* =====================================================
            ЧАШИ
            ===================================================== */

            const bowls =
                document.createElement("div");

            bowls.className =
                "casino-magic-bowls";

            const leftBowl =
                document.createElement("div");

            leftBowl.className =
                "casino-magic-bowl casino-magic-bowl-left";

            const rightBowl =
                document.createElement("div");

            rightBowl.className =
                "casino-magic-bowl casino-magic-bowl-right";

            bowls.append(
                leftBowl,
                rightBowl
            );

            stage.appendChild(
                bowls
            );

            /* =====================================================
            КНОПКИ
            ===================================================== */

            const controls =
                document.createElement("div");

            controls.className =
                "casino-magic-controls";

            const leftButton =
                game.mechanics.createButton(
                    "← ЛЕВАЯ ЧАША",
                    "gold-button casino-magic-control"
                );

            const rightButton =
                game.mechanics.createButton(
                    "ПРАВАЯ ЧАША →",
                    "gold-button casino-magic-control"
                );

            const resetButton =
                game.mechanics.createButton(
                    "СБРОСИТЬ",
                    "ghost-button casino-magic-control"
                );

            const weighButton =
                game.mechanics.createButton(
                    "ВЗВЕСИТЬ",
                    "gold-button casino-magic-weigh"
                );

            controls.append(
                leftButton,
                rightButton,
                resetButton,
                weighButton
            );

            stage.appendChild(
                controls
            );

            /* =====================================================
            РЕЗУЛЬТАТ
            ===================================================== */

            const result =
                document.createElement("div");

            result.className =
                "casino-magic-result";

            stage.appendChild(
                result
            );

            /* =====================================================
            ФИНАЛЬНЫЙ ОТВЕТ
            ===================================================== */

            const answerPanel =
                document.createElement("div");

            answerPanel.className =
                "casino-magic-answer";

            answerPanel.style.display =
                "none";

            answerPanel.innerHTML =
                "<h2>КАКАЯ ФИШКА ФАЛЬШИВАЯ?</h2>" +
                "<p>Выберите номер и тип магии.</p>";

            const answerNumbers =
                document.createElement("div");

            answerNumbers.className =
                "casino-magic-answer-numbers";

            const answerMagic =
                document.createElement("div");

            answerMagic.className =
                "casino-magic-answer-magic";

            const whiteButton =
                game.mechanics.createButton(
                    "БЕЛАЯ МАГИЯ",
                    "gold-button casino-magic-choice"
                );

            const blackButton =
                game.mechanics.createButton(
                    "ЧЁРНАЯ МАГИЯ",
                    "gold-button casino-magic-choice"
                );

            const confirmButton =
                game.mechanics.createButton(
                    "ПРОВЕРИТЬ",
                    "gold-button casino-magic-confirm"
                );

            answerMagic.append(
                whiteButton,
                blackButton
            );

            answerPanel.append(
                answerNumbers,
                answerMagic,
                confirmButton
            );

            stage.appendChild(
                answerPanel
            );

            let selectedAnswerChip =
                null;

            let selectedAnswerMagic =
                null;

            /* =====================================================
            ЖУРНАЛ
            ===================================================== */

            function renderJournal() {

                journalBody.innerHTML =
                    "";

                if (
                    puzzle.history.length === 0
                ) {

                    const empty =
                        document.createElement("div");

                    empty.className =
                        "casino-magic-journal-empty";

                    empty.textContent =
                        "Проверок пока нет.";

                    journalBody.appendChild(
                        empty
                    );

                    return;
                }

                puzzle.history.forEach(
                    function (entry, index) {

                        const row =
                            document.createElement("div");

                        row.className =
                            "casino-magic-journal-row";

                        row.innerHTML =
                            "<span>" +
                            (index + 1) +
                            ". " +
                            entry.count +
                            " × " +
                            entry.count +
                            "</span>" +
                            "<strong>" +
                            entry.result +
                            "</strong>";

                        journalBody.appendChild(
                            row
                        );
                    }
                );
            }

            renderJournal();

            /* =====================================================
            ПЕРЕСОЗДАНИЕ СТОПОК
            ===================================================== */

            function rebuildBowls() {

                leftBowl.innerHTML =
                    "";

                rightBowl.innerHTML =
                    "";

                const left =
                    [];

                const right =
                    [];

                chips.forEach(
                    function (item, id) {

                        if (
                            item.side === "left"
                        ) {
                            left.push(id);
                        }

                        if (
                            item.side === "right"
                        ) {
                            right.push(id);
                        }
                    }
                );

                left.forEach(
                    function (id, index) {

                        const sideChip =
                            image(
                                ASSETS.magicChipSide,
                                "casino-magic-bowl-chip",
                                "Фишка " + id
                            );

                        sideChip.style.setProperty(
                            "--stack-index",
                            String(index)
                        );

                        leftBowl.appendChild(
                            sideChip
                        );
                    }
                );

                right.forEach(
                    function (id, index) {

                        const sideChip =
                            image(
                                ASSETS.magicChipSide,
                                "casino-magic-bowl-chip",
                                "Фишка " + id
                            );

                        sideChip.style.setProperty(
                            "--stack-index",
                            String(index)
                        );

                        rightBowl.appendChild(
                            sideChip
                        );
                    }
                );
            }

            /* =====================================================
            СТАТУС
            ===================================================== */

            function updateControls() {

                let leftCount = 0;
                let rightCount = 0;

                chips.forEach(
                    function (item) {

                        if (
                            item.side === "left"
                        ) {
                            leftCount++;
                        }

                        if (
                            item.side === "right"
                        ) {
                            rightCount++;
                        }
                    }
                );

                leftButton.disabled =
                    leftCount >= 3;

                rightButton.disabled =
                    rightCount >= 3;

                weighButton.disabled =
                    !(
                        leftCount > 0 &&
                        leftCount === rightCount
                    );

                resetButton.disabled =
                    (
                        leftCount === 0 &&
                        rightCount === 0
                    );

                status.textContent =
                    "ЛЕВАЯ: " +
                    leftCount +
                    "  ·  ПРАВАЯ: " +
                    rightCount +
                    "  ·  ПРОВЕРКА " +
                    (puzzle.history.length + 1) +
                    " / 3";
            }

            /* =====================================================
            ВЫБОР ФИШКИ
            ===================================================== */

            chips.forEach(
                function (item) {

                    context.on(
                        item.button,
                        "click",
                        function () {

                            if (
                                item.side
                            ) {
                                return;
                            }

                            item.selected =
                                !item.selected;

                            item.button.classList.toggle(
                                "is-selected",
                                item.selected
                            );
                        }
                    );
                }
            );

            /* =====================================================
            ПЕРЕМЕСТИТЬ В ЛЕВУЮ ЧАШУ
            ===================================================== */

            context.on(
                leftButton,
                "click",
                function () {

                    const selected =
                        [];

                    chips.forEach(
                        function (item, id) {

                            if (
                                item.selected &&
                                !item.side
                            ) {
                                selected.push(id);
                            }
                        }
                    );

                    let existing =
                        0;

                    chips.forEach(
                        function (item) {

                            if (
                                item.side ===
                                "left"
                            ) {
                                existing++;
                            }
                        }
                    );

                    if (
                        existing +
                        selected.length >
                        3
                    ) {
                        return;
                    }

                    selected.forEach(
                        function (id) {

                            const item =
                                chips.get(id);

                            item.side =
                                "left";

                            item.selected =
                                false;

                            item.button.classList.remove(
                                "is-selected"
                            );

                            item.button.classList.add(
                                "is-on-bowl"
                            );
                        }
                    );

                    rebuildBowls();
                    updateControls();
                }
            );

            /* =====================================================
            ПЕРЕМЕСТИТЬ В ПРАВУЮ ЧАШУ
            ===================================================== */

            context.on(
                rightButton,
                "click",
                function () {

                    const selected =
                        [];

                    chips.forEach(
                        function (item, id) {

                            if (
                                item.selected &&
                                !item.side
                            ) {
                                selected.push(id);
                            }
                        }
                    );

                    let existing =
                        0;

                    chips.forEach(
                        function (item) {

                            if (
                                item.side ===
                                "right"
                            ) {
                                existing++;
                            }
                        }
                    );

                    if (
                        existing +
                        selected.length >
                        3
                    ) {
                        return;
                    }

                    selected.forEach(
                        function (id) {

                            const item =
                                chips.get(id);

                            item.side =
                                "right";

                            item.selected =
                                false;

                            item.button.classList.remove(
                                "is-selected"
                            );

                            item.button.classList.add(
                                "is-on-bowl"
                            );
                        }
                    );

                    rebuildBowls();
                    updateControls();
                }
            );

            /* =====================================================
            СБРОС
            ===================================================== */

            context.on(
                resetButton,
                "click",
                function () {

                    chips.forEach(
                        function (item) {

                            item.side =
                                null;

                            item.selected =
                                false;

                            item.button.classList.remove(
                                "is-selected",
                                "is-on-bowl"
                            );
                        }
                    );

                    result.className =
                        "casino-magic-result";

                    result.textContent =
                        "";

                    scales.src =
                        ASSETS.magicScalesBalance;

                    magicEffect.style.display =
                        "none";

                    rebuildBowls();
                    updateControls();
                }
            );

            /* =====================================================
            ВЗВЕШИВАНИЕ
            ===================================================== */

            context.on(
                weighButton,
                "click",
                function () {

                    if (
                        puzzle.history.length >= 3
                    ) {
                        return;
                    }

                    let leftCount = 0;
                    let rightCount = 0;

                    let fakeLeft =
                        false;

                    let fakeRight =
                        false;

                    chips.forEach(
                        function (item, id) {

                            if (
                                item.side === "left"
                            ) {

                                leftCount++;

                                if (
                                    id ===
                                    puzzle.fakeChip
                                ) {
                                    fakeLeft =
                                        true;
                                }
                            }

                            if (
                                item.side === "right"
                            ) {

                                rightCount++;

                                if (
                                    id ===
                                    puzzle.fakeChip
                                ) {
                                    fakeRight =
                                        true;
                                }
                            }
                        }
                    );

                    if (
                        leftCount === 0 ||
                        leftCount !== rightCount
                    ) {
                        return;
                    }

                    let scaleState =
                        ASSETS.magicScalesBalance;

                    let checkResult =
                        "МАГИЯ РАВНА";

                    let effectSide =
                        null;

                    if (fakeLeft) {

                        effectSide =
                            "left";

                        if (
                            puzzle.magicType ===
                            "white"
                        ) {

                            checkResult =
                                "ЛЕВАЯ ЧАША СИЛЬНЕЕ";

                            scaleState =
                                ASSETS.magicScalesLeft;

                        } else {

                            checkResult =
                                "ПРАВАЯ ЧАША СИЛЬНЕЕ";

                            scaleState =
                                ASSETS.magicScalesRight;
                        }
                    }

                    if (fakeRight) {

                        effectSide =
                            "right";

                        if (
                            puzzle.magicType ===
                            "white"
                        ) {

                            checkResult =
                                "ПРАВАЯ ЧАША СИЛЬНЕЕ";

                            scaleState =
                                ASSETS.magicScalesRight;

                        } else {

                            checkResult =
                                "ЛЕВАЯ ЧАША СИЛЬНЕЕ";

                            scaleState =
                                ASSETS.magicScalesLeft;
                        }
                    }

                    scales.src =
                        scaleState;

                    result.textContent =
                        checkResult;

                    result.classList.add(
                        "is-visible"
                    );

                    if (
                        effectSide
                    ) {

                        magicEffect.src =
                            puzzle.magicType ===
                                "white"
                                ? ASSETS.magicWhite
                                : ASSETS.magicBlack;

                        magicEffect.className =
                            "casino-magic-effect " +
                            "is-visible " +
                            "is-" +
                            effectSide;

                        magicEffect.style.display =
                            "";
                    }

                    puzzle.history.push({
                        count:
                            leftCount,

                        result:
                            checkResult
                    });

                    game.state.patch({
                        casinoMagicChips:
                            puzzle
                    });

                    game.save.write(
                        "Казино: проверка Магических фишек №" +
                        puzzle.history.length +
                        " — " +
                        checkResult
                    );

                    renderJournal();

                    leftButton.disabled =
                        true;

                    rightButton.disabled =
                        true;

                    resetButton.disabled =
                        true;

                    weighButton.disabled =
                        true;

                    context.timeout(
                        function () {

                            scales.src =
                                ASSETS.magicScalesBalance;

                            magicEffect.style.display =
                                "none";

                            result.className =
                                "casino-magic-result";

                            result.textContent =
                                "";

                            chips.forEach(
                                function (item) {

                                    item.side =
                                        null;

                                    item.selected =
                                        false;

                                    item.button.classList.remove(
                                        "is-selected",
                                        "is-on-bowl"
                                    );
                                }
                            );

                            rebuildBowls();

                            if (
                                puzzle.history.length >= 3
                            ) {

                                openFinalAnswer();

                            } else {

                                updateControls();

                            }

                        },
                        1200
                    );
                }
            );

            /* =====================================================
            ФИНАЛЬНЫЙ ОТВЕТ
            ===================================================== */

            function openFinalAnswer() {

                controls.style.display =
                    "none";

                answerPanel.style.display =
                    "";

                status.textContent =
                    "Три проверки завершены. Назовите фальшивую фишку.";

                answerNumbers.innerHTML =
                    "";

                for (
                    let i = 1;
                    i <= 9;
                    i++
                ) {

                    const button =
                        game.mechanics.createButton(
                            String(i),
                            "gold-button casino-magic-number"
                        );

                    context.on(
                        button,
                        "click",
                        function () {

                            selectedAnswerChip =
                                i;

                            answerNumbers
                                .querySelectorAll(
                                    ".casino-magic-number"
                                )
                                .forEach(
                                    function (node) {

                                        node.classList.remove(
                                            "is-selected"
                                        );
                                    }
                                );

                            button.classList.add(
                                "is-selected"
                            );
                        }
                    );

                    answerNumbers.appendChild(
                        button
                    );
                }
            }

            context.on(
                whiteButton,
                "click",
                function () {

                    selectedAnswerMagic =
                        "white";

                    whiteButton.classList.add(
                        "is-selected"
                    );

                    blackButton.classList.remove(
                        "is-selected"
                    );
                }
            );

            context.on(
                blackButton,
                "click",
                function () {

                    selectedAnswerMagic =
                        "black";

                    blackButton.classList.add(
                        "is-selected"
                    );

                    whiteButton.classList.remove(
                        "is-selected"
                    );
                }
            );

            context.on(
                confirmButton,
                "click",
                function () {

                    if (
                        !selectedAnswerChip ||
                        !selectedAnswerMagic
                    ) {
                        return;
                    }

                    const correct =
                        selectedAnswerChip ===
                            puzzle.fakeChip &&
                        selectedAnswerMagic ===
                            puzzle.magicType;

                    if (correct) {

                        puzzle.solved =
                            true;

                        game.state.patch({
                            casinoMagicChips:
                                puzzle
                        });

                        setCasinoProgress(
                            1,
                            "Казино: испытание «Магические фишки» пройдено"
                        );

                        result.className =
                            "casino-magic-result " +
                            "is-visible is-success casino-blackjack-invite";

                        result.innerHTML =
                            "<h2>НЕПЛОХО.</h2>" +
                            "<p>" +
                            "Вы нашли неправильную фишку и помогли казино." +
                            "</p>" +
                            "<p>" +
                            "За это мы приглашаем вас на эксклюзивную игру" +
                            "</p>" +
                            "<h3>МАГИЧЕСКИЙ БЛЭКДЖЕК</h3>" +
                            "<p>" +
                            "Вот вам одна фишка." +
                            "<br>" +
                            "Её примут как одну ставку." +
                            "</p>";

                        answerPanel.style.display =
                            "none";

                        controls.style.display =
                            "none";

                        const blackjackAcceptButton =
                            game.mechanics.createButton(
                                "СОГЛАСИТЬСЯ",
                                "gold-button casino-blackjack-accept"
                            );

                        context.on(
                            blackjackAcceptButton,
                            "click",
                            function () {

                                if (
                                    blackjackAcceptButton.disabled
                                ) {
                                    return;
                                }

                                blackjackAcceptButton.disabled = true;

                                /*
                                * Награда за первое испытание:
                                * одна фишка = одна ставка в Блэкджеке.
                                */
                                game.state.patch({
                                    casinoBlackjack: {
                                        betChips: 1,
                                        firstChipWon: true
                                    }
                                });

                                game.save.write(
                                    "Казино: получена фишка для Магического блэкджека"
                                );

                                /*
                                * Сначала видео двери,
                                * затем новая сцена.
                                */
                                playCasinoDoorTransition(
                                    root,
                                    context,
                                    "casino_blackjack",
                                    "Казино: приглашение на Магический блэкджек принято"
                                );
                            }
                        );

                        result.appendChild(
                            blackjackAcceptButton
                        );

                        return;
                    }

                    puzzle.wrongAnswers +=
                        1;

                    game.state.patch({
                        casinoMagicChips:
                            puzzle
                    });

                    result.textContent =
                        "НЕВЕРНО · ПОПЫТКА " +
                        puzzle.wrongAnswers +
                        " / 3";

                    result.className =
                        "casino-magic-result " +
                        "is-visible is-error";

                    if (
                        puzzle.wrongAnswers >= 3
                    ) {

                        context.timeout(
                            function () {

                                puzzle = {
                                    fakeChip:
                                        Math.floor(
                                            Math.random() * 9
                                        ) + 1,

                                    magicType:
                                        Math.random() < 0.5
                                            ? "white"
                                            : "black",

                                    history: [],
                                    wrongAnswers: 0,
                                    solved: false
                                };

                                game.state.patch({
                                    casinoMagicChips:
                                        puzzle
                                });

                                selectedAnswerChip =
                                    null;

                                selectedAnswerMagic =
                                    null;

                                answerPanel.style.display =
                                    "none";

                                controls.style.display =
                                    "flex";

                                whiteButton.classList.remove(
                                    "is-selected"
                                );

                                blackButton.classList.remove(
                                    "is-selected"
                                );

                                result.className =
                                    "casino-magic-result";

                                result.textContent =
                                    "";

                                scales.src =
                                    ASSETS.magicScalesBalance;

                                magicEffect.style.display =
                                    "none";

                                renderJournal();
                                rebuildBowls();
                                updateControls();

                            },
                            1000
                        );
                    }
                }
            );

            /* =====================================================
            HUD + ЗАПУСК
            ===================================================== */

            addHud(
                scene.screen,
                context,
                "Магическое казино"
            );

            root.appendChild(
                scene.screen
            );

            /* -----------------------------------------------------
            СОХРАНЯЕМ ЗВУКИ НА ЭКРАНЕ
            ----------------------------------------------------- */

            scene.screen._magicScalesAmbientSound =
                magicScalesAmbientSound;

            scene.screen._magicScalesTutorial =
                magicScalesTutorial;

            /* -----------------------------------------------------
            ПОКА ИДЁТ ОБУЧЕНИЕ — ИГРА ЗАБЛОКИРОВАНА
            ----------------------------------------------------- */

            chipsField.style.pointerEvents = "none";
            controls.style.pointerEvents = "none";
            answerPanel.style.pointerEvents = "none";

            updateControls();

            /* -----------------------------------------------------
            КОГДА ОБУЧЕНИЕ ЗАКОНЧИЛОСЬ — РАЗБЛОКИРУЕМ ИГРУ
            ----------------------------------------------------- */

            magicScalesTutorial.addEventListener(
                "ended",
                function () {

                    chipsField.style.pointerEvents = "";
                    controls.style.pointerEvents = "";
                    answerPanel.style.pointerEvents = "";

                    updateControls();

                },
                { once: true }
            );

            /* -----------------------------------------------------
            ЗАПУСК
            ----------------------------------------------------- */

            context.timeout(
                function () {

                    scene.screen.classList.add(
                        "casino-ready"
                    );

                    magicScalesAmbientSound.currentTime = 0;

                    const ambientPlayPromise =
                        magicScalesAmbientSound.play();

                    if (
                        ambientPlayPromise &&
                        typeof ambientPlayPromise.catch === "function"
                    ) {

                        ambientPlayPromise.catch(function (error) {

                            console.warn(
                                "Не удалось запустить casino_magic_scales_ambient.mp3:",
                                error
                            );

                        });

                    }

                    magicScalesTutorial.currentTime = 0;

                    const tutorialPlayPromise =
                        magicScalesTutorial.play();

                    if (
                        tutorialPlayPromise &&
                        typeof tutorialPlayPromise.catch === "function"
                    ) {

                        tutorialPlayPromise.catch(function (error) {

                            console.warn(
                                "Не удалось запустить casino_scales_chance_intro.mp3:",
                                error
                            );

                            chipsField.style.pointerEvents = "";
                            controls.style.pointerEvents = "";
                            answerPanel.style.pointerEvents = "";

                            updateControls();

                        });

                    }

                },
                90
            );
            },

            unmount: function () {

                const screen =
                    document.querySelector(
                        ".casino-magic-chips-screen"
                    );

                if (
                    screen &&
                    screen._magicScalesAmbientSound
                ) {

                    screen._magicScalesAmbientSound.pause();
                    screen._magicScalesAmbientSound.currentTime = 0;
                }

                if (
                    screen &&
                    screen._magicScalesTutorial
                ) {

                    screen._magicScalesTutorial.pause();
                    screen._magicScalesTutorial.currentTime = 0;
                }
            }
    };

    /* =========================================================
    ИГРА 2 · МАГИЧЕСКИЙ БЛЭКДЖЕК
    ========================================================= */

    game.scenes.casino_blackjack = {

        id: "casino_blackjack",

        mount: function (root, context) {

            game.state.patch({
                activePlayer: "tuko"
            });

            const saved =
                game.state.get().casinoBlackjack || {};

            const blackjackState = {

                round:
                    Number(saved.round) || 1,

                betChips:
                    Number(saved.betChips) || 1,

                firstUnder21Used:
                    !!saved.firstUnder21Used,

                completed:
                    !!saved.completed
            };

            game.state.patch({
                casinoBlackjack:
                    blackjackState
            });

            const scene =
                makeScreen(
                    "casino-blackjack-screen",
                    ASSETS.blackjackBg
                );

            const stage =
                scene.stage;

            /* =====================================================
            ФОНОВАЯ МУЗЫКА КАЗИНО
            Играет всю сцену Блэкджек
            ===================================================== */

            const casinoBackgroundSound =
                new Audio(
                    "assets/audio/kazino.mp3"
                );

            casinoBackgroundSound.preload =
                "auto";

            casinoBackgroundSound.loop =
                true;

            casinoBackgroundSound.volume =
                0.28;

            /* =====================================================
            НАСТРОЙКИ РАЗДАЧИ
            ===================================================== */

            /*
            * Ставим достаточно длинную паузу,
            * чтобы движение крупье было заметно.
            *
            * Потом будем спокойно подгонять
            * под реальную скорость картинки.
            */

            const DEALER_CARD_HOLD = 520;
            const DEALER_AFTER_CARD = 180;
            const CARD_REVEAL_DELAY = 60;

            /* =====================================================
            ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
            ===================================================== */

            function wait(ms) {

                return new Promise(function (resolve) {

                    context.timeout(
                        resolve,
                        ms
                    );

                });

            }

            function clearNode(node) {

                while (
                    node &&
                    node.firstChild
                ) {

                    node.removeChild(
                        node.firstChild
                    );
                }
            }

            let introSkipRequested = false;
            let activeIntroFinish = null;

            function waitIntro(ms) {

                if (introSkipRequested) {
                    return Promise.resolve();
                }

                return wait(ms);
            }

            function playLine(
                file,
                speakingImage,
                idleImage,
                talkImage,
                volume,
                gain
            ) {

                return new Promise(function (resolve) {

                    if (introSkipRequested) {
                        resolve();
                        return;
                    }

                    const audio =
                        game.audio.playVoice(
                            "assets/audio/" + file
                        );

                    if (!audio) {
                        resolve();
                        return;
                    }

                    audio.volume =
                        volume === undefined
                            ? 1.0
                            : volume;

                    if (
                        gain !== undefined &&
                        gain > 1
                    ) {
                        boostVoiceAudio(
                            audio,
                            gain
                        );
                    }

                    if (
                        speakingImage &&
                        talkImage
                    ) {

                        speakingImage.src =
                            talkImage;

                        speakingImage.classList.add(
                            "is-talking"
                        );
                    }

                    let finished = false;
                    let fallbackTimer = null;

                    function finish() {

                        if (finished) {
                            return;
                        }

                        finished = true;

                        if (fallbackTimer) {
                            clearTimeout(fallbackTimer);
                            fallbackTimer = null;
                        }

                        if (
                            speakingImage &&
                            idleImage
                        ) {

                            speakingImage.src =
                                idleImage;

                            speakingImage.classList.remove(
                                "is-talking"
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

                        audio.removeEventListener(
                            "loadedmetadata",
                            checkDuration
                        );

                        if (
                            activeIntroFinish === finish
                        ) {

                            activeIntroFinish = null;
                        }

                        resolve();
                    }

                    function checkDuration() {

                        /*
                        * Если браузер уже знает длину файла,
                        * ставим страховочный таймер.
                        */
                        if (
                            Number.isFinite(audio.duration) &&
                            audio.duration > 0
                        ) {

                            fallbackTimer =
                                setTimeout(
                                    function () {

                                        if (!finished) {

                                            console.warn(
                                                "Страховка завершила реплику:",
                                                file
                                            );

                                            finish();
                                        }

                                    },
                                    (audio.duration * 1000) + 2000
                                );
                        }
                    }

                    activeIntroFinish =
                        finish;

                    audio.addEventListener(
                        "ended",
                        finish
                    );

                    audio.addEventListener(
                        "error",
                        function (error) {

                            console.warn(
                                "Ошибка аудио:",
                                file,
                                error
                            );

                            finish();
                        }
                    );

                    audio.addEventListener(
                        "loadedmetadata",
                        checkDuration
                    );

                    /*
                    * На случай, если аудио уже успело
                    * закончиться до установки listeners.
                    */
                    if (
                        audio.ended ||
                        (
                            Number.isFinite(audio.duration) &&
                            audio.duration > 0 &&
                            audio.currentTime >=
                                audio.duration - 0.05
                        )
                    ) {

                        finish();
                        return;
                    }

                    /*
                    * Дополнительно убеждаемся,
                    * что воспроизведение действительно запущено.
                    */
                    try {

                        const playPromise =
                            audio.play();

                        if (
                            playPromise &&
                            typeof playPromise.catch === "function"
                        ) {

                            playPromise.catch(
                                function (error) {

                                    console.warn(
                                        "Не удалось воспроизвести:",
                                        file,
                                        error
                                    );

                                    /*
                                    * Главное — не оставить сцену
                                    * навечно ждать этот звук.
                                    */
                                    finish();
                                }
                            );
                        }

                    } catch (error) {

                        console.warn(
                            "Ошибка запуска аудио:",
                            file,
                            error
                        );

                        finish();
                    }

                });

            }

            async function playDealerBlackjackWin() {

                const oldCasinoVolume =
                    casinoBackgroundSound.volume;

                casinoBackgroundSound.volume =
                    0.08;

                await playLine(
                    "dealer_blackjack_win.mp3"
                );

                casinoBackgroundSound.volume =
                    oldCasinoVolume;
            }

            function setReaction(
                zone,
                text,
                type
            ) {

                if (!zone.reaction) {
                    return;
                }

                zone.reaction.textContent =
                    text || "";

                zone.reaction.className =
                    "casino-blackjack-reaction";

                if (type) {

                    zone.reaction.classList.add(
                        "is-" + type
                    );
                }

                zone.reaction.classList.add(
                    "is-visible"
                );
            }

            function hideReaction(zone) {

                if (!zone.reaction) {
                    return;
                }

                zone.reaction.classList.remove(
                    "is-visible"
                );
            }

            function updateScore(
                zone,
                value
            ) {

                zone.value =
                    value;

                zone.score.textContent =
                    String(value);

                zone.score.classList.remove(
                    "is-win",
                    "is-bust",
                    "is-hot"
                );

                if (value === 21) {

                    zone.score.classList.add(
                        "is-win"
                    );

                } else if (value > 21) {

                    zone.score.classList.add(
                        "is-bust"
                    );

                } else if (value >= 18) {

                    zone.score.classList.add(
                        "is-hot"
                    );
                }
            }

            function saveState(
                reason
            ) {

                game.state.patch({

                    casinoBlackjack:
                        Object.assign(
                            {},
                            blackjackState
                        )
                });

                game.save.write(
                    reason ||
                    "Казино: прогресс Магического блэкджека"
                );
            }

            /* =====================================================
            ЗОНА ИГРОКА
            ===================================================== */

            function createPlayerZone(
                className,
                title
            ) {

                const zone =
                    document.createElement(
                        "section"
                    );

                zone.className =
                    "casino-blackjack-zone " +
                    className;

                const titleNode =
                    document.createElement(
                        "div"
                    );

                titleNode.className =
                    "casino-blackjack-zone-title";

                titleNode.textContent =
                    title;

                const scoreNode =
                    document.createElement(
                        "div"
                    );

                scoreNode.className =
                    "casino-blackjack-zone-score";

                scoreNode.textContent =
                    "0";

                const cards =
                    document.createElement(
                        "div"
                    );

                cards.className =
                    "casino-blackjack-cards";

                const reaction =
                    document.createElement(
                        "div"
                    );

                reaction.className =
                    "casino-blackjack-reaction";

                zone.append(
                    titleNode,
                    cards,
                    scoreNode,
                    reaction
                );

                stage.appendChild(
                    zone
                );

                return {

                    root: zone,

                    cards: cards,

                    score: scoreNode,

                    reaction: reaction,

                    value: 0
                };
            }

            const pirate =
                createPlayerZone(
                    "is-pirate",
                    "ПИРАТ"
                );

            const robot =
                createPlayerZone(
                    "is-robot",
                    "РОБОТ"
                );

            const dealerZone =
                createPlayerZone(
                    "is-dealer",
                    "КРУПЬЕ"
                );
            dealerZone.score.style.display = "none";

            const tuko =
                createPlayerZone(
                    "is-tuko",
                    "ТАКУ"
                );

            /* =====================================================
            ПЕРСОНАЖИ
            ===================================================== */

            const pirateImg =
                image(
                    ASSETS.blackjackPirateIdle,
                    "casino-blackjack-pirate",
                    "Пират"
                );

            const robotImg =
                image(
                    ASSETS.blackjackRobotIdle,
                    "casino-blackjack-robot",
                    "Робот"
                );

            const dealerImg =
                image(
                    ASSETS.blackjackDealerIdle,
                    "casino-blackjack-dealer",
                    "Крупье"
                );

            pirateImg.draggable =
                false;

            robotImg.draggable =
                false;

            dealerImg.draggable =
                false;

            stage.append(
                pirateImg,
                dealerImg,
                robotImg
            );

            /* =====================================================
            HEADER СЦЕНЫ
            ===================================================== */

            const header =
                createSceneHeader(
                    "ИГРА 2 ИЗ 3",
                    "Магический Блэкджек",
                    "РАУНД 1 · ТАКУ · ПИРАТ · РОБОТ"
                );

            stage.appendChild(
                header
            );

            /*
            * Используем строку header вместо
            * отдельного центрального status.
            * Весь существующий код ниже,
            * который меняет status.textContent,
            * продолжит работать.
            */

            const status =
                header.querySelector(
                    "span"
                );

            const chipsCounter =
                document.createElement(
                    "div"
                );

            chipsCounter.className =
                "casino-blackjack-chip-counter";

            stage.appendChild(
                chipsCounter
            );

            const message =
                document.createElement(
                    "div"
                );

            message.className =
                "casino-blackjack-message";

            stage.appendChild(
                message
            );

            const controls =
                document.createElement(
                    "div"
                );

            controls.className =
                "casino-blackjack-controls";

            stage.appendChild(
                controls
            );

            const resultPanel =
                document.createElement(
                    "div"
                );

            resultPanel.className =
                "casino-blackjack-result-panel";

            stage.appendChild(
                resultPanel
            );

            const stakeChip =
                image(
                    ASSETS.magicChip,
                    "casino-blackjack-stake-chip",
                    "Фишка ставки"
                );

            stakeChip.style.display =
                "none";

            stage.appendChild(
                stakeChip
            );

            const secondStakeChip =
                image(
                    ASSETS.magicChip,
                    "casino-blackjack-stake-chip casino-blackjack-second-stake-chip",
                    "Вторая фишка ставки"
                );

            secondStakeChip.style.display =
                "none";

            stage.appendChild(
                secondStakeChip
            );

            const stichBlocking =
                image(
                    ASSETS.stichBlocking,
                    "casino-blackjack-stich-blocking",
                    "Стич блокирует следующую карту"
                );

            stichBlocking.style.display =
                "none";

            stage.appendChild(
                stichBlocking
            );

            scene.screen._casinoBackgroundSound =
                casinoBackgroundSound;

            const backgroundPlayPromise =
                casinoBackgroundSound.play();

            if (
                backgroundPlayPromise &&
                typeof backgroundPlayPromise.catch === "function"
            ) {
                backgroundPlayPromise.catch(
                    function (error) {
                        console.warn(
                            "Не удалось запустить kazino.mp3:",
                            error
                        );
                    }
                );
            }

            /* =====================================================
            СЛУЖЕБНЫЕ ФУНКЦИИ UI
            ===================================================== */

            function setMessage(
                text,
                type
            ) {

                message.textContent =
                    text || "";

                message.className =
                    "casino-blackjack-message";

                if (type) {

                    message.classList.add(
                        "is-" + type
                    );
                }
            }

            function clearControls() {

                clearNode(
                    controls
                );
            }

            function addControl(
                label,
                className
            ) {

                const button =
                    game.mechanics.createButton(
                        label,
                        className ||
                        "gold-button"
                    );

                controls.appendChild(
                    button
                );

                return button;
            }

            function showNextButton(
                label,
                callback
            ) {

                clearControls();

                const next =
                    addControl(
                        label,
                        "gold-button casino-blackjack-next-button"
                    );

                context.on(
                    next,
                    "click",
                    callback
                );

                next.focus();
            }

            function updateChips() {

                chipsCounter.textContent =
                    "ФИШКИ: " +
                    blackjackState.betChips;
            }

            async function placeInitialStake() {

                clearControls();

                setMessage(
                    "Поставьте полученную фишку на стол."
                );

                /* =================================================
                ФИШКА ДО КЛИКА НЕ ПОКАЗЫВАЕТСЯ
                ================================================= */

                stakeChip.style.display =
                    "none";

                stakeChip.classList.remove(
                    "is-visible",
                    "is-placed"
                );

                /* =================================================
                КНОПКА
                ================================================= */

                const placeButton =
                    addControl(
                        "ПОСТАВИТЬ ФИШКУ",
                        "gold-button"
                    );

                await new Promise(
                    function (resolve) {

                        context.on(
                            placeButton,
                            "click",
                            async function () {

                                if (
                                    placeButton.disabled
                                ) {
                                    return;
                                }

                                placeButton.disabled =
                                    true;

                                /* =================================
                                ПОКАЗЫВАЕМ ФИШКУ НА СТОЛЕ
                                ================================= */

                                stakeChip.style.display =
                                    "block";

                                stakeChip.classList.add(
                                    "is-placed"
                                );

                                setMessage(
                                    "Ставка принята."
                                );

                                await wait(
                                    750
                                );

                                clearControls();

                                resolve();

                            }
                        );

                    }
                );
            }

            /* =====================================================
            КАРТЫ
            ===================================================== */

            function makeCardImage(
                data,
                extraClass
            ) {

                const card =
                    image(
                        data.image,
                        "casino-blackjack-card" +
                        (
                            extraClass
                                ? " " + extraClass
                                : ""
                        ),
                        data.label
                    );

                card.draggable =
                    false;

                card.style.setProperty(
                    "--card-rotate",
                    (
                        Math.random() * 4 - 2
                    ).toFixed(2) + "deg"
                );

                return card;
            }

            function addCard(
                zone,
                cardId,
                instant
            ) {

                const data =
                    BLACKJACK_CARD_DATA[
                        cardId
                    ];

                if (!data) {
                    return null;
                }

                const card =
                    makeCardImage(
                        data
                    );

                card.dataset.cardId =
                    cardId;

                zone.cards.appendChild(
                    card
                );

                if (instant) {

                    card.classList.add(
                        "is-visible"
                    );

                } else {

                    context.timeout(
                        function () {

                            card.classList.add(
                                "is-visible"
                            );

                        },
                        CARD_REVEAL_DELAY
                    );
                }

                return card;
            }

            function addSpecial(
                zone,
                specialId,
                instant
            ) {

                const data =
                    BLACKJACK_SPECIALS[
                        specialId
                    ];

                if (!data) {
                    return null;
                }

                const card =
                    makeCardImage(
                        data,
                        "casino-blackjack-special-card"
                    );

                card.dataset.special =
                    specialId;

                zone.cards.appendChild(
                    card
                );

                function revealSpecialCard() {

                    card.classList.add(
                        "is-visible"
                    );

                    /*
                    * Звук появления магической карты:
                    * Джокер / Белая магия / Чёрная магия.
                    */

                    const revealSound =
                        new Audio(
                            "assets/audio/card_reveal.mp3"
                        );

                    revealSound.preload =
                        "auto";

                    revealSound.volume =
                        1.0;

                    revealSound.currentTime =
                        0;

                    const playPromise =
                        revealSound.play();

                    if (
                        playPromise &&
                        typeof playPromise.catch === "function"
                    ) {
                        playPromise.catch(
                            function (error) {

                                console.warn(
                                    "Не удалось запустить card_reveal.mp3:",
                                    error
                                );

                            }
                        );
                    }
                }

                if (instant) {

                    revealSpecialCard();

                } else {

                    context.timeout(
                        function () {

                            revealSpecialCard();

                        },
                        CARD_REVEAL_DELAY
                    );
                }

                return card;
            }

            async function dealCard(
                zone,
                cardId
            ) {

                const oneCardSound =
                    new Audio(
                        "assets/audio/one_card.mp3"
                    );

                oneCardSound.preload =
                    "auto";

                oneCardSound.currentTime =
                    0;

                const oneCardPlayPromise =
                    oneCardSound.play();

                if (
                    oneCardPlayPromise &&
                    typeof oneCardPlayPromise.catch === "function"
                ) {
                    oneCardPlayPromise.catch(
                        function (error) {
                            console.warn(
                                "Не удалось запустить one_card.mp3:",
                                error
                            );
                        }
                    );
                }

                dealerImg.src =
                    ASSETS.blackjackDealerDeal;

                dealerImg.classList.add(
                    "is-dealing"
                );

                await wait(
                    DEALER_CARD_HOLD
                );

                addCard(
                    zone,
                    cardId,
                    false
                );

                await wait(
                    DEALER_AFTER_CARD
                );

                dealerImg.classList.remove(
                    "is-dealing"
                );

                dealerImg.src =
                    ASSETS.blackjackDealerIdle;

                await wait(90);
            }

            async function dealSpecial(
                zone,
                specialId
            ) {

                dealerImg.src =
                    ASSETS.blackjackDealerDeal;

                dealerImg.classList.add(
                    "is-dealing"
                );

                await wait(
                    DEALER_CARD_HOLD
                );

                addSpecial(
                    zone,
                    specialId,
                    false
                );

                await wait(
                    DEALER_AFTER_CARD
                );

                dealerImg.classList.remove(
                    "is-dealing"
                );

                dealerImg.src =
                    ASSETS.blackjackDealerIdle;

                await wait(90);
            }

            async function magicOpen(
                zone,
                magicId,
                nextCard
            ) {

                const magicData =
                    BLACKJACK_SPECIALS[
                        magicId
                    ];

                const cardData =
                    BLACKJACK_CARD_DATA[
                        nextCard
                    ];

                if (
                    !magicData ||
                    !cardData
                ) {
                    return;
                }

                await dealSpecial(
                    zone,
                    magicId
                );

                setReaction(
                    zone,
                    magicData.label,
                    magicId === "white"
                        ? "white"
                        : "black"
                );

                setMessage(
                    magicData.label +
                    " автоматически открывает следующую карту."
                );

                await wait(
                    900
                );

                await dealCard(
                    zone,
                    nextCard
                );

                zone.value +=
                    cardData.value +
                    magicData.modifier;

                updateScore(
                    zone,
                    zone.value
                );

                setMessage(
                    cardData.label +
                    " → " +
                    (
                        cardData.value +
                        magicData.modifier
                    ) +
                    " очка."
                );

                await wait(
                    1100
                );
            }

            /* =====================================================
            ОЧИСТКА РАУНДА
            ===================================================== */

            function clearRound() {

                clearNode(
                    pirate.cards
                );

                clearNode(
                    robot.cards
                );

                clearNode(
                    dealerZone.cards
                );

                clearNode(
                    tuko.cards
                );

                hideReaction(
                    pirate
                );

                hideReaction(
                    robot
                );

                hideReaction(
                    dealerZone
                );

                hideReaction(
                    tuko
                );

                stichBlocking.classList.remove(
                    "is-visible"
                );

                stichBlocking.style.display =
                    "none";

                pirate.value =
                    0;

                robot.value =
                    0;

                dealerZone.value =
                    0;

                tuko.value =
                    0;

                updateScore(
                    pirate,
                    0
                );

                updateScore(
                    robot,
                    0
                );

                updateScore(
                    dealerZone,
                    0
                );

                updateScore(
                    tuko,
                    0
                );

                resultPanel.className =
                    "casino-blackjack-result-panel";

                resultPanel.innerHTML =
                    "";

                clearControls();
            }

            /* =====================================================
            ПЕРВЫЙ РАУНД
            ===================================================== */

            async function startRound1() {

                clearRound();

                blackjackState.round =
                    1;

                status.textContent =
                    "РАУНД 1 · ТАКУ · ПИРАТ · РОБОТ";

                updateChips();

                setMessage(
                    "Крупье начинает раздачу."
                );

                /*
                * ==========================================
                * ПЕРВАЯ КАРТА КАЖДОМУ
                * ==========================================
                */

                await dealCard(
                    tuko,
                    "9s"
                );

                await dealCard(
                    pirate,
                    "10h"
                );

                await dealCard(
                    robot,
                    "8c"
                );

                /*
                * ==========================================
                * ВТОРАЯ КАРТА КАЖДОМУ
                * ==========================================
                */

                await dealCard(
                    tuko,
                    "8d"
                );

                await dealCard(
                    pirate,
                    "4d"
                );

                tuko.value =
                    17;

                pirate.value =
                    14;

                updateScore(
                    tuko,
                    17
                );

                updateScore(
                    pirate,
                    14
                );

                /*
                * У робота вторая карта —
                * Чёрная магия.
                *
                * Она сама открывает Туз.
                */

                await magicOpen(
                    robot,
                    "black",
                    "Ad"
                );

                    const oldCasinoVolumeAfterJoker =
                        casinoBackgroundSound.volume;

                    casinoBackgroundSound.volume =
                        0.08;

                await playLine(
                    "robot_5.mp3",
                    robotImg,
                    ASSETS.blackjackRobotIdle,
                    ASSETS.blackjackRobotTalk
                );

                    casinoBackgroundSound.volume =
                    oldCasinoVolumeAfterJoker;

                robot.value =
                    17;

                updateScore(
                    robot,
                    17
                );

                setReaction(
                    tuko,
                    "ВАШ ХОД",
                    "turn"
                );

                setMessage(
                    "ТаКу получает 9♠ + 8♦ = 17. Что делаем?"
                );

                showTukoRound1Choice();
            }

            /* =====================================================
            ВЫБОР ТАКУ · РАУНД 1
            ===================================================== */

            function showTukoRound1Choice() {

                clearControls();

                const take =
                    addControl(
                        "ЕЩЁ КАРТУ",
                        "gold-button"
                    );

                const pass =
                    addControl(
                        "ПАС",
                        "ghost-button"
                    );

                context.on(
                    take,
                    "click",
                    async function () {

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        hideReaction(
                            tuko
                        );

                        setReaction(
                            tuko,
                            "ЕЩЁ КАРТУ",
                            "take"
                        );

                        setMessage(
                            "ТаКу решает рискнуть."
                        );

                        await dealCard(
                            tuko,
                            "3s"
                        );

                        tuko.value =
                            20;

                        updateScore(
                            tuko,
                            20
                        );

                        /*
                        * ТаКу получила 20.
                        * Делаем паузу, чтобы игрок успел
                        * увидеть новую карту.
                        */

                        await wait(
                            2200
                        );

                        stichBlocking.style.display =
                            "block";

                        /* ЗВУК ПОЯВЛЕНИЯ СТИЧА */

                        const stichSound =
                            new Audio(
                                "assets/audio/3228b0eebfc7ef7.mp3"
                            );

                        stichSound.preload =
                            "auto";

                        stichSound.currentTime =
                            0;

                        const stichPlayPromise =
                            stichSound.play();

                        if (
                            stichPlayPromise &&
                            typeof stichPlayPromise.catch === "function"
                        ) {
                            stichPlayPromise.catch(
                                function (error) {
                                    console.warn(
                                        "Не удалось запустить звук Стича:",
                                        error
                                    );
                                }
                            );
                        }

                        requestAnimationFrame(
                            function () {

                                stichBlocking.classList.add(
                                    "is-visible"
                                );

                            }
                        );

                        blackjackState.firstUnder21Used =
                            true;

                        saveState(
                            "Казино: ТаКу получила 20 в первом раунде"
                        );


                        await wait(
                            2300
                        );

                        stichBlocking.classList.remove(
                            "is-visible"
                        );

                        await wait(
                            300
                        );

                        stichBlocking.style.display =
                            "none";

                        await playPirateRound1();
                    }
                );

                context.on(
                    pass,
                    "click",
                    async function () {

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        hideReaction(
                            tuko
                        );

                        setReaction(
                            tuko,
                            "ПАС",
                            "pass"
                        );

                        blackjackState.firstUnder21Used =
                            true;

                        saveState(
                            "Казино: ТаКу остановилась на 17"
                        );

                        setMessage(
                            "ТаКу оставляет 17 и сохраняет фишку."
                        );

                        await wait(
                            1200
                        );

                        await playPirateRound1();
                    }
                );
            }

            /* =====================================================
            ПИРАТ · РАУНД 1
            ===================================================== */

            async function playPirateRound1() {

                clearControls();

                stichBlocking.classList.remove(
                    "is-visible"
                );

                stichBlocking.style.display =
                    "none";

                setReaction(
                    tuko,
                    "ПАС",
                    "pass"
                );

                await wait(
                    350
                );

                setReaction(
                    pirate,
                    "ЕЩЁ КАРТУ",
                    "take"
                );

                pirateImg.src =
                    ASSETS.blackjackPirateTalk;

                pirateImg.classList.add(
                    "is-talking"
                );

                setMessage(
                    "Пират просит ещё карту."
                );

                await wait(
                    500
                );

                pirateImg.src =
                    ASSETS.blackjackPirateIdle;

                pirateImg.classList.remove(
                    "is-talking"
                );

                await dealCard(
                    pirate,
                    "3s"
                );

                pirate.value =
                    17;

                updateScore(
                    pirate,
                    17
                );

                setReaction(
                    pirate,
                    "НА АБОРДАЖ!",
                    "special"
                );

                setMessage(
                    "Пират идёт на абордаж."
                );

                await wait(
                    650
                );

                await magicOpen(
                    pirate,
                    "white",
                    "2h"
                );

                pirate.value =
                    21;

                updateScore(
                    pirate,
                    21
                );

                await playLine(
                    "pirate_7.mp3",
                    pirateImg,
                    ASSETS.blackjackPirateIdle,
                    ASSETS.blackjackPirateTalk
                );

                setReaction(
                    pirate,
                    "21!",
                    "win"
                );

                setMessage(
                    "Пират получает 21."
                );

                await wait(
                    900
                );

                await playDealerBlackjackWin();

                await playLine(
                    "pirate_8.mp3",
                    pirateImg,
                    ASSETS.blackjackPirateIdle,
                    ASSETS.blackjackPirateTalk
                );

                await wait(
                    700
                );

                pirateImg.classList.add(
                    "is-leaving"
                );

                await wait(
                    1100
                );

                clearNode(pirate.cards);
                hideReaction(pirate);

                await playRobotRound1();
            }

            /* =====================================================
            РОБОТ · РАУНД 1
            ===================================================== */

            async function playRobotRound1() {

                setReaction(
                    robot,
                    "ЕЩЁ КАРТУ",
                    "take"
                );

                robotImg.src =
                    ASSETS.blackjackRobotTalk;

                robotImg.classList.add(
                    "is-talking"
                );

                setMessage(
                    "Робот принимает решение взять следующую карту."
                );

                await wait(
                    900
                );

                robotImg.src =
                    ASSETS.blackjackRobotIdle;

                robotImg.classList.remove(
                    "is-talking"
                );

                await dealCard(
                    robot,
                    "7s"
                );

                robot.value =
                    24;

                updateScore(
                    robot,
                    24
                );

                setReaction(
                    robot,
                    "ПЕРЕБОР",
                    "bust"
                );

                setMessage(
                    "Робот получает 24. Перебор."
                );

                await wait(
                    900
                );

                finishRound1();
            }

            /* =====================================================
            КОНЕЦ РАУНДА 1
            ===================================================== */

            function finishRound1() {

                clearControls();

                resultPanel.className =
                    "casino-blackjack-result-panel is-visible";

                resultPanel.innerHTML =
                    "<h2>РАУНД 1</h2>" +
                    "<p>" +
                    "ТаКу: " +
                    tuko.value +
                    " · " +
                    "Пират: " +
                    pirate.value +
                    " · " +
                    "Робот: " +
                    robot.value +
                    "</p>";

                setMessage(
                    "Пират — 21. Робот — перебор. Фишка ТаКу остаётся."
                );

                saveState(
                    "Казино: первый раунд блэкджека завершён"
                );

                showNextButton(
                    "К РАУНДУ 2",
                    startRound2
                );
            }

            /* =====================================================
            РАУНД 2
            ===================================================== */

            async function startRound2() {

                clearRound();

                blackjackState.round =
                    2;

                status.textContent =
                    "РАУНД 2 · ТАКУ · РОБОТ";

                updateChips();

                setMessage(
                    "Крупье начните раздачу карт 2 раунда."
                );

                /*
                * ------------------------------------------
                * ТаКу
                * ------------------------------------------
                */

                await dealCard(
                    tuko,
                    "4c"
                );

                await dealCard(
                    tuko,
                    "9s"
                );

                tuko.value =
                    13;

                updateScore(
                    tuko,
                    13
                );

                setReaction(
                    tuko,
                    "«НУ КАК ТУТ НЕ БРАТЬ?»",
                    "turn"
                );

                setMessage(
                    "На столе у ТаКу 13."
                );

                await wait(
                    700
                );

                /*
                * ------------------------------------------
                * Робот получает 8♦ + Чёрную магию
                * ------------------------------------------
                */

                await dealCard(
                    robot,
                    "8d"
                );

                await magicOpen(
                    robot,
                    "black",
                    "As"
                );

                robot.value =
                    17;

                updateScore(
                    robot,
                    17
                );

                    const oldCasinoVolume =
                        casinoBackgroundSound.volume;

                    casinoBackgroundSound.volume =
                        0.08;

                await playLine(
                    "robot_6.mp3",
                    robotImg,
                    ASSETS.blackjackRobotIdle,
                    ASSETS.blackjackRobotTalk
                );

                    casinoBackgroundSound.volume =
                    oldCasinoVolume;

                await wait(
                    500
                );

                /*
                * ------------------------------------------
                * ВЫБОР ТАКУ
                * ------------------------------------------
                */

                setReaction(
                    tuko,
                    "ВАШ ХОД",
                    "turn"
                );

                setMessage(
                    "Очки равны 13. Взять или остановиться?"
                );

                showTukoRound2Choice();

            }

            /* =====================================================
            ВЫБОР ТАКУ · РАУНД 2
            ===================================================== */

            function showTukoRound2Choice() {

                clearControls();

                const take =
                    addControl(
                        "ВЗЯТЬ",
                        "gold-button"
                    );

                const pass =
                    addControl(
                        "ПАС",
                        "ghost-button"
                    );

                context.on(
                    take,
                    "click",
                    async function () {

                        if (
                            take.disabled ||
                            pass.disabled
                        ) {
                            return;
                        }

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        setReaction(
                            tuko,
                            "ЕЩЁ КАРТУ",
                            "take"
                        );

                        await magicOpen(
                            tuko,
                            "white",
                            "6h"
                        );

                        tuko.value =
                            21;

                        updateScore(
                            tuko,
                            21
                        );

                        blackjackState.betChips =
                            2;

                        updateChips();

                        secondStakeChip.style.display =
                            "block";

                        secondStakeChip.classList.remove(
                            "is-placed"
                        );

                        requestAnimationFrame(
                            function () {

                                requestAnimationFrame(
                                    function () {

                                        secondStakeChip.classList.add(
                                            "is-placed"
                                        );

                                    }
                                );

                            }
                        );

                        saveState(
                            "Казино: ТаКу получила вторую фишку"
                        );

                        setReaction(
                            tuko,
                            "21!",
                            "win"
                        );

                        setMessage(
                            "ТаКу получает 21."
                        );

                        await playDealerBlackjackWin();

                        await wait(
                            850
                        );

                        await playRobotRound2();
                    }
                );

                context.on(
                    pass,
                    "click",
                    async function () {

                        if (
                            take.disabled ||
                            pass.disabled
                        ) {
                            return;
                        }

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        setReaction(
                            tuko,
                            "ПАС",
                            "pass"
                        );

                        setMessage(
                            "ТаКу оставляет 13 и не берёт следующую карту."
                        );

                        await wait(
                            850
                        );

                        await playRobotRound2();
                    }
                );
            }

            /* =====================================================
            РОБОТ · ДЖОКЕР
            ===================================================== */

            async function playRobotRound2() {

                setReaction(
                    robot,
                    "ДЖОКЕР",
                    "special"
                );

                setMessage(
                    "Робот получает Джокер."
                );

                await dealSpecial(
                    robot,
                    "joker"
                );

                /*
                * Робот говорит о Джокере.
                */

                const oldCasinoVolume =
                    casinoBackgroundSound.volume;

                casinoBackgroundSound.volume =
                    0.08;

                await playLine(
                    "robot_7.mp3",
                    robotImg,
                    ASSETS.blackjackRobotIdle,
                    ASSETS.blackjackRobotTalk
                );

                casinoBackgroundSound.volume =
                    oldCasinoVolume;

                await wait(
                    400
                );

                await dealCard(
                    robot,
                    "5h"
                );

                /*
                * Робот видит 5♥.
                * Начинается его расчёт.
                */

                await wait(
                    500
                );

                setReaction(
                    robot,
                    "ПАС",
                    "pass"
                );

                casinoBackgroundSound.volume =
                    0.08;

                await playLine(
                    "robot_8.mp3",
                    robotImg,
                    ASSETS.blackjackRobotIdle,
                    ASSETS.blackjackRobotTalk
                );

                casinoBackgroundSound.volume =
                    oldCasinoVolume;

                /*
                * Робот пойман в логической ловушке.
                * После ошибки он покидает стол.
                */

                await wait(
                    500
                );

                robotImg.classList.add(
                    "is-leaving"
                );

                await wait(
                    1100
                );

                /*
                * Убираем всё, что принадлежало Роботу:
                * карты, Джокер, 5♥, реакцию и счёт.
                */

                clearNode(
                    robot.cards
                );

                hideReaction(
                    robot
                );

                robot.score.style.display =
                    "none";

                robotImg.style.display =
                    "none";

                await wait(
                    900
                );

                resultPanel.className =
                    "casino-blackjack-result-panel";

                resultPanel.innerHTML =
                    "";

                await startLadyFinalConversation();

            }

            /* =====================================================
            ГОСПОЖА СЛУЧАЙ · ВСТРЕЧА ПЕРЕД ФИНАЛОМ
            ===================================================== */

            let ladyImg =
                null;

            async function startLadyFinalConversation() {

                /*
                * Госпожа появляется именно
                * на месте ушедшего Робота.
                */

                ladyImg =
                    image(
                        ASSETS.ladySeatedIdle,
                        "casino-blackjack-lady",
                        "Госпожа Случай"
                    );

                ladyImg.draggable =
                    false;

                stage.appendChild(
                    ladyImg
                );

                /*
                * Меняем подпись правой зоны.
                */

                const robotTitle =
                    robot.root.querySelector(
                        ".casino-blackjack-zone-title"
                    );

                if (
                    robotTitle
                ) {
                    robotTitle.textContent =
                        "ГОСПОЖА СЛУЧАЙ";
                }

                await wait(
                    120
                );

                /*
                * Госпожа появляется уже сидящей.
                */

                requestAnimationFrame(
                    function () {

                        ladyImg.classList.add(
                            "is-seated"
                        );

                    }
                );

                await wait(
                    1200
                );

                /*
                * -------------------------------------------------
                * ДИАЛОГ
                * -------------------------------------------------
                */

                await playLine(
                    "lady_chance_1.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    650
                );

                await playLine(
                    "taku_blackjack_3.mp3"
                );

                await wait(
                    650
                );

                await playLine(
                    "lady_chance_2.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    650
                );

                await playLine(
                    "taku_blackjack_4.mp3"
                );

                await wait(
                    650
                );

                await playLine(
                    "lady_chance_3.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    650
                );

                await playLine(
                    "taku_blackjack_5.mp3"
                );

                await wait(
                    650
                );

                await playLine(
                    "lady_chance_4.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                /*
                * Небольшая пауза после последней фразы.
                */

                await wait(
                    900
                );

                /*
                * Только теперь игрок получает
                * единственный возможный переход.
                */

                showNextButton(
                    "К ТРЕТЬЕМУ РАУНДУ",
                    startFinalRound
                );
            }

            /* =====================================================
            ФИНАЛЬНЫЙ РАУНД
            ЛЕДИ ШАНС
            ===================================================== */

            async function startFinalRound() {

                clearRound();

                blackjackState.round =
                    3;

                status.textContent =
                    "ФИНАЛ · ТАКУ · ГОСПОЖА СЛУЧАЙ";

                updateChips();

                /*
                * Робот окончательно ушёл.
                * Его изображение остаётся скрытым.
                */

                robotImg.style.display =
                    "none";

                /*
                * Теперь правая зона становится
                * зоной Госпожи Случай.
                */

                const robotTitle =
                    robot.root.querySelector(
                        ".casino-blackjack-zone-title"
                    );

                if (
                    robotTitle
                ) {
                    robotTitle.textContent =
                        "ГОСПОЖА СЛУЧАЙ";
                }

                robot.score.style.display =
                    "block";

                /*
                * -------------------------------------------------
                * ДВЕ ФИШКИ НА СТОЛЕ
                * -------------------------------------------------
                */

                stakeChip.style.display =
                    "block";

                stakeChip.classList.add(
                    "is-placed"
                );

                secondStakeChip.style.display =
                    "block";

                secondStakeChip.classList.remove(
                    "is-placed"
                );

                requestAnimationFrame(
                    function () {

                        requestAnimationFrame(
                            function () {

                                secondStakeChip.classList.add(
                                    "is-placed"
                                );

                            }
                        );

                    }
                );

                setMessage(
                    "На кону обе фишки."
                );

                await wait(
                    900
                );

                /*
                * -------------------------------------------------
                * НАЧАЛО ФИНАЛЬНОЙ РАЗДАЧИ
                * -------------------------------------------------
                */

                await playFinalDeal();
            }

            /* =====================================================
            ФИНАЛЬНАЯ РАЗДАЧА
            ===================================================== */
            function waitForFakeChoice(
                message
            ) {

                return new Promise(
                    function (resolve) {

                        clearControls();

                        setReaction(
                            tuko,
                            "ВАШ ХОД",
                            "turn"
                        );

                        if (message) {
                            setMessage(message);
                        }

                        const fakeTake =
                            addControl(
                                "ВЗЯТЬ",
                                "gold-button"
                            );

                        const fakePass =
                            addControl(
                                "ПАС",
                                "ghost-button"
                            );

                        context.on(
                            fakeTake,
                            "click",
                            function () {

                                if (
                                    fakeTake.disabled
                                ) {
                                    return;
                                }

                                fakeTake.disabled =
                                    true;

                                fakePass.disabled =
                                    true;

                                setReaction(
                                    tuko,
                                    "БЕРУ",
                                    "take"
                                );

                                clearControls();

                                resolve();

                            }
                        );

                        context.on(
                            fakePass,
                            "click",
                            function () {

                                /*
                                * Фальшивая кнопка.
                                * Ничего не делает.
                                */

                            }
                        );
                    }
                );
            }

            async function playFinalDeal() {

                /*
                * ТаКу:
                * 7♠ + 4♦ = 11
                */

                await dealCard(
                    tuko,
                    "7s"
                );

                await dealCard(
                    tuko,
                    "4d"
                );

                tuko.value =
                    11;

                updateScore(
                    tuko,
                    11
                );

                /*
                * Леди Шанс:
                * A♠ + 2♥ = 13
                */

                await dealCard(
                    robot,
                    "As"
                );

                await dealCard(
                    robot,
                    "2h"
                );

                robot.value =
                    13;

                updateScore(
                    robot,
                    13
                );

                setReaction(
                    tuko,
                    "ВАШ ХОД",
                    "turn"
                );

                setMessage(
                    "У ТаКу 11. Взять ещё карту или остановиться?"
                );

                clearControls();

                const take = 
                    addControl(
                        "ЕЩЁ КАРТУ",
                        "gold-button"
                    );

                const pass = 
                    addControl(
                        "ПАС",
                        "ghost-button"
                    );

                context.on(
                    take,
                    "click",
                    async function () {

                        if (
                            take.disabled ||
                            pass.disabled
                        ) {
                            return;
                        }

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        hideReaction(
                            tuko
                        );

                        setReaction(
                            tuko,
                            "ЕЩЁ КАРТУ",
                            "take"
                        );

                        setMessage(
                            "ТаКу решает рискнуть."
                        );

                        await wait(
                            700
                        );

                        setMessage(
                            "ТаКу получает Чёрную магию."
                        );

                        await magicOpen(
                            tuko,
                            "black",
                            "4c"
                        );

                        tuko.value =
                            13;

                        updateScore(
                            tuko,
                            13
                        );

                        await wait(
                            700
                        );

                        await playFinalLadyTurn();
                    }
                );

                context.on(
                    pass,
                    "click",
                    async function () {

                        if (
                            take.disabled ||
                            pass.disabled
                        ) {
                            return;
                        }

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        hideReaction(
                            tuko
                        );

                        setReaction(
                            tuko,
                            "ПАС",
                            "pass"
                        );

                        setMessage(
                            "ТаКу остаётся на 11 и не берёт следующую карту."
                        );

                        await wait(
                            850
                        );

                        await playFinalLadyTurn();
                    }
                );
            }

            async function playFinalLadyTurn() {

                setMessage(
                    "Теперь Госпожа Случай добирает."
                );

                setReaction(
                    robot,
                    "ЕЩЁ КАРТУ",
                    "take"
                );

                await dealCard(
                    robot,
                    "5s"
                );

                robot.value =
                    18;

                updateScore(
                    robot,
                    18
                );

                hideReaction(
                    robot
                );

                await wait(
                    650
                );

                setReaction(
                    tuko,
                    "ВАШ ХОД",
                    "turn"
                );

                clearControls();

                const takeJoker =
                    addControl(
                        "ВЗЯТЬ",
                        "gold-button"
                    );

                const passJoker =
                    addControl(
                        "ПАС",
                        "ghost-button"
                    );

                context.on(
                    takeJoker,
                    "click",
                    async function () {

                        if (
                            takeJoker.disabled
                        ) {
                            return;
                        }

                        takeJoker.disabled =
                            true;

                        passJoker.disabled =
                            true;

                        hideReaction(
                            tuko
                        );

                        setReaction(
                            tuko,
                            "БЕРУ",
                            "take"
                        );

                        await wait(
                            500
                        );

                        await playFinalJoker();
                    }
                );

                context.on(
                    passJoker,
                    "click",
                    function () {
                        /*

                        * Кнопка специально ничего
                        * не делает.
                        *
                        * Игрок думает, что может
                        * отказаться от Джокера,
                        * но игра остаётся ждать
                        * правильного выбора.
                        */
                    }
                );
            }

            async function playFinalJoker() {

                setReaction(
                    tuko,
                    "ДЖОКЕР",
                    "special"
                );

                setMessage(
                    "ТаКу получает Джокер."
                );

                await dealSpecial(
                    tuko,
                    "joker"
                );

                await dealCard(
                    tuko,
                    "6h"
                );

                setMessage(
                    "Джокер показывает 6♥."
                );

                clearControls();

                const take =
                    addControl(
                        "ВЗЯТЬ 6♥",
                        "gold-button"
                    );

                const pass =
                    addControl(
                        "НЕ БРАТЬ",
                        "ghost-button"
                    );

                context.on(
                    take,
                    "click",
                    async function () {

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        setReaction(
                            tuko,
                            "БЕРУ 6♥",
                            "take"
                        );

                        tuko.value =
                            19;

                        updateScore(
                            tuko,
                            19
                        );

                        setMessage(
                            "ТаКу принимает 6♥. Итого 19."
                        );

                        await wait(
                            700
                        );

                        /*
                        * Леди:
                        * 18 + 2 = 20
                        */

                        setReaction(
                            robot,
                            "ЕЩЁ КАРТУ",
                            "take"
                        );

                        await dealCard(
                            robot,
                            "2c"
                        );

                        robot.value =
                            20;

                        updateScore(
                            robot,
                            20
                        );

                        await wait(
                            650
                        );

                        /*
                        * ТаКу:
                        * 19 + 2 = 21
                        */

                        await waitForFakeChoice(
                            "ТаКу получает следующую карту."
                        );

                        await dealCard(
                            tuko,
                            "2h"
                        );

                        tuko.value =
                            21;

                        updateScore(
                            tuko,
                            21
                        );

                        await playDealerBlackjackWin();

                        setReaction(
                            tuko,
                            "21!",
                            "win"
                        );

                        setMessage(
                            "ТаКу получает 21."
                        );

                        await wait(
                            900
                        );

                        await blackjackWin();

                    }
                );

                context.on(
                    pass,
                    "click",
                    async function () {

                        take.disabled =
                            true;

                        pass.disabled =
                            true;

                        setReaction(
                            tuko,
                            "НЕ БЕРУ",
                            "pass"
                        );

                        setMessage(
                            "ТаКу отказывается от 6♥."
                        );

                        const rejectedSixHearts =
                            tuko.cards.querySelector(
                                '[data-card-id="6h"]'
                            );

                        if (rejectedSixHearts) {
                            rejectedSixHearts.remove();
                        }

                        await wait(
                            700
                        );

                        /*
                        * Леди Шанс получает оставшуюся 6♥.
                        */

                        setReaction(
                            robot,
                            "ЕЩЁ КАРТУ",
                            "take"
                        );

                        await dealCard(
                            robot,
                            "6h"
                        );

                        robot.value =
                            24;

                        updateScore(
                            robot,
                            24
                        );

                        setReaction(
                            robot,
                            "ПЕРЕБОР",
                            "bust"
                        );

                        setMessage(
                            "Леди Шанс получает 24."
                        );

                        await wait(
                            700
                        );

                        await waitForFakeChoice(
                            "Перед ТаКу появляется Белая магия."
                        );

                        setReaction(
                            tuko,
                            "БЕЛАЯ МАГИЯ",
                            "white"
                        );

                        await magicOpen(
                            tuko,
                            "white",
                            "6s"
                        );

                        tuko.value =
                            21;

                        updateScore(
                            tuko,
                            21
                        );

                        await playDealerBlackjackWin();

                        setReaction(
                            tuko,
                            "21!",
                            "win"
                        );

                        setMessage(
                            "ТаКу получает 21."
                        );

                        await wait(
                            900
                        );

                        await blackjackWin();

                    }
                );
            }

                        /* =====================================================
            ПОБЕДА
            ===================================================== */

            async function blackjackWin() {

                clearControls();

                blackjackState.completed =
                    true;

                saveState(
                    "Казино: Магический блэкджек пройден"
                );

                resultPanel.className =
                    "casino-blackjack-result-panel is-visible is-complete";

                resultPanel.innerHTML =
                    "<h2>21</h2>" +
                    "<p>" +
                    "Финальная ставка выиграна."
                    +
                    "</p>" +
                    "<strong>" +
                    "МАГИЧЕСКИЙ БЛЭКДЖЕК ПРОЙДЕН"
                    +
                    "</strong>";

                setMessage(
                    "ТаКу выигрывает финальную ставку.",
                    "win"
                );

                /*
                * -------------------------------------------------
                * ФИНАЛЬНЫЙ ДИАЛОГ С ГОСПОЖОЙ СЛУЧАЙ
                * -------------------------------------------------
                */

                await wait(
                    900
                );

                await playLine(
                    "taku_blackjack_6.mp3"
                );

                await wait(
                    500
                );

                await playLine(
                    "lady_chance_5.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    500
                );

                await playLine(
                    "taku_blackjack_7.mp3"
                );

                await wait(
                    500
                );

                await playLine(
                    "lady_chance_6.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    500
                );

                await playLine(
                    "taku_blackjack_8.mp3"
                );

                await wait(
                    500
                );

                await playLine(
                    "lady_chance_7.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    650
                );

                await playLine(
                    "taku_blackjack_9.mp3"
                );

                await wait(
                    500
                );

                await playLine(
                    "lady_chance_8.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    500
                );

                await playLine(
                    "taku_blackjack_10.mp3"
                );

                await wait(
                    500
                );

                await playLine(
                    "lady_chance_10.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                if (ladyImg) {
                    ladyImg.style.display = "none";
                }

                casinoBackgroundSound.pause();
                casinoBackgroundSound.currentTime = 0;

                /*
                * Первая дверь.
                * После окончания видео переходим
                * в чёрную промежуточную сцену.
                */

                playCasinoDoorTransition(
                    root,
                    context,
                    "casino_blackjack_walk",
                    "Казино: Госпожа ведёт ТаКу дальше"
                );
            }

            /* =====================================================
            HUD + МОНТАЖ
            ===================================================== */

            addHud(
                scene.screen,
                context,
                "Магическое казино"
            );

            root.appendChild(
                scene.screen
            );

            updateChips();

            context.timeout(
                async function () {

                    scene.screen.classList.add(
                        "casino-ready"
                    );

                    /*
                    * ------------------------------------------
                    * ВХОДНОЙ РАЗГОВОР
                    * ------------------------------------------
                    */

                    await wait(
                        700
                    );

                    await playLine(
                        "pirate_1.mp3",
                        pirateImg,
                        ASSETS.blackjackPirateIdle,
                        ASSETS.blackjackPirateTalk
                    );

                    await wait(
                        350
                    );

                    let oldCasinoVolume =
                        casinoBackgroundSound.volume;

                    casinoBackgroundSound.volume =
                        0.08;

                    await playLine(
                        "robot_1.mp3",
                        robotImg,
                        ASSETS.blackjackRobotIdle,
                        ASSETS.blackjackRobotTalk
                    );

                    casinoBackgroundSound.volume =
                    oldCasinoVolume;

                    await wait(
                        350
                    );

                    await playLine(
                        "pirate_2.mp3",
                        pirateImg,
                        ASSETS.blackjackPirateIdle,
                        ASSETS.blackjackPirateTalk
                    );

                    await wait(
                        350
                    );

                    await playLine(
                        "taku_blackjack_1.mp3"
                    );

                    await wait(
                        350
                    );

                    await playLine(
                        "pirate_3.mp3",
                        pirateImg,
                        ASSETS.blackjackPirateIdle,
                        ASSETS.blackjackPirateTalk
                    );

                    await wait(
                        350
                    );

                                        oldCasinoVolume =
                        casinoBackgroundSound.volume;

                    casinoBackgroundSound.volume =
                        0.08;

                    await new Promise(function (resolve) {

                        const robotVoice =
                            new Audio(
                                "assets/audio/robot_2.mp3"
                            );

                        robotVoice.preload =
                            "auto";

                        robotVoice.volume =
                            1.0;

                        robotImg.src =
                            ASSETS.blackjackRobotTalk;

                        robotImg.classList.add(
                            "is-talking"
                        );

                        let finished =
                            false;

                        function finishRobotVoice() {

                            if (finished) {
                                return;
                            }

                            finished =
                                true;

                            robotImg.src =
                                ASSETS.blackjackRobotIdle;

                            robotImg.classList.remove(
                                "is-talking"
                            );

                            robotVoice.removeEventListener(
                                "ended",
                                finishRobotVoice
                            );

                            robotVoice.removeEventListener(
                                "error",
                                finishRobotVoice
                            );

                            resolve();
                        }

                        robotVoice.addEventListener(
                            "ended",
                            finishRobotVoice
                        );

                        robotVoice.addEventListener(
                            "error",
                            function (error) {

                                console.warn(
                                    "Ошибка robot_2.mp3:",
                                    error
                                );

                                finishRobotVoice();
                            }
                        );

                        robotVoice.currentTime =
                            0;

                        const playPromise =
                            robotVoice.play();

                        if (
                            playPromise &&
                            typeof playPromise.catch === "function"
                        ) {

                            playPromise.catch(
                                function (error) {

                                    console.warn(
                                        "Не удалось запустить robot_2.mp3:",
                                        error
                                    );

                                    finishRobotVoice();
                                }
                            );
                        }

                    });

                    casinoBackgroundSound.volume =
                        oldCasinoVolume;

                    await wait(
                        350
                    );

                    await playLine(
                        "taku_blackjack_2.mp3"
                    );

                    await wait(
                        350
                    );

                    await playLine(
                        "pirate_4.mp3",
                        pirateImg,
                        ASSETS.blackjackPirateIdle,
                        ASSETS.blackjackPirateTalk
                    );

                    await wait(
                        350
                    );

                    oldCasinoVolume =
                        casinoBackgroundSound.volume;

                    casinoBackgroundSound.volume =
                        0.08;

                    await playLine(
                        "robot_3.mp3",
                        robotImg,
                        ASSETS.blackjackRobotIdle,
                        ASSETS.blackjackRobotTalk
                    );

                    casinoBackgroundSound.volume =
                    oldCasinoVolume;

                    await wait(
                        350
                    );

                    await playLine(
                        "pirate_5.mp3",
                        pirateImg,
                        ASSETS.blackjackPirateIdle,
                        ASSETS.blackjackPirateTalk
                    );

                    await wait(
                        350
                    );

                    oldCasinoVolume =
                        casinoBackgroundSound.volume;

                    casinoBackgroundSound.volume =
                        0.08;

                    await playLine(
                        "robot_4.mp3",
                        robotImg,
                        ASSETS.blackjackRobotIdle,
                        ASSETS.blackjackRobotTalk
                    );

                    casinoBackgroundSound.volume =
                    oldCasinoVolume;

                    await wait(
                        500
                    );


                    await playLine(
                        "pirate_6.mp3",
                        pirateImg,
                        ASSETS.blackjackPirateIdle,
                        ASSETS.blackjackPirateTalk
                    );

                    await wait(
                        700
                    );

                    await placeInitialStake();
                    await startRound1();

                },
                90
            );
        },

        unmount: function () {

            const screen =
                document.querySelector(
                    ".casino-blackjack-screen"
                );

            if (
                screen &&
                screen._casinoBackgroundSound
            ) {
                screen._casinoBackgroundSound.pause();

                screen._casinoBackgroundSound.currentTime =
                    0;
            }
        }
    };

        /* =========================================================
       ПЕРЕХОД ИЗ БЛЭКДЖЕКА В ПОКЕР
       ========================================================= */

    game.scenes.casino_blackjack_walk = {
        id: "casino_blackjack_walk",

        mount: function (root, context) {

            const screen =
                document.createElement("section");

            screen.className =
                "screen casino-blackjack-walk-screen";

            screen.style.position = "fixed";
            screen.style.inset = "0";
            screen.style.zIndex = "999999";
            screen.style.background = "#000";

            root.appendChild(screen);

            const footsteps =
                new Audio(
                    "assets/audio/kabluk.mp3"
                );

            footsteps.preload = "auto";
            footsteps.volume = 1.0;

            const playPromise =
                footsteps.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {
                playPromise.catch(function (error) {

                    console.warn(
                        "Не удалось запустить kabluk.mp3:",
                        error
                    );

                });
            }

            context.timeout(
                function () {

                    footsteps.pause();
                    footsteps.currentTime = 0;

                    playCasinoDoorTransition(
                        root,
                        context,
                        "casino_poker_liars",
                        "Казино: вход в Покер лжецов"
                    );

                },
                5000
            );
        },

        unmount: function () {}
    };


        /* =========================================================
       ИГРА 3 · ПОКЕР ЛЖЕЦОВ
       ========================================================= */

    game.scenes.casino_poker_liars = {

        id: "casino_poker_liars",

        mount: function (root, context) {

            game.state.patch({
                activePlayer: "taku"
            });

            const scene =
                makeScreen(
                    "casino-poker-liars-screen",
                    ASSETS.pokerBg
                );

            const stage =
                scene.stage;

    /* =================================================
   ФОНОВЫЙ AMBIENT · SUPER VIP CASINO
   ================================================= */

            const pokerAmbientSound =
                new Audio(
                    "assets/audio/casino_vip_ambient.mp3"
                );

            pokerAmbientSound.preload =
                "auto";

            pokerAmbientSound.loop =
                true;

            const pokerAmbientBaseVolume =
                0.12;

            pokerAmbientSound.volume =
                pokerAmbientBaseVolume;

            /* =================================================
               HEADER
               ================================================= */

            const header =
                createSceneHeader(
                    "ИГРА 3 ИЗ 3",
                    "Покер лжецов",
                    "РАУНД 1 · ЛЖЕЦОВ: 1"
                );

            stage.appendChild(
                header
            );

            /* =================================================
               ПЕРСОНАЖИ
               ================================================= */

            const richManImg =
                image(
                    ASSETS.pokerRichManIdle,
                    "poker-character poker-rich-man",
                    "Богач"
                );

            const golemImg =
                image(
                    ASSETS.pokerGolemIdle,
                    "poker-character poker-golem",
                    "Голем"
                );

            const incognitoImg =
                image(
                    ASSETS.pokerIncognitoIdle,
                    "poker-character poker-incognito",
                    "Инкогнито"
                );

            const ladyImg =
                image(
                    ASSETS.ladySeatedIdle,
                    "poker-character poker-lady",
                    "Госпожа Шанс"
                );

            stage.append(
                richManImg,
                golemImg,
                incognitoImg,
                ladyImg
            );

            /* =================================================
               КАРТЫ NPC — ДВЕ РУБАШКИ КАЖДОМУ
               ================================================= */

            const characterCards = {

                richMan: [
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-rich-card-1",
                        "Закрытая карта Богача"
                    ),
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-rich-card-2",
                        "Закрытая карта Богача"
                    )
                ],

                golem: [
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-golem-card-1",
                        "Закрытая карта Голема"
                    ),
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-golem-card-2",
                        "Закрытая карта Голема"
                    )
                ],

                incognito: [
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-incognito-card-1",
                        "Закрытая карта Инкогнито"
                    ),
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-incognito-card-2",
                        "Закрытая карта Инкогнито"
                    )
                ],

                lady: [
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-lady-card-1",
                        "Закрытая карта Госпожи"
                    ),
                    image(
                        ASSETS.pokerCardBack,
                        "poker-card poker-npc-card poker-lady-card-2",
                        "Закрытая карта Госпожи"
                    )
                ]
            };

            Object.keys(characterCards).forEach(
                function (key) {

                    characterCards[key].forEach(
                        function (card) {

                            card.style.display =
                                "none";

                            stage.appendChild(
                                card
                            );
                        }
                    );
                }
            );

            /* =================================================
               КАРТЫ ТАКУ
               ================================================= */

            const takuCards = [
                image(
                    ASSETS.pokerCardBack,
                    "poker-card poker-taku-card poker-taku-card-1",
                    "Карта ТаКу"
                ),
                image(
                    ASSETS.pokerCardBack,
                    "poker-card poker-taku-card poker-taku-card-2",
                    "Карта ТаКу"
                )
            ];

            takuCards.forEach(
                function (card) {

                    card.style.display =
                        "none";

                    stage.appendChild(
                        card
                    );
                }
            );

            let takuRealCards = [];

            /* =================================================
               ЦЕНТРАЛЬНЫЕ СЛОТЫ
               ================================================= */

            const communityArea =
                document.createElement("div");

            communityArea.className =
                "poker-community-area";

            stage.appendChild(
                communityArea
            );

            const communitySlots = [];

            for (
                let i = 0;
                i < 5;
                i += 1
            ) {

                const slot =
                    document.createElement("div");

                slot.className =
                    "poker-community-slot";

                slot.dataset.index =
                    String(i);

                communityArea.appendChild(
                    slot
                );

                communitySlots.push(
                    slot
                );
            }

            /* =================================================
               КАРТА ВНЕ ИГРЫ
               ================================================= */

            const outOfPlayPanel =
                document.createElement("div");

            outOfPlayPanel.className =
                "poker-out-of-play-panel";

            const outOfPlayPanelImage =
                image(
                    ASSETS.pokerOutOfPlayPanel,
                    "poker-out-of-play-panel-image",
                    "Карта вне игры"
                );

            outOfPlayPanel.appendChild(
                outOfPlayPanelImage
            );

            outOfPlayPanel.setAttribute(
                "aria-label",
                "Карта вне игры"
            );

            stage.appendChild(
                outOfPlayPanel
            );

            const outOfPlaySlot =
                document.createElement("div");

            outOfPlaySlot.className =
                "poker-out-of-play-card-slot";

            outOfPlayPanel.appendChild(
                outOfPlaySlot
            );

            /* =================================================
               ПАНЕЛИ
               ================================================= */

            const combinationsPanel =
                image(
                    ASSETS.pokerCombinationsPanel,
                    "poker-overlay-panel poker-combinations-panel",
                    "Комбинации"
                );

            combinationsPanel.style.display =
                "none";

            stage.appendChild(
                combinationsPanel
            );

            const dialoguePanel =
                document.createElement("div");

            dialoguePanel.className =
                "poker-overlay-panel poker-dialogue-panel";

            dialoguePanel.setAttribute(
                "aria-label",
                "Реплики"
            );

            dialoguePanel.style.display =
                "none";

            const dialoguePanelImage =
                image(
                    ASSETS.pokerDialoguePanel,
                    "poker-dialogue-panel-image",
                    "Реплики"
                );

            dialoguePanel.appendChild(
                dialoguePanelImage
            );

            const dialogueText =
                document.createElement("div");

            dialogueText.className =
                "poker-dialogue-panel-text";

            dialoguePanel.appendChild(
                dialogueText
            );

            stage.appendChild(
                dialoguePanel
            );

            const choicePanel =
                document.createElement("div");

            choicePanel.className =
                "poker-overlay-panel poker-liar-choice-panel";

            choicePanel.setAttribute(
                "aria-label",
                "Выбор лжеца"
            );

            choicePanel.style.display =
                "none";

            const choicePanelImage =
                image(
                    ASSETS.pokerLiarChoicePanel,
                    "poker-liar-choice-panel-image",
                    "Выбор лжеца"
                );

            choicePanel.appendChild(
                choicePanelImage
            );

            stage.appendChild(
                choicePanel
            );

            /* =================================================
               КНОПКИ
               ================================================= */

            const controls =
                document.createElement("div");

            controls.className =
                "poker-controls";

            stage.appendChild(
                controls
            );

            const choiceButton =
                game.mechanics.createButton(
                    "",
                    "poker-action-button poker-choice-button"
                );

            const dialogueButton =
                game.mechanics.createButton(
                    "",
                    "poker-action-button poker-dialogue-button"
                );

            const combinationsButton =
                game.mechanics.createButton(
                    "",
                    "poker-action-button poker-combinations-button"
                );


            /* =================================================
            ИЗОБРАЖЕНИЯ КНОПОК
            ================================================= */

            const choiceButtonImage =
                image(
                    "assets/images/poker_liar_choice_button.png",
                    "poker-action-button-image",
                    "Выбор"
                );

            const dialogueButtonImage =
                image(
                    "assets/images/poker_dialogue_button.png",
                    "poker-action-button-image",
                    "Реплики"
                );

            const combinationsButtonImage =
                image(
                    "assets/images/poker_combinations_button.png",
                    "poker-action-button-image",
                    "Комбинации"
                );


            choiceButton.appendChild(
                choiceButtonImage
            );

            dialogueButton.appendChild(
                dialogueButtonImage
            );

            combinationsButton.appendChild(
                combinationsButtonImage
            );

            controls.append(
                choiceButton,
                dialogueButton,
                combinationsButton
            );

            /* =================================================
               ВОПРОС
               ================================================= */

            const question =
                document.createElement("div");

            question.className =
                "poker-question";

            question.textContent =
                "";

            stage.appendChild(
                question
            );

            /* =================================================
               ОБРАТНАЯ СВЯЗЬ
               ================================================= */

            const feedback =
                document.createElement("div");

            feedback.className =
                "poker-feedback";

            stage.appendChild(
                feedback
            );

            /* =================================================
               ГОЛОС
               ================================================= */

            let currentPokerVoice =
                null;

            function wait(ms) {

                return new Promise(
                    function (resolve) {

                        context.timeout(
                            resolve,
                            ms
                        );
                    }
                );
            }

            function playPokerVoice(
                file,
                speakingImage,
                idleImage,
                talkImage
            ) {

                return new Promise(
                    function (resolve) {

                        /*
                        * Для покера используем отдельный Audio-объект.
                        * Promise завершается только когда браузер получает
                        * настоящее событие "ended".
                        *
                        * Никакого фиксированного таймера на 8 секунд нет.
                        */

                        const audio =
                            new Audio(
                                "assets/audio/" + file
                            );

                        currentPokerVoice =
                            audio;

                        if (pokerAmbientSound) {

                            pokerAmbientSound.volume =
                                0.05;
                        }

                        if (
                            speakingImage &&
                            talkImage
                        ) {

                            speakingImage.src =
                                talkImage;

                            speakingImage.classList.add(
                                "is-talking"
                            );
                        }

                        let finished =
                            false;

                        function finish() {

                            if (finished) {
                                return;
                            }

                            finished =
                                true;

                            if (
                                speakingImage &&
                                idleImage
                            ) {

                                speakingImage.src =
                                    idleImage;

                                speakingImage.classList.remove(
                                    "is-talking"
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

                            if (
                                currentPokerVoice === audio
                            ) {

                                currentPokerVoice =
                                    null;
                            }

                            if (pokerAmbientSound) {

                                pokerAmbientSound.volume =
                                    pokerAmbientBaseVolume;
                            }

                            resolve();
                        }

                        /*
                        * ГЛАВНОЕ:
                        * следующий шаг игры запускается только после
                        * реального окончания аудиофайла.
                        */

                        audio.addEventListener(
                            "ended",
                            finish
                        );

                        /*
                        * Если файл не удалось воспроизвести,
                        * не оставляем игру зависшей.
                        */

                        audio.addEventListener(
                            "error",
                            finish
                        );

                        /*
                        * Запускаем звук.
                        */

                        audio.play().catch(
                            function () {
                                finish();
                            }
                        );

                    }
                );
            }

            /* =================================================
               ВСПОМОГАТЕЛЬНЫЕ АНИМАЦИИ
               ================================================= */

            function showElement(
                element,
                extraClass
            ) {

                element.style.display =
                    "";

                element.classList.add(
                    "is-visible"
                );

                if (extraClass) {

                    element.classList.add(
                        extraClass
                    );
                }
            }

            function hideElement(
                element
            ) {

                element.classList.remove(
                    "is-visible"
                );

                element.style.display =
                    "none";
            }

            function showCard(
                slot,
                cardId,
                className
            ) {

                const cardData =
                    POKER_CARDS[cardId];

                if (
                    !cardData
                ) {
                    return null;
                }

                const card =
                    image(
                        cardData.image,
                        "poker-card poker-real-card " +
                        (className || ""),
                        cardData.label
                    );

                card.dataset.cardId =
                    cardId;

                slot.appendChild(
                    card
                );

                requestAnimationFrame(
                    function () {

                        card.classList.add(
                            "is-visible"
                        );
                    }
                );

                return card;
            }

            function replaceTakuCards(
                firstCardId,
                secondCardId
            ) {

                takuCards.forEach(
                    function (card) {

                        hideElement(
                            card
                        );
                    }
                );

                takuRealCards.forEach(
                    function (card) {

                        card.remove();
                    }
                );

                takuRealCards = [];

                const first =
                    showCard(
                        takuCards[0].parentNode ||
                        stage,
                        firstCardId || "As",
                        "poker-taku-real-card poker-taku-real-card-1"
                    );

                const second =
                    showCard(
                        takuCards[1].parentNode ||
                        stage,
                        secondCardId || "Qh",
                        "poker-taku-real-card poker-taku-real-card-2"
                    );

                /*
                 * Временный перенос: реальные карты ТаКу
                 * должны использовать те же позиции,
                 * что и рубашки.
                 */
                first.style.position =
                    "absolute";

                second.style.position =
                    "absolute";

                first.classList.add(
                    "poker-taku-card-real"
                );

                second.classList.add(
                    "poker-taku-card-real"
                );

                takuRealCards.push(
                    first,
                    second
                );
            }

            function revealNPCBacks() {

                Object.keys(
                    characterCards
                ).forEach(
                    function (key) {

                        characterCards[key].forEach(
                            function (card) {

                                showElement(
                                    card,
                                    "poker-card-enter"
                                );
                            }
                        );
                    }
                );

                takuCards.forEach(
                    function (card) {

                        showElement(
                            card,
                            "poker-card-enter"
                        );
                    }
                );
            }

            function revealCommunitySlots() {

                communitySlots.forEach(
                    function (slot, index) {

                        context.timeout(
                            function () {

                                slot.classList.add(
                                    "is-visible"
                                );

                            },
                            index * 100
                        );
                    }
                );
            }

            function revealOutOfPlayPanel() {

                showElement(
                    outOfPlayPanel
                );

                outOfPlayPanel.classList.add(
                    "poker-panel-enter"
                );
            }

            function revealOutOfPlayCard(
                cardId
            ) {

                /*
                * Полностью удаляем предыдущую карту.
                */
                while (
                    outOfPlaySlot.firstChild
                ) {

                    outOfPlaySlot.removeChild(
                        outOfPlaySlot.firstChild
                    );
                }

                /*
                * Запоминаем, какая карта
                * сейчас находится вне игры.
                */
                outOfPlaySlot.dataset.cardId =
                    cardId;

                /*
                * Создаём новую карту.
                */
                const newCard =
                    showCard(
                        outOfPlaySlot,
                        cardId,
                        "poker-out-of-play-card"
                    );

                /*
                * Дополнительная защита:
                * если карта действительно создана,
                * явно указываем её ID.
                */
                if (newCard) {

                    newCard.dataset.cardId =
                        cardId;
                }
            }

            function pulseElement(
                element
            ) {

                element.classList.remove(
                    "is-pulsing"
                );

                requestAnimationFrame(
                    function () {

                        element.classList.add(
                            "is-pulsing"
                        );
                    }
                );
            }

            function clearHighlight() {

                [
                    richManImg,
                    golemImg,
                    incognitoImg,
                    ladyImg
                ].forEach(
                    function (element) {

                        element.classList.remove(
                            "poker-player-wrong",
                            "poker-player-correct"
                        );
                    }
                );
            }

            function setFeedback(
                text
            ) {

                feedback.textContent =
                    text || "";
            }

            function openPanel(
                panel
            ) {

                showElement(
                    panel
                );
            }

            function closePanel(
                panel
            ) {

                hideElement(
                    panel
                );
            }

            function populateDialoguePanel() {

                if (
                    currentPokerRound === 1
                ) {

                    dialogueText.innerHTML =

                        "<div>«У меня две пары.»</div>" +

                        "<div>«У меня каре.»</div>" +

                        "<div>«У меня фулл-хаус.»</div>" +

                        "<div>«У меня сет.»</div>";

                    return;
                }


                if (
                    currentPokerRound === 2
                ) {

                    dialogueText.innerHTML =

                        "<div>«У меня каре.»</div>" +

                        "<div>«У меня пара.»</div>" +

                        "<div>«У меня сет»</div>" +

                        "<div>«У меня две пары..»</div>";

                    return;
                }


                if (
                    currentPokerRound === 3
                ) {

                    dialogueText.innerHTML =

                        "<div>«У Госпожи Шанс каре.»</div>" +

                        "<div>«У меня фулл-хаус.»</div>" +

                        "<div>«У меня три одинаковых.»</div>" +

                        "<div>«У Нейтрального фулл-хаус..»</div>";

                }
            }

            /* =================================================
               ВЫБОР ЛЖЕЦА
               ================================================= */

            const choiceTargets = {

                richMan: {
                    image: richManImg,
                    label: "Богач"
                },

                golem: {
                    image: golemImg,
                    label: "Голем"
                },

                incognito: {
                    image: incognitoImg,
                    label: "Инкогнито"
                },

                lady: {
                    image: ladyImg,
                    label: "Госпожа Шанс"
                }
            };

            let currentPokerRound = 1;
            let roundTwoFoundLiars = [];

            const choiceHitboxes = {};

            Object.keys(
                choiceTargets
            ).forEach(
                function (key) {

                    const hit =
                        document.createElement(
                            "button"
                        );

                    hit.type =
                        "button";

                    hit.className =
                        "poker-choice-hit poker-choice-hit-" +
                        key;

                    hit.setAttribute(
                        "aria-label",
                        choiceTargets[key].label
                    );

                    hit.style.display =
                        "none";

                    choicePanel.appendChild(
                        hit
                    );

                    choiceHitboxes[key] =
                        hit;
                }
            );

            function openChoicePanel() {

                if (
                    choiceButton.disabled
                ) {
                    return;
                }

                dialoguePanel.style.display =
                    "none";

                dialoguePanel.classList.remove(
                    "is-visible"
                );

                choicePanel.style.display =
                    "block";

                choicePanel.classList.add(
                    "is-visible"
                );

                choicePanel.style.zIndex =
                    "60";

                Object.keys(
                    choiceHitboxes
                ).forEach(
                    function (key) {

                        choiceHitboxes[key].style.display =
                            "block";
                    }
                );
            }

            function closeChoicePanel() {

                choicePanel.classList.remove(
                    "is-visible"
                );

                choicePanel.style.display =
                    "none";

                Object.keys(
                    choiceHitboxes
                ).forEach(
                    function (key) {

                        choiceHitboxes[key].style.display =
                            "none";
                    }
                );
            }

            function wrongAnswer(
                playerId
            ) {

                closeChoicePanel();

                clearHighlight();

                choiceTargets[playerId].image.classList.add(
                    "poker-player-wrong"
                );

                pokerWrongSound.currentTime =
                    0;

                const wrongPlayPromise =
                    pokerWrongSound.play();

                if (
                    wrongPlayPromise &&
                    typeof wrongPlayPromise.catch ===
                        "function"
                ) {
                    wrongPlayPromise.catch(
                        function (error) {
                            console.warn(
                                "Не удалось запустить poker_wrong.mp3:",
                                error
                            );
                        }
                    );
                }

                setFeedback(
                    "НЕВЕРНО"
                );

                context.timeout(
                    function () {

                        clearHighlight();

                        setFeedback(
                            "Попробуй рассчитать ещё раз."
                        );

                    },
                    900
                );
            }

            async function correctAnswer() {

                closeChoicePanel();

                choiceButton.disabled =
                    true;

                clearHighlight();

                golemImg.classList.add(
                    "poker-player-correct"
                );

                setFeedback(
                    "КАРЕ НЕВОЗМОЖНО"
                );

                const proof =
                    document.createElement(
                        "div"
                    );

                proof.className =
                    "poker-proof";

                    proof.innerHTML =
                        "<div class=\"poker-proof-title\">КАРЕ НЕВОЗМОЖНО</div>" +
                        "<div><strong>A♠</strong> — у ТаКу</div>" +
                        "<div><strong>A♦ + A♥</strong> — на столе</div>" +
                        "<div><strong>A♣</strong> — единственный оставшийся туз";

                stage.appendChild(
                    proof
                );

                context.timeout(
                    function () {

                        proof.classList.add(
                            "is-visible"
                        );

                    },
                    80
                );

                await wait(
                    1200
                );

                await playPokerVoice(
                    "poker_chance_14.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    400
                );

                await playPokerVoice(
                    "poker_taku_5.mp3"
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_chance_15.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    900
                );

                await startPokerRound2();
            }

            function handleRoundTwoChoice(
                playerId
            ) {

                /*
                * Если этого игрока уже выбрали —
                * повторно его не засчитываем.
                */
                if (
                    roundTwoFoundLiars.includes(
                        playerId
                    )
                ) {
                    return;
                }

                closeChoicePanel();

                /*
                * Правильные лжецы Раунда 2:
                * Голем + Инкогнито
                */
                const isCorrectLiar =
                    playerId === "golem" ||
                    playerId === "incognito";

                /*
                * НЕПРАВИЛЬНЫЙ ИГРОК
                */
                if (!isCorrectLiar) {

                    choiceTargets[playerId].image.classList.add(
                        "poker-player-wrong"
                    );

                    pokerWrongSound.currentTime = 0;

                    const wrongPlayPromise =
                        pokerWrongSound.play();

                    if (
                        wrongPlayPromise &&
                        typeof wrongPlayPromise.catch ===
                            "function"
                    ) {

                        wrongPlayPromise.catch(
                            function (error) {

                                console.warn(
                                    "Не удалось запустить poker_wrong.mp3:",
                                    error
                                );

                            }
                        );
                    }

                    setFeedback(
                        "НЕВЕРНО"
                    );

                    context.timeout(
                        function () {

                            choiceTargets[playerId].image.classList.remove(
                                "poker-player-wrong"
                            );

                            setFeedback(
                                roundTwoFoundLiars.length === 1
                                    ? "НАЗОВИ ВТОРОГО ЛЖЕЦА"
                                    : "ПОПРОБУЙ ЕЩЁ РАЗ"
                            );

                        },
                        900
                    );

                    return;
                }

                /*
                * ПРАВИЛЬНЫЙ ЛЖЕЦ
                */
                roundTwoFoundLiars.push(
                    playerId
                );

                choiceTargets[playerId].image.classList.add(
                    "poker-player-correct"
                );

                /*
                * Найден только первый
                */
                if (
                    roundTwoFoundLiars.length === 1
                ) {

                    question.textContent =
                        "НАЗОВИ ВТОРОГО ЛЖЕЦА";

                    setFeedback(
                        "ОДИН ЛЖЕЦ НАЙДЕН"
                    );

                    return;
                }

                /*
                * Найдены оба
                */
                choiceButton.disabled =
                    true;

                question.textContent =
                    "ДВА ЛЖЕЦА НАЙДЕНЫ";

                setFeedback(
                    "ГОТОВО"
                );

                const proof =
                    document.createElement(
                        "div"
                    );

                proof.className =
                    "poker-proof";

                proof.innerHTML =
                    "<div class=\"poker-proof-title\">ПОЧЕМУ ГОЛЕМ И ИНКОГНИТО ЛГУТ</div>" +

                    "<div><strong>Q♠ + Q♥</strong> — уже пара на столе.</div>" +

                    "<div><strong>Q♦ + Q♣</strong> — единственный вариант каре.</div>" +

                    "<div>Значит у Богача должны быть обе оставшиеся дамы.</div>" +

                    "<div>У Голема любая оставшаяся карта образует как минимум вторую пару.</div>" +

                    "<div>А «сет» Инкогнито вместе с <strong>Q-Q</strong> превращается во фулл-хаус.</div>";

                stage.appendChild(
                    proof
                );

                context.timeout(
                    function () {

                        proof.classList.add(
                            "is-visible"
                        );

                    },
                    80
                );

                finishRoundTwo();
            }

            async function handleRoundThreeChoice(
                playerId
            ) {

                closeChoicePanel();

                /*
                * Единственный лжец Раунда 3 —
                * Инкогнито.
                */
                if (
                    playerId !== "incognito"
                ) {

                    wrongAnswer(
                        playerId
                    );

                    return;
                }

                /*
                * Правильный ответ.
                */
                choiceButton.disabled =
                    true;

                clearHighlight();

                incognitoImg.classList.add(
                    "poker-player-correct"
                );

                question.textContent =
                    "ЛЖЕЦ НАЙДЕН";

                setFeedback(
                    "ПРАВИЛЬНО"
                );


                /* =================================================
                ОБЪЯСНЕНИЕ ЛОГИКИ РАУНДА 3
                ================================================= */

                const proof =
                    document.createElement(
                        "div"
                    );

                proof.className =
                    "poker-proof";

                proof.innerHTML =
                    "<div class=\"poker-proof-title\">ПОЧЕМУ ИНКОГНИТО ЛЖЁТ</div>" +

                    "<div><strong>Q♦ + Q♥</strong> — уже пара на столе.</div>" +

                    "<div>Чтобы получить сет тузов или королей, нужны две карты одного ранга.</div>" +

                    "<div>Но тогда вместе с <strong>Q-Q</strong> это уже фулл-хаус.</div>" +

                    "<div>Сет валетов невозможна: <strong>J♥ + J♦</strong> у ТаКу, <strong>J♠</strong> на столе.</div>" +

                    "<div>Поэтому единственный лжец — <strong>Инкогнито</strong>.</div>";

                stage.appendChild(
                    proof
                );

                context.timeout(
                    function () {

                        proof.classList.add(
                            "is-visible"
                        );

                    },
                    80
                );

                await wait(
                    1400
                );

                await finishPokerVictory();
            }

            async function finishPokerVictory() {

                /*
                * Убираем обычный интерфейс Покера.
                */
                closeChoicePanel();

                dialoguePanel.style.display =
                    "none";

                dialoguePanel.classList.remove(
                    "is-visible"
                );

                combinationsPanel.style.display =
                    "none";

                choiceButton.style.display =
                    "none";

                dialogueButton.style.display =
                    "none";

                combinationsButton.style.display =
                    "none";

                question.textContent =
                    "";

                setFeedback(
                    ""
                );

                /*
                * Казино больше не играет фоном.
                */
                if (
                    pokerAmbientSound
                ) {

                    pokerAmbientSound.pause();

                    pokerAmbientSound.currentTime =
                        0;
                }

                /*
                * Золотой дождь.
                */
                const coinRain =
                    document.createElement(
                        "div"
                    );

                coinRain.className =
                    "poker-victory-coin-rain";

                for (
                    let i = 0;
                    i < 120;
                    i += 1
                ) {

                    const coin =
                        document.createElement(
                            "span"
                        );

                    coin.className =
                        "poker-victory-coin";

                    coin.style.setProperty(
                        "--coin-x",
                        (Math.random() * 100) + "%"
                    );

                    coin.style.setProperty(
                        "--coin-size",
                        (14 + Math.random() * 24) + "px"
                    );

                    coin.style.setProperty(
                        "--coin-delay",
                        (Math.random() * 0.8) + "s"
                    );

                    coin.style.setProperty(
                        "--coin-duration",
                        (1.9 + Math.random() * 1.8) + "s"
                    );

                    coin.style.setProperty(
                        "--coin-drift",
                        (-140 + Math.random() * 280) + "px"
                    );

                    coin.style.setProperty(
                        "--coin-spin",
                        (540 + Math.random() * 1080) + "deg"
                    );

                    coinRain.appendChild(
                        coin
                    );
                }

                stage.appendChild(
                    coinRain
                );

                /*
                * Черный слой пока невидим.
                */
                const blackout =
                    document.createElement(
                        "div"
                    );

                blackout.className =
                    "poker-victory-blackout";

                stage.appendChild(
                    blackout
                );

                /*
                * ФАНФАРЫ
                */
                pokerVictoryFanfare.currentTime =
                    0;

                const fanfarePromise =
                    pokerVictoryFanfare.play();

                if (
                    fanfarePromise &&
                    typeof fanfarePromise.catch ===
                        "function"
                ) {

                    fanfarePromise.catch(
                        function (error) {

                            console.warn(
                                "Не удалось запустить poker_victory_fanfare.mp3:",
                                error
                            );
                        }
                    );
                }

                /*
                * ЗВОН МОНЕТ
                */
                pokerCoinRainSound.currentTime =
                    0;

                const coinSoundPromise =
                    pokerCoinRainSound.play();

                if (
                    coinSoundPromise &&
                    typeof coinSoundPromise.catch ===
                        "function"
                ) {

                    coinSoundPromise.catch(
                        function (error) {

                            console.warn(
                                "Не удалось запустить poker_coin_rain.mp3:",
                                error
                            );
                        }
                    );
                }

                /*
                * Ждём кульминацию фанфар.
                */
                await wait(
                    2800
                );

                /*
                * ВСЁ ВНЕЗАПНО ОБРЫВАЕТСЯ
                */

                /*
                * Останавливаем фанфары.
                */
                pokerVictoryFanfare.pause();
                pokerVictoryFanfare.currentTime = 0;

                /*
                * Останавливаем звон монет.
                */
                pokerCoinRainSound.pause();
                pokerCoinRainSound.currentTime = 0;

                /*
                * ПОЛНОСТЬЮ ОЧИЩАЕМ ПОКЕР.
                * Сам stage оставляем в DOM,
                * чтобы на нём остался чёрный экран.
                */
                Array.from(
                    scene.screen.children
                ).forEach(
                    function (child) {

                        if (
                            child !== stage
                        ) {

                            child.remove();
                        }
                    }
                );

                stage.innerHTML = "";

                stage.appendChild(
                    blackout
                );

                /*
                * ЧЁРНЫЙ ЭКРАН.
                * Резко. Без плавного затемнения.
                */
                blackout.classList.add(
                    "is-visible"
                );

                /*
                * Короткая абсолютная тишина.
                */
                await wait(
                    180
                );

                /*
                * ГОСПОЖА ОРЁТ «НЕЕТ!!!»
                * Только голос. Никакой Госпожи на экране.
                */
                await playPokerVoice(
                    "poker_chance_20.mp3"
                );

                await wait(
                    450
                );

                /*
                * Переход в финальную комнату.
                */
                context.goTo(
                    "casino_outro",
                    {
                        checkpointId:
                            "casino_outro",

                        save:
                            false,

                        saveReason:
                            "Покер лжецов завершён"
                    }
                );
            }

            async function finishRoundTwo() {

                await wait(
                    1200
                );

                /*
                * Госпожа Шанс
                */
                await playPokerVoice(
                    "poker_chance_17.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    400
                );

                /*
                * ТаКу
                */
                await playPokerVoice(
                    "poker_taku_6.mp3"
                );

                await wait(
                    500
                );

                /*
                * Госпожа Шанс
                */
                await playPokerVoice(
                    "poker_chance_18.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    900
                );

                await startPokerRound3();
            }

            async function startPokerRound3() {

                currentPokerRound = 3;

                const oldProof =
                    stage.querySelector(
                        ".poker-proof"
                    );

                if (oldProof) {
                    oldProof.remove();
                }

                clearHighlight();

                setFeedback(
                    ""
                );

                question.textContent =
                    "";

                choiceButton.disabled =
                    true;

                /*
                * Меняем заголовок
                */
                const headerRound =
                    header.querySelector(
                        "span"
                    );

                if (headerRound) {

                    headerRound.textContent =
                        "РАУНД 3 · ЛЖЕЦОВ: 1";
                }

                /*
                * Вне игры: A♣
                */
                revealOutOfPlayCard(
                    "Ac"
                );

                await wait(
                    700
                );

                /*
                * ТаКу: J♥ + J♦
                */
                replaceTakuCards(
                    "Jh",
                    "Jd"
                );

                await wait(
                    700
                );

                /*
                * Стол:
                * Q♦ — A♠ — K♦ — J♠ — Q♥
                */
                await dealCommunityCards([
                    "Qd",
                    "As",
                    "Kd",
                    "Js",
                    "Qh"
                ]);

                await wait(
                    900
                );

                await playRoundThreeStatements();
            }

            Object.keys(
                choiceHitboxes
            ).forEach(
                function (key) {

                    context.on(
                        choiceHitboxes[key],
                        "click",
                        function () {

                            if (
                                choiceButton.disabled
                            ) {
                                return;
                            }

                            /*
                            * РАУНД 1
                            */
                            if (
                                currentPokerRound === 1
                            ) {

                                if (
                                    key === "golem"
                                ) {

                                    correctAnswer();

                                } else {

                                    wrongAnswer(
                                        key
                                    );
                                }

                                return;
                            }

                            /*
                            * РАУНД 2
                            */
                            if (
                                currentPokerRound === 2
                            ) {

                                handleRoundTwoChoice(
                                    key
                                );

                                return;
                            }

                            if (
                                currentPokerRound === 3
                            ) {

                                handleRoundThreeChoice(
                                    key
                                );

                                return;
                            }
                        }
                    );
                }
            );

            /* =================================================
               КНОПКИ ПАНЕЛЕЙ
               ================================================= */

            context.on(
                combinationsButton,
                "click",
                function () {

                    if (
                        combinationsPanel.style.display !==
                        "none"
                    ) {

                        closePanel(
                            combinationsPanel
                        );

                        return;
                    }

                    openPanel(
                        combinationsPanel
                    );
                }
            );

            context.on(
                dialogueButton,
                "click",
                function () {

                    if (
                        dialoguePanel.style.display !==
                        "none"
                    ) {

                        closePanel(
                            dialoguePanel
                        );

                        return;
                    }

                    populateDialoguePanel();

                    openPanel(
                        dialoguePanel
                    );
                }
            );

            context.on(
                choiceButton,
                "click",
                function () {

                    if (
                        choiceButton.disabled
                    ) {
                        return;
                    }

                    if (
                        choicePanel.style.display !==
                        "none"
                    ) {

                        closeChoicePanel();

                        return;
                    }

                    openChoicePanel();
                }
            );

            /* =================================================
               КАРТЫ ФЛОП / TURN / RIVER
               ================================================= */

            const pokerCardDealSound =
                new Audio(
                    "assets/audio/poker_cards.mp3"
                );

            pokerCardDealSound.preload =
                "auto";

            const pokerWrongSound =
                new Audio(
                    "assets/audio/poker_wrong.mp3"
                );

            pokerWrongSound.preload =
                "auto";

            pokerWrongSound.volume =
                0.8;

            const pokerVictoryFanfare =
                new Audio(
                    "assets/audio/poker_victory_fanfare.mp3"
                );

            pokerVictoryFanfare.preload =
                "auto";

            pokerVictoryFanfare.volume =
                0.85;


            const pokerCoinRainSound =
                new Audio(
                    "assets/audio/poker_coin_rain.mp3"
                );

            pokerCoinRainSound.preload =
                "auto";

            pokerCoinRainSound.volume =
                0.95;

            const pokerCardCueTimes = [
                330,
                740,
                1100,
                1460,
                2070
            ];

            async function dealCommunityCards(
                cardsToDeal
            ) {

                communitySlots[0].innerHTML =
                    "";

                communitySlots[1].innerHTML =
                    "";

                communitySlots[2].innerHTML =
                    "";

                communitySlots[3].innerHTML =
                    "";

                communitySlots[4].innerHTML =
                    "";

                const cards =
                    cardsToDeal || [
                    "Ad",
                    "Ah",
                    "Kd",
                    "Qc",
                    "Js"
                ];

                pokerCardDealSound.currentTime =
                    0;

                const playPromise =
                    pokerCardDealSound.play();

                if (
                    playPromise &&
                    typeof playPromise.catch ===
                        "function"
                ) {

                    playPromise.catch(
                        function (error) {

                            console.warn(
                                "Не удалось запустить poker_cards.mp3:",
                                error
                            );
                        }
                    );
                }

                let previousTime =
                    0;

                for (
                    let i = 0;
                    i < cards.length;
                    i += 1
                ) {

                    const waitTime =
                        pokerCardCueTimes[i] -
                        previousTime;

                    await wait(
                        waitTime
                    );

                    showCard(
                        communitySlots[i],
                        cards[i],
                        "poker-community-card"
                    );

                    previousTime =
                        pokerCardCueTimes[i];
                }
            }

            /* =================================================
               ОБУЧЕНИЕ
               ================================================= */

            async function playPokerTutorial() {

                /*
                 * 1
                 */

                await wait(
                    900
                );

                await playPokerVoice(
                    "poker_chance_1.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    450
                );

                /*
                 * 2
                 */

                await playPokerVoice(
                    "poker_taku_1.mp3"
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_chance_2.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    1800
                );

                /*
                 * В конце этого блока:
                 * «Это Покер лжецов.»
                 * «В этой игре всего шестнадцать карт...»
                 */

                await playPokerVoice(
                    "poker_taku_2.mp3"
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_chance_3.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    700
                );

                await playPokerVoice(
                    "poker_taku_3.mp3"
                );

                await wait(
                    500
                );

                /*
                 * poker_chance_4:
                 * «И кто говорит правду.
                 * Для этого тебе придётся считать.
                 * У каждого игрока две карты.»
                 */

                await playPokerVoice(
                    "poker_chance_4.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    250
                );

                revealNPCBacks();

                /*
                 * Дадим картам закончить появление.
                 */

                await wait(
                    700
                );

                /*
                 * poker_chance_5:
                 * пять карт на столе
                 */

                await playPokerVoice(
                    "poker_chance_5.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    250
                );

                revealCommunitySlots();

                await wait(
                    700
                );

                /*
                 * poker_chance_6:
                 * карта вне игры
                 */

                await playPokerVoice(
                    "poker_chance_6.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    250
                );

                revealOutOfPlayPanel();

                await wait(
                    700
                );

                /*
                 * poker_chance_7:
                 * карты ТаКу
                 */

                await playPokerVoice(
                    "poker_chance_7.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    250
                );

                replaceTakuCards();

                await wait(
                    700
                );

                /*
                 * poker_chance_8:
                 * что именно знает ТаКу
                 */

                await playPokerVoice(
                    "poker_chance_8.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    250
                );

                pulseElement(
                    outOfPlayPanel
                );

                communityArea.classList.add(
                    "poker-info-highlight"
                );

                takuRealCards.forEach(
                    function (card) {

                        card.classList.add(
                            "poker-info-highlight"
                        );
                    }
                );

                await wait(
                    900
                );

                communityArea.classList.remove(
                    "poker-info-highlight"
                );

                takuRealCards.forEach(
                    function (card) {

                        card.classList.remove(
                            "poker-info-highlight"
                        );
                    }
                );

                /*
                 * poker_chance_9:
                 * появляется кнопка КОМБИНАЦИИ
                 */

                await playPokerVoice(
                    "poker_chance_9.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    250
                );

                combinationsButton.style.display =
                    "block";

                combinationsButton.classList.add(
                    "is-visible"
                );

                /*
                 * poker_chance_10:
                 * «Забудешь — смотри сюда.»
                 */

                await playPokerVoice(
                    "poker_chance_10.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                pulseElement(
                    combinationsButton
                );

                await wait(
                    700
                );

                /*
                 * poker_chance_11
                 */

                await playPokerVoice(
                    "poker_chance_11.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    500
                );

                /*
                 * poker_taku_4
                 */

                await playPokerVoice(
                    "poker_taku_4.mp3"
                );

                await wait(
                    500
                );

                /*
                 * poker_chance_12
                 */

                await playPokerVoice(
                    "poker_chance_12.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    1400
                );

                /*
                 * =============================================
                 * ОБУЧЕНИЕ ЗАКОНЧИЛОСЬ
                 * НАЧИНАЕТСЯ РАУНД 1
                 * =============================================
                 */

                question.textContent =
                    "";

                setFeedback(
                    ""
                );

                await wait(
                    500
                );

                /*
                 * Реальная карта вне игры.
                 */

                revealOutOfPlayCard(
                    "Kc"
                );

                await wait(
                    700
                );

                /*
                 * Пять общих карт.
                 * poker_cards.mp3 содержит пять раскладываний.
                 */

                await dealCommunityCards();

                await wait(
                    900
                );

                await playRoundOneStatements();
            }

            /* =================================================
            РАУНД 2
            ================================================= */

            async function startPokerRound2() {

                currentPokerRound = 2;
                roundTwoFoundLiars = [];

                /*
                * Убираем результат Раунда 1
                */
                const oldProof =
                    stage.querySelector(
                        ".poker-proof"
                    );

                if (oldProof) {

                    oldProof.remove();
                }

                clearHighlight();

                setFeedback(
                    ""
                );

                question.textContent =
                    "";

                /*
                * Меняем надпись РАУНД 1 → РАУНД 2
                */
                const headerRound =
                    header.querySelector(
                        "span"
                    );

                if (headerRound) {

                    headerRound.textContent =
                        "РАУНД 2 · ЛЖЕЦОВ: 2";
                }

                /*
                * Новая карта вне игры
                * A♣
                */
                revealOutOfPlayCard(
                    "Ac"
                );

                await wait(
                    700
                );

                /*
                * Новые карты ТаКу
                * J♥ + J♦
                */
                replaceTakuCards(
                    "Jh",
                    "Jd"
                );

                await wait(
                    700
                );

                /*
                * Новые пять карт на столе
                */
                await dealCommunityCards([
                    "Qs",
                    "Qh",
                    "Kd",
                    "As",
                    "Js"
                ]);

                await wait(
                    900
                );

                /*
                * Начинаются заявления Раунда 2
                */
                await playRoundTwoStatements();
            }

            /* =================================================
               ЗАЯВЛЕНИЯ РАУНДА 1
               ================================================= */

            async function playRoundOneStatements() {

                /*
                 * Пока аудио заявлений ещё не заданы,
                 * здесь стоят подготовленные имена файлов.
                 * Их потом просто заменим, если названия
                 * будут другими.
                 */

                await playPokerVoice(
                    "poker_rich_man_1.mp3",
                    richManImg,
                    ASSETS.pokerRichManIdle,
                    ASSETS.pokerRichManTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_golem_1.mp3",
                    golemImg,
                    ASSETS.pokerGolemIdle,
                    ASSETS.pokerGolemTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_incognito_1.mp3",
                    incognitoImg,
                    ASSETS.pokerIncognitoIdle,
                    ASSETS.pokerIncognitoTalk
                );

                await wait(
                    500
                );

                /*
                 * В голосе Госпожи:
                 * «У меня сет.»
                 */

                await playPokerVoice(
                    "poker_chance_13.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    900
                );

                /*
                 * Теперь игроку можно думать.
                 */

                question.textContent =
                    "КТО ВРЁТ?";

                choiceButton.style.display =
                    "block";

                dialogueButton.style.display =
                    "block";

                combinationsButton.style.display =
                    "block";

                choiceButton.disabled =
                    false;

                choiceButton.classList.add(
                    "is-visible"
                );

                dialogueButton.classList.add(
                    "is-visible"
                );

                combinationsButton.classList.add(
                    "is-visible"
                );

                setFeedback(
                    ""
                );
            }

            async function playRoundTwoStatements() {

                await playPokerVoice(
                    "poker_chance_16.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_rich_man_2.mp3",
                    richManImg,
                    ASSETS.pokerRichManIdle,
                    ASSETS.pokerRichManTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_golem_2.mp3",
                    golemImg,
                    ASSETS.pokerGolemIdle,
                    ASSETS.pokerGolemTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_incognito_2.mp3",
                    incognitoImg,
                    ASSETS.pokerIncognitoIdle,
                    ASSETS.pokerIncognitoTalk
                );

                await wait(
                    900
                );

                question.textContent =
                    "КТО ВРЁТ?";

                choiceButton.style.display =
                    "block";

                dialogueButton.style.display =
                    "block";

                combinationsButton.style.display =
                    "block";

                choiceButton.disabled =
                    false;

                choiceButton.classList.add(
                    "is-visible"
                );

                dialogueButton.classList.add(
                    "is-visible"
                );

                combinationsButton.classList.add(
                    "is-visible"
                );

                setFeedback(
                    ""
                );
            }

            async function playRoundThreeStatements() {

                await playPokerVoice(
                    "poker_chance_19.mp3",
                    ladyImg,
                    ASSETS.ladySeatedIdle,
                    ASSETS.ladySeatedTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_rich_man_3.mp3",
                    richManImg,
                    ASSETS.pokerRichManIdle,
                    ASSETS.pokerRichManTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_golem_3.mp3",
                    golemImg,
                    ASSETS.pokerGolemIdle,
                    ASSETS.pokerGolemTalk
                );

                await wait(
                    500
                );

                await playPokerVoice(
                    "poker_incognito_3.mp3",
                    incognitoImg,
                    ASSETS.pokerIncognitoIdle,
                    ASSETS.pokerIncognitoTalk
                );

                await wait(
                    900
                );

                question.textContent =
                    "КТО ВРЁТ?";

                choiceButton.style.display =
                    "block";

                dialogueButton.style.display =
                    "block";

                combinationsButton.style.display =
                    "block";

                choiceButton.disabled =
                    false;

                choiceButton.classList.add(
                    "is-visible"
                );

                dialogueButton.classList.add(
                    "is-visible"
                );

                combinationsButton.classList.add(
                    "is-visible"
                );

                setFeedback(
                    ""
                );
            }

            /* =================================================
   ВРЕМЕННЫЙ ЗАПУСК РАУНДА 1 БЕЗ ОБУЧЕНИЯ
   ================================================= */

            async function startPokerRound1Direct() {

                currentPokerRound = 1;
                roundTwoFoundLiars = [];

                question.textContent =
                    "";

                setFeedback(
                    ""
                );

                /*
                * Показываем карты NPC и ТаКу
                */
                revealNPCBacks();

                await wait(
                    700
                );

                /*
                * Показываем центральные карты
                */
                revealCommunitySlots();

                await wait(
                    700
                );

                /*
                * Показываем карту вне игры
                */
                revealOutOfPlayPanel();

                await wait(
                    500
                );

                revealOutOfPlayCard(
                    "Kc"
                );

                await wait(
                    500
                );

                /*
                * Настоящие карты ТаКу
                */
                replaceTakuCards();

                await wait(
                    500
                );

                /*
                * Пять общих карт
                */
                await dealCommunityCards();

                await wait(
                    900
                );

                /*
                * Заявления четырёх игроков
                */
                await playRoundOneStatements();
            }

            /* =================================================
               ЗАПУСК СЦЕНЫ
               ================================================= */

            addHud(
                scene.screen,
                context,
                "Магическое казино · Покер лжецов"
            );

            root.appendChild(
                scene.screen
            );

            context.timeout(
                function () {

                    scene.screen.classList.add(
                        "casino-ready"
                    );

                    pokerAmbientSound.play().catch(
                        function (error) {

                            console.warn(
                                "Не удалось запустить casino_vip_ambient.mp3:",
                                error
                            );
                        }
                    );

                    playPokerTutorial();

                },
                100
            );
        },

        unmount: function () {}
    };

    /* =========================================================
   ФИНАЛ КАЗИНО
   ========================================================= */

    game.scenes.casino_outro = {

        id:
            "casino_outro",

        mount:
            function (
                root,
                context
            ) {

                game.state.patch({
                    activePlayer:
                        "taku"
                });


                /*
                * ВАЖНО:
                * Финальная локация —
                * security_bg, а не обычный
                * зал казино.
                */
                const scene =
                    makeScreen(
                        "casino-outro-screen",
                        ASSETS.securityBg
                    );

                const stage =
                    scene.stage;

                const pokerSealMagicSound =
                    new Audio(
                        "assets/audio/poker_seal_magic.mp3"
                    );

                pokerSealMagicSound.preload =
                    "auto";

                pokerSealMagicSound.volume =
                    0.9;
                /*
                * Затемнение перехода
                */
                const revealVeil =
                    document.createElement(
                        "div"
                    );

                revealVeil.className =
                    "casino-final-reveal-veil";

                stage.appendChild(
                    revealVeil
                );


                /*
                * Госпожа Шанс
                */
                const lady =
                    image(
                        ASSETS.ladyIdle,
                        "casino-lady casino-final-lady",
                        "Госпожа Шанс"
                    );

                stage.appendChild(
                    lady
                );


                /*
                * Закрытое хранилище
                */
                const vaultClosed =
                    image(
                        ASSETS.vaultClosed,
                        "casino-final-vault casino-final-vault-closed is-visible",
                        "Закрытое хранилище"
                    );


                /*
                * Открытое хранилище
                */
                const vaultOpen =
                    image(
                        ASSETS.vaultOpen,
                        "casino-final-vault casino-final-vault-open",
                        "Открытое хранилище"
                    );


                /*
                * Печать
                */
                const seal =
                    image(
                        ASSETS.cunningSeal,
                        "casino-final-seal",
                        "Печать Хитрости"
                    );


                stage.append(
                    vaultClosed,
                    vaultOpen,
                    seal
                );


                /*
                * Финальные субтитры
                */
                const subtitle =
                    document.createElement(
                        "div"
                    );

                subtitle.className =
                    "casino-final-subtitle";


                const subtitleSpeaker =
                    document.createElement(
                        "span"
                    );

                subtitleSpeaker.className =
                    "casino-final-subtitle-speaker";


                const subtitleText =
                    document.createElement(
                        "div"
                    );

                subtitleText.className =
                    "casino-final-subtitle-text";


                subtitle.append(
                    subtitleSpeaker,
                    subtitleText
                );

                stage.appendChild(
                    subtitle
                );


                /*
                * Наградная карточка
                */
                const rewardCard =
                    document.createElement(
                        "article"
                    );

                rewardCard.className =
                    "casino-final-seal-card panel";


                rewardCard.innerHTML =

                    "<p class=\"eyebrow\">" +
                        "КАЗИНО ПРИЗНАЛО" +
                    "</p>" +

                    "<h2>" +
                        "ПЕЧАТЬ ХИТРОСТИ" +
                    "</h2>" +

                    "<div class=\"casino-final-seal-card-image\">" +
                        "<img src=\"" +
                            ASSETS.cunningSeal +
                        "\" alt=\"Печать Хитрости\">" +
                    "</div>" +

                    "<p>" +
                        "Ты играла по правилам. " +
                        "И заставила казино признать поражение." +
                    "</p>" +

                    "<small>" +
                        "ИСПЫТАНИЕ КАЗИНО · ПРОЙДЕНО" +
                    "</small>";


                const claimButton =
                    game.mechanics.createButton(
                        "ЗАБРАТЬ ПЕЧАТЬ",
                        "gold-button casino-final-claim-button"
                    );

                claimButton.disabled =
                    true;

                claimButton.classList.add(
                    "is-disabled"
                );


                rewardCard.appendChild(
                    claimButton
                );

                stage.appendChild(
                    rewardCard
                );


                /*
                * Голос финальной сцены
                */
                function playCasinoFinalVoice(
                    file,
                    speaker,
                    text
                ) {

                    return new Promise(
                        function (
                            resolve
                        ) {

                            subtitleSpeaker.textContent =
                                speaker ||
                                "";

                            subtitleText.textContent =
                                text ||
                                "";

                            subtitle.classList.add(
                                "is-visible"
                            );


                            if (
                                speaker ===
                                "ГОСПОЖА ШАНС"
                            ) {

                                lady.src =
                                    ASSETS.ladyTalk;

                                lady.classList.add(
                                    "is-talking"
                                );

                            } else {

                                lady.src =
                                    ASSETS.ladyIdle;

                                lady.classList.remove(
                                    "is-talking"
                                );
                            }


                            const audio =
                                new Audio(
                                    "assets/audio/" +
                                    file
                                );

                            audio.preload =
                                "auto";


                            let finished =
                                false;


                            function finish() {

                                if (
                                    finished
                                ) {
                                    return;
                                }

                                finished =
                                    true;


                                audio.removeEventListener(
                                    "ended",
                                    finish
                                );

                                audio.removeEventListener(
                                    "error",
                                    finish
                                );


                                if (
                                    speaker ===
                                    "ГОСПОЖА ШАНС"
                                ) {

                                    lady.src =
                                        ASSETS.ladyIdle;

                                    lady.classList.remove(
                                        "is-talking"
                                    );
                                }


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


                            const playPromise =
                                audio.play();


                            if (
                                playPromise &&
                                typeof playPromise.catch ===
                                    "function"
                            ) {

                                playPromise.catch(
                                    function () {

                                        finish();
                                    }
                                );
                            }


                            context.timeout(
                                finish,
                                8000
                            );
                        }
                    );
                }


                async function say(
                    file,
                    speaker,
                    text,
                    pauseAfter
                ) {

                    await playCasinoFinalVoice(
                        file,
                        speaker,
                        text
                    );

                    subtitle.classList.remove(
                        "is-visible"
                    );

                    await wait(
                        pauseAfter ||
                        400
                    );
                }


                function wait(
                    ms
                ) {

                    return new Promise(
                        function (
                            resolve
                        ) {

                            context.timeout(
                                resolve,
                                ms
                            );
                        }
                    );
                }


                /*
                * Вся финальная сцена
                */
                async function runFinalScene() {

                    await wait(
                        700
                    );


                    /*
                    * Переход из черноты
                    */
                    revealVeil.classList.add(
                        "is-cleared"
                    );

                    await wait(
                        700
                    );


                    /*
                    * 1
                    */
                    await say(
                        "poker_chance_24.mp3",
                        "ГОСПОЖА ШАНС",
                        "Это не победа.",
                        500
                    );


                    /*
                    * 2
                    */
                    await say(
                        "poker_taku_7.mp3",
                        "ТаКу",
                        "Очень похоже на неё.",
                        650
                    );


                    /*
                    * 3
                    */
                    await say(
                        "poker_chance_25.mp3",
                        "ГОСПОЖА ШАНС",
                        "Ты не выиграла моё казино. Ты лишила его права на красивую ложь.",
                        650
                    );


                    /*
                    * 4
                    */
                    await say(
                        "poker_taku_8.mp3",
                        "ТаКу",
                        "А Печать?",
                        600
                    );


                    /*
                    * 5
                    */
                    await say(
                        "poker_chance_26.mp3",
                        "ГОСПОЖА ШАНС",
                        "Я не отдаю печати победителям.",
                        1000
                    );

                    vaultClosed.classList.remove(
                        "is-visible"
                    );

                    vaultOpen.classList.add(
                        "is-visible"
                    );

                    /*
                    * Магия открытия Хранилища.
                    */
                    pokerSealMagicSound.currentTime =
                        0;

                    const magicPlayPromise =
                        pokerSealMagicSound.play();

                    if (
                        magicPlayPromise &&
                        typeof magicPlayPromise.catch ===
                            "function"
                    ) {

                        magicPlayPromise.catch(
                            function (error) {

                                console.warn(
                                    "Не удалось запустить poker_seal_magic.mp3:",
                                    error
                                );
                            }
                        );
                    }

                    await wait(
                        700
                    );


                    /*
                    * Появляется Печать
                    */
                    seal.classList.add(
                        "is-visible"
                    );

                    await wait(
                        1800
                    );

                    lady.remove();
                    /*
                    * Появляется карточка
                    */
                    rewardCard.classList.add(
                        "is-visible"
                    );


                    await wait(
                        350
                    );


                    /*
                    * «Забирай.»
                    */
                    await say(
                        "poker_chance_28.mp3",
                        "ГОСПОЖА ШАНС",
                        "Забирай.",
                        750
                    );

                    /*
                    * Только теперь кнопка становится активной.
                    */
                    claimButton.disabled =
                        false;

                    claimButton.classList.remove(
                        "is-disabled"
                    );

                    claimButton.classList.add(
                        "is-ready"
                    );

                    claimButton.focus();
                }


                /*
                * Получение Печати
                */
                context.on(
                    claimButton,
                    "click",
                    function () {

                        if (
                            claimButton.disabled
                        ) {

                            return;
                        }


                        claimButton.disabled =
                            true;


                        claimButton.classList.remove(
                            "is-ready"
                        );


                        claimButton.classList.add(
                            "is-claimed"
                        );


                        /*
                        * Вот здесь Печать
                        * реально записывается
                        * в состояние игры.
                        */
                        markCunningSeal();


                        subtitleSpeaker.textContent =
                            "КАЗИНО";

                        subtitleText.textContent =
                            "Печать Хитрости получена.";

                        subtitle.classList.add(
                            "is-visible"
                        );


                        context.timeout(
                            function () {

                                context.goTo(
                                    "board_after_casino",
                                    {
                                        checkpointId:
                                            "board_after_casino",

                                        save:
                                            true,

                                        saveReason:
                                            "Казино завершено: Печать Хитрости забрана"
                                    }
                                );

                            },
                            900
                        );
                    }
                );


                addHud(
                    scene.screen,
                    context,
                    "Магическое казино · Финал"
                );

                root.appendChild(
                    scene.screen
                );


                context.timeout(
                    function () {

                        scene.screen.classList.add(
                            "casino-ready"
                        );

                        runFinalScene();

                    },
                    80
                );
            },

            unmount:
                function () {}
    };

})(window);
