(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    game.scenes = game.scenes || {};
    let currentVoice = null;
    let arenaMusic = null;

    const ASSETS = {
        background: "assets/images/arena_bg.png",

        dragon: {
            idle: "assets/images/arena_dragon_idle.png",
            inhale: "assets/images/arena_dragon_inhale.png",
            tail: "assets/images/arena_dragon_tail.png",
            fire: "assets/images/arena_dragon_fire.png",
            watch: "assets/images/arena_dragon_watch.png",
            collarClose: "assets/images/arena_dragon_collar_close.png",
            controlEffect: "assets/images/arena_dragon_collar_effect.png"
        },

        beast: {
            idle: "assets/images/arena_beast_idle.png",
            paw: "assets/images/arena_beast_paw.png",
            swipe: "assets/images/arena_beast_swipe.png",
            charge: "assets/images/arena_beast_charge.png",
            watch: "assets/images/arena_beast_watch.png",
            collarClose: "assets/images/arena_beast_collar_close.png",
            controlEffect: "assets/images/arena_beast_collar_effect.png"
        },
            
        controlCore: "assets/images/arena_control_core.png",
        sealCourage: "assets/images/seal_courage.png",

        runes: {
            1: "assets/images/runa_1.png",
            2: "assets/images/runa_2.png",
            3: "assets/images/runa_3.png",
            4: "assets/images/runa_4.png",
            5: "assets/images/runa_5.png",
            6: "assets/images/runa_6.png",
            7: "assets/images/runa_7.png",
            8: "assets/images/runa_8.png"
        },

        button: "assets/images/button.png"
    };

    const ACTIONS = {
        duck: {
            label: "ПРИГНУТЬСЯ",
            icon: "↓",
            image: "assets/images/arena_action_duck.png"
        },

        sidestep: {
            label: "ШАГ В СТОРОНУ",
            icon: "↔",
            image: "assets/images/arena_action_sidestep.png"
        },

        jump: {
            label: "ПРЫЖОК",
            icon: "↑",
            image: "assets/images/arena_action_jump.png"
        },

        still: {
            label: "НИЧЕГО НЕ ДЕЛАТЬ",
            icon: "•",
            image: "assets/images/arena_action_still.png"
        }
    };

    const ATTACKS = [
        {
            id: "dragon-inhale-training",
            active: "dragon",
            dragon: "inhale",
            beast: null,
            answer: "duck",
            phase: "ОБУЧЕНИЕ · 1 ИЗ 6",
            success: "Да. Ты увидела, как он набирает силу. От огня лучше пригнуться."
        },
        {
            id: "beast-paw-training",
            active: "beast",
            dragon: null,
            beast: "paw",
            answer: "sidestep",
            phase: "ОБУЧЕНИЕ · 2 ИЗ 6",
            success: "Верно. Лапа поднялась - и ты уже ушла в сторону."
        },
        {
            id: "dragon-tail-training",
            active: "dragon",
            dragon: "tail",
            beast: null,
            answer: "jump",
            phase: "ОБУЧЕНИЕ · 3 ИЗ 6",
            success: "Правильно. Низкий хвост = прыгай выше удара."
        },
        {
            id: "dragon-watch-training",
            active: "dragon",
            dragon: "watch",
            beast: null,
            answer: "still",
            phase: "ОБУЧЕНИЕ · 4 ИЗ 6",
            success: "Именно. Не каждый взгляд заканчивается ударом."
        },
        {
            id: "beast-swipe-training",
            active: "beast",
            dragon: null,
            beast: "swipe",
            answer: "jump",
            phase: "ОБУЧЕНИЕ · 5 ИЗ 6",
            success: "Хорошо. Широкий замах = прыжок, и ты уже вне его досягаемости."
        },
        {
            id: "beast-charge-training",
            active: "beast",
            dragon: null,
            beast: "charge",
            answer: "duck",
            phase: "ОБУЧЕНИЕ · 6 ИЗ 6",
            success: "Да. Он пошёл низко - пригнись, и он пронесётся мимо."
        },

        {
            id: "battle-dragon-tail",
            active: "dragon",
            dragon: "tail",
            beast: "idle",
            answer: "jump",
            phase: "БОЙ · 7 ИЗ 10",
            success: "Хорошо. Ты увидела его раньше, чем он ударил."
        },
        {
            id: "battle-beast-paw",
            active: "beast",
            dragon: "idle",
            beast: "paw",
            answer: "sidestep",
            phase: "БОЙ · 8 ИЗ 10",
            success: "Верно. Лапа пошла в замах — шаг в сторону."
        },
        {
            id: "battle-beast-swipe",
            active: "beast",
            dragon: "idle",
            beast: "swipe",
            answer: "jump",
            phase: "БОЙ · 9 ИЗ 10",
            success: "Широкий замах. Уходи выше."
        },
        {
            id: "battle-dragon-inhale",
            active: "dragon",
            dragon: "inhale",
            beast: "idle",
            answer: "duck",
            phase: "БОЙ · 10 ИЗ 10",
            success: "Успела. Дракон набрал воздух — пригнись."
        }
    ];

    const RUNE_ROUNDS = [
        {
            id: 1,
            creature: "dragon",
            sequence: [1, 3, 4]
        },
        {
            id: 2,
            creature: "beast",
            sequence: [6, 8, 5, 7]
        },
        {
            id: 3,
            creature: "dragon",
            sequence: [2, 4, 1, 3, 2]
        }
    ];

    const FREEDOM_ROUNDS = [
        {
            id: 1,
            creature: "dragon",
            label: "КАНАЛ ДРАКОНА · 1",
            steps: [
                {
                    rune: 1,
                    state: "inhale",
                    answer: "duck"
                },
                {
                    rune: 3,
                    state: "tail",
                    answer: "jump"
                },
                {
                    rune: 4,
                    state: "watch",
                    answer: "still"
                }
            ]
        },

        {
            id: 2,
            creature: "beast",
            label: "КАНАЛ ЗВЕРЯ",
            steps: [
                {
                    rune: 6,
                    state: "paw",
                    answer: "sidestep"
                },
                {
                    rune: 8,
                    state: "swipe",
                    answer: "jump"
                },
                {
                    rune: 5,
                    state: "charge",
                    answer: "duck"
                },
                {
                    rune: 7,
                    state: "watch",
                    answer: "still"
                }
            ]
        },

        {
            id: 3,
            creature: "dragon",
            final: true,
            label: "АВАРИЙНЫЙ ЦИКЛ",
            steps: [
                {
                    rune: 2,
                    state: "watch",
                    answer: "still",
                    creature: "dragon"
                },
                {
                    rune: 4,
                    state: "swipe",
                    answer: "jump",
                    creature: "beast"
                },
                {
                    rune: 1,
                    state: "inhale",
                    answer: "duck",
                    creature: "dragon"
                },
                {
                    rune: 3,
                    state: "charge",
                    answer: "duck",
                    creature: "beast"
                },
                {
                    rune: 2,
                    state: "watch",
                    answer: "still",
                    creature: "dragon"
                }
            ]
        }
    ];

    FREEDOM_ROUNDS.forEach(function (round) {
        round.steps.forEach(function (step) {
            step.creature =
                step.creature ||
                round.creature;
        });
    });

    const ARENA_CONTROL_LINKS = [
        {
            id: "spark",
            signal: "✦",
            signalName: "ИСКРА",
            creature: "dragon",
            creatureName: "ДРАКОН",
            action: "fire",
            actionName: "ОГОНЬ"
        },
        {
            id: "moon",
            signal: "☾",
            signalName: "ЛУНА",
            creature: "beast",
            creatureName: "ЗВЕРЬ",
            action: "strike",
            actionName: "УДАР"
        },
        {
            id: "eye",
            signal: "◉",
            signalName: "ОКО",
            creature: "dragon",
            creatureName: "ДРАКОН",
            action: "rush",
            actionName: "РЫВОК"
        },
        {
            id: "crystal",
            signal: "◆",
            signalName: "КРИСТАЛЛ",
            creature: "beast",
            creatureName: "ЗВЕРЬ",
            action: "shock",
            actionName: "РАЗРЯД"
        }
    ];

    const ARENA_CONTROL_ACTIONS = [
        { id: "fire", label: "ОГОНЬ", icon: "ϟ" },
        { id: "strike", label: "УДАР", icon: "◆" },
        { id: "rush", label: "РЫВОК", icon: "➤" },
        { id: "shock", label: "РАЗРЯД", icon: "✦" }
    ];

    function makeScreen(className) {
        const screen = document.createElement("section");
        screen.className = "screen arena-screen " + className;
        return screen;
    }

    function createCreature(path, className, alt) {
        const image = game.mechanics.createImage(path, className, alt);
        image.addEventListener("error", function () {
            image.classList.add("asset-missing");
        });
        image.addEventListener("load", function () {
            image.classList.remove("asset-missing");
        });
        return image;
    }

    function setCreatureState(image, path, fallbackPath) {
        if (!image || !path) {
            return;
        }

        let fallbackUsed = false;
        image.onerror = function () {
            if (!fallbackUsed && fallbackPath && image.src.indexOf(fallbackPath) === -1) {
                fallbackUsed = true;
                image.src = fallbackPath;
                return;
            }
            image.classList.add("asset-missing");
        };
        image.onload = function () {
            image.classList.remove("asset-missing");
        };
        image.src = path;
    }

    function createArenaStage(screen) {
        const stage = document.createElement("div");
        stage.className = "arena-stage";

        const ambience = document.createElement("div");
        ambience.className = "arena-ambience";
        ambience.setAttribute("aria-hidden", "true");

        stage.appendChild(ambience);
        screen.appendChild(stage);
        return stage;
    }

    function createDialogueCard(context, speaker, text, buttonText, onNext) {
        const card = document.createElement("article");
        card.className = "arena-dialogue-card";

        const speakerEl = document.createElement("span");
        speakerEl.className = "arena-dialogue-speaker";
        speakerEl.textContent = speaker;

        const textEl = document.createElement("p");
        textEl.className = "arena-dialogue-text";
        textEl.textContent = text;

        const button = game.mechanics.createButton(buttonText || "ДАЛЬШЕ", "gold-button arena-dialogue-next");
        context.on(button, "click", onNext);

        card.append(speakerEl, textEl, button);
        return {
            card: card,
            speaker: speakerEl,
            text: textEl,
            button: button
        };
    }

    game.scenes.arena_intro = {
        id: "arena_intro",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "tuko" });

            const screen = makeScreen("arena-intro-screen");
            const stage = createArenaStage(screen);

            const title = document.createElement("div");
            title.className = "arena-intro-title";
            title.innerHTML =
                "<span>ГЛАВА III</span>" +
                "<h1>Древняя арена</h1>" +
                "<small>ГЛАВНЫЙ ИГРОК · ТуКо</small>";

            const dragon = createCreature(
                ASSETS.dragon.idle,
                "arena-creature arena-dragon arena-dragon-intro",
                "Дракон Арены"
            );

            const beast = createCreature(
                ASSETS.beast.idle,
                "arena-creature arena-beast arena-beast-intro",
                "Каменный зверь Арены"
            );

            const arenaVoices = [
                "arena_host_01.mp3",
                "arena_tuko_01.mp3",
                "arena_host_02.mp3",
                "arena_taku_01.mp3",
                "arena_tuko_02.mp3"
            ];

            let introFinished = false;

            function playArenaVoice(file) {
                return new Promise(function (resolve) {
                    currentVoice = new Audio("assets/audio/" + file);
                    currentVoice.volume = 1;

                    let finished = false;

                    function done() {
                        if (finished) {
                            return;
                        }

                        finished = true;

                        if (currentVoice) {
                            currentVoice.onended = null;
                            currentVoice.onerror = null;
                        }

                        resolve();
                    }

                    currentVoice.onended = done;
                    currentVoice.onerror = done;

                    currentVoice.play().catch(done);
                });
            }

            function pauseArenaIntro(ms) {
                return new Promise(function (resolve) {
                    global.setTimeout(resolve, ms);
                });
            }

            // =========================================================
            // МУЗЫКА АРЕНЫ
            // =========================================================

            arenaMusic = new Audio("assets/audio/music_arena.mp3");
            arenaMusic.loop = true;
            arenaMusic.volume = 0.45;

            arenaMusic.play().catch(function () {
                // Браузер может заблокировать autoplay.
                // В таком случае музыка будет запущена первым кликом.
            });

            const arenaButton = game.mechanics.createButton(
                "НА АРЕНУ",
                "gold-button arena-dialogue-next"
            );

            arenaButton.style.display = "none";

            context.on(arenaButton, "click", function () {
                if (!introFinished) {
                    return;
                }

                context.goTo("arena_read", {
                    checkpointId: "arena_read",
                    save: true,
                    saveReason: "вход в испытание Читай движение"
                });
            });

            stage.append(title, beast, dragon, arenaButton);
            screen.prepend(
                game.ui.createHud(context, {
                    title: "Древняя арена",
                    showPlayer: true
                })
            );
            root.appendChild(screen);

            // =========================================================
            // ВОСПРОИЗВЕДЕНИЕ ВСТУПЛЕНИЯ
            // =========================================================

            async function playArenaIntro() {
                await pauseArenaIntro(700);

                for (let i = 0; i < arenaVoices.length; i += 1) {
                    await playArenaVoice(arenaVoices[i]);

                    if (i < arenaVoices.length - 1) {
                        await pauseArenaIntro(850);
                    }
                }

                await pauseArenaIntro(900);

                introFinished = true;
                arenaButton.style.display = "";
                arenaButton.focus();
            }

            context.timeout(function () {
                screen.classList.add("arena-ready");

                playArenaIntro();
            }, 70);

        },

        unmount: function () {
            if (currentVoice) {
                currentVoice.pause();
                currentVoice.currentTime = 0;
                currentVoice = null;
            }

        }
    };

    game.scenes.arena_read = {
        id: "arena_read",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "tuko" });

            let attackIndex = 0;
            let totalErrors = 0;
            let locked = false;
            let stitchSoundTimer = null;
            const alreadyComplete = game.state.get().chapterProgress.arena >= 1;

            const screen = makeScreen("arena-read-screen");
            const stage = createArenaStage(screen);

            const header = document.createElement("div");
            header.className = "arena-task-header";
            header.innerHTML =
                "<span>ИСПЫТАНИЕ I · ЧИТАЙ ПРОТИВНИКА</span>" +
                "<strong>Не смотри на удар. Смотри на то, что происходит за мгновение до него.</strong>";

            const progress = document.createElement("div");
            progress.className = "arena-read-progress";

            for (let i = 0; i < ATTACKS.length; i += 1) {
                const dot = document.createElement("i");
                progress.appendChild(dot);
            }

            const phaseLabel = document.createElement("div");
            phaseLabel.className = "arena-attack-phase";

            const dragon = createCreature(
                ASSETS.dragon.idle,
                "arena-creature arena-dragon arena-read-dragon",
                "Дракон Арены"
            );
            const beast = createCreature(
                ASSETS.beast.idle,
                "arena-creature arena-beast arena-read-beast",
                "Каменный зверь Арены"
            );

            const actionBar = document.createElement("div");
            actionBar.className = "arena-action-bar";

            const actionButtons = {};
            Object.keys(ACTIONS).forEach(function (actionId) {
                const action = ACTIONS[actionId];
                const button = document.createElement("button");
                button.type = "button";
                button.className = "arena-action-button";
                button.dataset.action = actionId;
                button.innerHTML =
                    "<img class=\"arena-action-image\" src=\"" +
                    action.image +
                    "\" alt=\"\">" +
                    "<strong class=\"arena-reaction-label\">" +
                    action.label +
                    "</strong>";
                actionButtons[actionId] = button;
                actionBar.appendChild(button);
            });

            const feedback = document.createElement("div");
            feedback.className = "arena-read-feedback";
            feedback.setAttribute("role", "status");

            const stitchHint = document.createElement("button");
            stitchHint.type = "button";
            stitchHint.className = "arena-stitch-hint";
            stitchHint.innerHTML =
                "<img src=\"" + game.config.images.stitch + "\" alt=\"Стич\">" +
                "<span class=\"arena-stitch-symbol\">?</span>";

            const stitchHintSound =
                new Audio(
                    "assets/audio/3228b0eebfc7ef7.mp3"
                );

            stitchHintSound.volume = 0.5;

            const arenaBattleStartVoice =
                new Audio(
                    "assets/audio/arena_host_battle_start.mp3"
                );

            arenaBattleStartVoice.volume = 1;

            const arenaReadSfx = {
                "arena_dragon_breath.mp3":
                    new Audio(
                        "assets/audio/arena_dragon_breath.mp3"
                    ),

                "arena_beast_growl.mp3":
                    new Audio(
                        "assets/audio/arena_beast_growl.mp3"
                    ),

                "arena_evade.mp3":
                    new Audio(
                        "assets/audio/arena_evade.mp3"
                    )
            };

            const arenaCrowdSfx = {
                "arena_crowd_cheer.mp3":
                    new Audio(
                        "assets/audio/arena_crowd_cheer.mp3"
                    ),

                "arena_crowd_boo.mp3":
                    new Audio(
                        "assets/audio/arena_crowd_boo.mp3"
                    )
            };

            Object.keys(
                arenaReadSfx
            ).forEach(function (file) {
                arenaReadSfx[file].preload = "auto";
            });

            function unlockArenaReadAudio() {
                [
                    "arena_dragon_breath.mp3",
                    "arena_beast_growl.mp3"
                ].forEach(function (file) {
                    const audio =
                        arenaReadSfx[file];

                    audio.muted = true;

                    const promise =
                        audio.play();

                    if (
                        promise &&
                        typeof promise.then === "function"
                    ) {
                        promise.then(function () {
                            audio.pause();
                            audio.currentTime = 0;
                            audio.muted = false;
                        }).catch(function () {
                            audio.muted = false;
                        });
                    }
                });
            }

            function playArenaReadSfx(
                file,
                volume,
                onEnded
            ) {
                const audio =
                    arenaReadSfx[file];

                if (!audio) {
                    return;
                }

                audio.volume =
                    volume === undefined
                        ? 0.5
                        : volume;

                audio.currentTime = 0;
                audio.muted = false;

                audio.onended =
                    typeof onEnded === "function"
                        ? onEnded
                        : null;

                audio.play().catch(
                    function () {}
                );

                return audio;
            }

            function playArenaCrowdSfx(
                file,
                volume
            ) {
                const source =
                    arenaCrowdSfx[file];

                if (!source) {
                    return;
                }

                const audio =
                    source.cloneNode();

                audio.volume =
                    volume === undefined
                        ? 0.5
                        : volume;

                audio.currentTime = 0;

                audio.play().catch(
                    function () {}
                );

                return audio;
            }

            const completeCard = document.createElement("article");
            completeCard.className = "arena-read-complete";
            completeCard.innerHTML =
                "<span>ПЕРВЫЙ БОЙ ПРОЙДЕН</span>" +
                "<strong>ТуКо, ты выдержала все атаки. </strong>" +
                "<p>Десять атак - и ни одна не застала тебя врасплох. Там, где другие видят ярость, ты научилась видеть намерение.</p>" +
                "<small>ИСПЫТАНИЕ I · ПРОЙДЕНО</small>";

            const danceButton = game.mechanics.createButton(
                "СЛЕДУЮЩИЙ БОЙ",
                "gold-button arena-next-task-button"
            );

            context.on(danceButton, "click", function () {

                context.goTo("arena_dance", {

                    checkpointId: "arena_dance",

                    save: true,

                    saveReason: "вход в испытание Запомни сигнал"

                });

            });

            function replayFromStitch() {
                if (
                    showingSequence ||
                    roundIndex >= RUNE_ROUNDS.length
                ) {
                    return;
                }

                clearInactivityTimer();

                stitchHint.classList.remove("is-whining");

                showingSequence = true;
                locked = true;

                showSequence({
                    isReplay: true
                });
            }

            context.on(
                stitchHint,
                "click",
                function () {
                    replayFromStitch();
                }
            );

            completeCard.appendChild(danceButton);

            stage.append(
                header,
                progress,
                phaseLabel,
                beast,
                dragon,
                stitchHint,
                actionBar,
                feedback,
                completeCard
            );

            screen.prepend(game.ui.createHud(context, { title: "Арена · Читай движение", showPlayer: true }));
            root.appendChild(screen);

            function setCreatureVisibility(attack) {
                const dragonVisible = Boolean(attack.dragon);
                const beastVisible = Boolean(attack.beast);

                dragon.classList.toggle("is-visible", dragonVisible);
                beast.classList.toggle("is-visible", beastVisible);
                dragon.classList.toggle("is-active-threat", attack.active === "dragon");
                beast.classList.toggle("is-active-threat", attack.active === "beast");

                if (dragonVisible) {
                    setCreatureState(
                        dragon,
                        ASSETS.dragon[attack.dragon],
                        ASSETS.dragon.idle
                    );
                }

                if (beastVisible) {
                    setCreatureState(
                        beast,
                        ASSETS.beast[attack.beast],
                        ASSETS.beast.idle
                    );
                }
            }

            function clearButtonHints() {
                Object.keys(actionButtons).forEach(function (id) {
                    actionButtons[id].classList.remove("is-dimmed", "is-correct-flash", "is-wrong-flash");
                });
            }

            function updateProgress() {
                const dots = progress.querySelectorAll("i");
                dots.forEach(function (dot, index) {
                    dot.classList.toggle("is-done", index < attackIndex);
                    dot.classList.toggle("is-current", index === attackIndex && attackIndex < ATTACKS.length);
                });
            }

            function showStitchHint(
                answer,
                soundDelay
            ) {
                stitchHint.classList.add(
                    "is-visible"
                );

                stitchHint.querySelector(
                    ".arena-stitch-symbol"
                ).textContent =
                    ACTIONS[answer].icon;

                if (stitchSoundTimer) {
                    global.clearTimeout(
                        stitchSoundTimer
                    );

                    stitchSoundTimer = null;
                }

                const delay =
                    soundDelay === undefined
                        ? 0
                        : soundDelay;

                if (delay > 0) {
                    stitchSoundTimer =
                        context.timeout(
                            function () {
                                stitchHintSound.currentTime = 0;

                                stitchHintSound.play().catch(
                                    function () {}
                                );

                                stitchSoundTimer = null;
                            },
                            delay
                        );
                } else {
                    stitchHintSound.currentTime = 0;

                    stitchHintSound.play().catch(
                        function () {}
                    );
                }
            }

            function hideStitchHint() {
                stitchHint.classList.remove(
                    "is-visible"
                );

                if (stitchSoundTimer) {
                    global.clearTimeout(
                        stitchSoundTimer
                    );

                    stitchSoundTimer = null;
                }
            }

            function renderAttack() {
                if (attackIndex >= ATTACKS.length) {
                    finishTask(false);
                    return;
                }

                const attack = ATTACKS[attackIndex];
                locked = false;
                clearButtonHints();
                hideStitchHint();
                phaseLabel.textContent = attack.phase;
                feedback.textContent = attackIndex < 6
                    ? "Смотри внимательно. Противник выдаст себя раньше удара."
                    : "Теперь — только ты и противник.";

                setCreatureVisibility(attack);

                if (attack.answer !== "still") {
                    playArenaReadSfx(
                        attack.active === "dragon"
                            ? "arena_dragon_breath.mp3"
                            : "arena_beast_growl.mp3",
                        0.40
                    );
                }

                updateProgress();
                screen.classList.remove("arena-hit", "arena-evade");
            }

            function showImpact(attack, chosenAction) {
                if (attack.answer === "still") {
                return;
            }
                screen.classList.remove("arena-hit");
                void screen.offsetWidth;
                screen.classList.add("arena-hit");
                actionButtons[chosenAction].classList.add("is-wrong-flash");

                if (attack.active === "dragon" && attack.dragon === "inhale") {
                    setCreatureState(dragon, ASSETS.dragon.fire, ASSETS.dragon.idle);
                }
            }

            function restoreCueAfterImpact(attack) {
                setCreatureVisibility(attack);
                actionButtons[attack.answer].classList.remove("is-correct-flash");
            }

            function handleAction(actionId) {
                if (locked || attackIndex >= ATTACKS.length) {
                    return;
                }

                const attack = ATTACKS[attackIndex];

                if (actionId !== attack.answer) {
                    totalErrors += 1;
                    locked = true;
                    showImpact(attack, actionId);

                    playArenaCrowdSfx(
                        "arena_crowd_boo.mp3",
                        0.48
                    );
    
                    feedback.textContent =
                        attack.answer === "still"
                            ? "Не атакуй. Здесь - тишина."
                            : "Не верно. Смотри на позу противника внимательно";
                    if (totalErrors >= 1) {
                        showStitchHint(
                            attack.answer,
                            1100
                        );
                    }

                    if (
                        attackIndex < 6 &&
                        totalErrors >= 1
                    ) {
                        Object.keys(actionButtons).forEach(function (id) {
                            if (id !== attack.answer) {
                                actionButtons[id].classList.add("is-dimmed");
                            }
                        });
                    }

                    context.timeout(function () {
                        clearButtonHints();
                        if (
                            attackIndex < 6 &&
                            totalErrors >= 1
                        ) {
                            Object.keys(actionButtons).forEach(function (id) {
                                if (id !== attack.answer) {
                                    actionButtons[id].classList.add("is-dimmed");
                                }
                            });
                        }
                        restoreCueAfterImpact(attack);
                        locked = false;
                    }, 820);
                    return;
                }

                locked = true;

                actionButtons[actionId].classList.add(
                    "is-correct-flash"
                );

                playArenaReadSfx(
                    "arena_evade.mp3",
                    0.36,
                    function () {
                        playArenaCrowdSfx(
                            "arena_crowd_cheer.mp3",
                            0.52
                        );
                    }
                );

                screen.classList.remove(
                    "arena-evade"
                );
                void screen.offsetWidth;
                screen.classList.add("arena-evade");
                feedback.textContent = attack.success;
                hideStitchHint();

                attackIndex += 1;
                updateProgress();

                context.timeout(function () {
                    renderAttack();
                }, 1600);
            }

            Object.keys(actionButtons).forEach(function (actionId) {
                context.on(actionButtons[actionId], "click", function () {
                    unlockArenaReadAudio();
                    handleAction(actionId);
                });
            });

            function finishTask(fromSave) {
                attackIndex = ATTACKS.length;
                locked = true;
                updateProgress();
                hideStitchHint();
                screen.classList.add("arena-read-finished");
                phaseLabel.textContent = "АТАКИ РАСПОЗНАНЫ · 10 ИЗ 10";
                feedback.textContent = "";

                if (!fromSave) {
                    const progressState = game.state.get().chapterProgress;
                    game.state.patch({
                        chapterProgress: {
                            ...progressState,
                            arena: Math.max(progressState.arena, 1)
                        }
                    });
                    game.save.write("Арена: Читай движение пройдено");
                }
            }

            context.timeout(function () {
                screen.classList.add("arena-ready");

                if (alreadyComplete) {
                    finishTask(true);
                    return;
                }

                arenaBattleStartVoice.currentTime = 0;
                arenaBattleStartVoice.play().catch(function () {});

                renderAttack();
                actionButtons.duck.focus();
            }, 70);
        },

        unmount: function () {
            try {
                arenaBattleStartVoice.pause();
                arenaBattleStartVoice.currentTime = 0;
            } catch (error) {}
        }
    };

    game.scenes.arena_dance = {
        id: "arena_dance",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "tuko" });

            const alreadyComplete =
                game.state.get().chapterProgress.arena >= 2;

            const screen = makeScreen("arena-runes-screen");
            const stage = createArenaStage(screen);

            /*
            * =========================================================
            * НАСТРОЙКИ
            * =========================================================
            */

            const ZOOM_IN_MS = 900;
            const ZOOM_SETTLE_MS = 450;

            // Сколько времени конкретная руна остаётся видимой.
            const RUNE_HOLD_MS = 1500;

            // Интервал между вспышками.
            const RUNE_STEP_MS = 2050;

            // Возврат к общему плану.
            const ZOOM_OUT_MS = 800;

            // Пауза перед следующим раундом.
            const BETWEEN_ROUNDS_MS = 900;

            // Через минуту бездействия Стич начинает скулить.
            const INACTIVITY_MS = 15000;
            const arenaRunesStartVoice =
                new Audio(
                    "assets/audio/arena_host_runes_start.mp3"
                );

            arenaRunesStartVoice.volume = 1;

            /*
            * =========================================================
            * HEADER
            * =========================================================
            */

            const header = document.createElement("div");
            header.className = "arena-task-header arena-runes-header";

            header.innerHTML =
                "<span>ИСПЫТАНИЕ II · ЗАПОМНИ СИГНАЛ</span>" +
                "<strong>Не отводи взгляд. Проследи за рунами - запомни их порядок и повтори.</strong>";

            /*
            * =========================================================
            * ОБЩИЙ ПЛАН
            * =========================================================
            */

            const overview = document.createElement("div");
            overview.className = "arena-runes-overview";

            const overviewDragon = createCreature(
                ASSETS.dragon.idle,
                "arena-creature arena-runes-overview-dragon",
                "Дракон Арены"
            );

            const overviewBeast = createCreature(
                ASSETS.beast.idle,
                "arena-creature arena-runes-overview-beast",
                "Каменный зверь Арены"
            );

            overviewDragon.classList.add("is-visible");
            overviewBeast.classList.add("is-visible");

            overview.append(
                overviewDragon,
                overviewBeast
            );

            /*
            * =========================================================
            * CLOSE-UP ОШЕЙНИКА
            * =========================================================
            */

            const collarShot =
                document.createElement("div");

            collarShot.className =
                "arena-runes-collar-shot";

            const collarImage =
                document.createElement("img");

            collarImage.className =
                "arena-runes-collar-image";

            /*
            * ---------------------------------------------------------
            * ЛОКАЛЬНЫЕ BLUR-ЗОНЫ
            *
            * ВАЖНО:
            * Они не содержат изображений рун.
            *
            * backdrop-filter размывает именно тот участок
            * настоящего collarClose, который находится под ним.
            * ---------------------------------------------------------
            */

            const collarSideLeft =
                document.createElement("div");

            collarSideLeft.className =
                "arena-runes-collar-side-blur arena-runes-collar-side-left";

            const collarSideRight =
                document.createElement("div");

            collarSideRight.className =
                "arena-runes-collar-side-blur arena-runes-collar-side-right";

            const collarSideLeftUpper =
                document.createElement("div");

            collarSideLeftUpper.className =
                "arena-runes-collar-side-blur arena-runes-collar-side-left-upper";

            const collarSideRightUpper =
                document.createElement("div");

            collarSideRightUpper.className =
                "arena-runes-collar-side-blur arena-runes-collar-side-right-upper";

            const runeBlurZones = {};

            for (let runeId = 1; runeId <= 8; runeId += 1) {
                const zone =
                    document.createElement("div");

                zone.className =
                    "arena-runes-rune-blur-zone " +
                    "arena-runes-rune-" +
                    runeId;

                zone.dataset.runeId =
                    String(runeId);

                runeBlurZones[runeId] = zone;

                collarShot.appendChild(zone);
            }

            collarShot.append(
                collarImage,
                collarSideLeft,
                collarSideRight,
                collarSideLeftUpper,
                collarSideRightUpper
            );

            /*
            * =========================================================
            * СТАТУС
            * =========================================================
            */

            const phaseLabel =
                document.createElement("div");

            phaseLabel.className =
                "arena-runes-phase";

            const roundLabel =
                document.createElement("div");

            roundLabel.className =
                "arena-runes-round";

            const sequenceProgress =
                document.createElement("div");

            sequenceProgress.className =
                "arena-runes-sequence-progress";

            const feedback =
                document.createElement("div");

            feedback.className =
                "arena-runes-feedback";

            feedback.setAttribute(
                "role",
                "status"
            );

            /*
            * =========================================================
            * КНОПКИ
            * =========================================================
            */

            const runeBoard =
                document.createElement("div");

            runeBoard.className =
                "arena-runes-board";

            const runeButtons = {};

            for (let runeId = 1; runeId <= 8; runeId += 1) {
                const button =
                    document.createElement("button");

                button.type = "button";
                button.className =
                    "arena-rune-button";

                button.dataset.runeId =
                    String(runeId);

                button.style.backgroundImage =
                    'url("' + ASSETS.button + '")';

                const rune =
                    document.createElement("img");

                rune.className =
                    "arena-rune-button-image";

                rune.src =
                    ASSETS.runes[runeId];

                rune.alt =
                    "Руна " + runeId;

                rune.draggable = false;

                button.appendChild(rune);

                runeButtons[runeId] =
                    button;

                runeBoard.appendChild(button);
            }

            /*
            * =========================================================
            * СТИЧ
            * =========================================================
            */

            const stitchHint =
                document.createElement("button");

            stitchHint.type = "button";

            stitchHint.className =
                "arena-runes-stitch";

            stitchHint.setAttribute(
                "aria-label",
                "Попросить Стича показать последовательность ещё раз"
            );

            stitchHint.innerHTML =
                "<img src=\"" +
                game.config.images.stitch +
                "\" alt=\"Стич\">" +
                "<span class=\"arena-runes-stitch-label\"></span>" +
                "<small class=\"arena-runes-stitch-help\"></small>";

            /* Стич остаётся кликабельным, но визуально это только его изображение. */
            stitchHint.style.background = "transparent";
            stitchHint.style.border = "0";
            stitchHint.style.borderRadius = "0";
            stitchHint.style.boxShadow = "none";
            stitchHint.style.padding = "7px";

            const stitchLabel = stitchHint.querySelector(".arena-runes-stitch-label");
            const stitchHelp = stitchHint.querySelector(".arena-runes-stitch-help");
            const stitchWhineSound =
                new Audio("assets/audio/3228b0eebfc7ef7.mp3");

            stitchWhineSound.volume = 0.5;
            const runeClickSound =
                new Audio("assets/audio/arena_evade.mp3");

            runeClickSound.volume = 0.28;
            const roundWinCrowdSound =
                new Audio("assets/audio/arena_crowd_cheer.mp3");

            roundWinCrowdSound.volume = 0.55;
    

            if (stitchLabel) {
                stitchLabel.style.display = "none";
            }

            if (stitchHelp) {
                stitchHelp.style.display = "none";
            }

            /*
            * =========================================================
            * РАУНД ПРОЙДЕН
            * =========================================================
            */

            function completeRound() {
                clearInactivityTimer();

                locked = true;

                setButtonsEnabled(
                    false
                );

                feedback.textContent =
                    "Последовательность восстановлена.";

                screen.classList.remove(
                    "round-success"
                );

                void screen.offsetWidth;

                screen.classList.add(
                    "round-success"
                );

                context.timeout(
                    function () {
                        roundIndex +=
                            1;

                        if (
                            roundIndex >=
                            RUNE_ROUNDS.length
                        ) {
                            finishTask(
                                false
                            );

                            return;
                        }

                        screen.classList.remove(
                            "round-success"
                        );

                        context.timeout(
                            function () {
                                showSequence();
                            },
                            BETWEEN_ROUNDS_MS
                        );
                    },
                    650
                );
            }


            /*
            * =========================================================
            * ФИНИШ
            * =========================================================
            */

            const completeCard =
                document.createElement("article");

            completeCard.className =
                "arena-runes-complete";

            completeCard.innerHTML =
                "<span>РУНЫ ОТВЕТИЛИ</span>" +
                "<strong>ТуКо, ты поймала ритм ошейника.</strong>" +
                "<p>Теперь его сигналы можно повернуть против того, " +
                "кто держит зверей в цепи.</p>" +
                "<small>ИСПЫТАНИЕ II · ПРОЙДЕНО</small>";

            const nextButton =
                game.mechanics.createButton(
                    "РАЗОРВАТЬ СВЯЗЬ",
                    "gold-button arena-next-task-button"
                );

            context.on(
                nextButton,
                "click",
                function () {
                    context.goTo(
                        "arena_freedom_seal",
                        {
                            checkpointId:
                                "arena_freedom_seal",
                            save: true,
                            saveReason:
                                "вход в испытание Разорви связь"
                        }
                    );
                }
            );

            completeCard.appendChild(
                nextButton
            );

            /*
            * =========================================================
            * СЦЕНА
            * =========================================================
            */

            stage.append(
                overview,
                collarShot,
                header,
                phaseLabel,
                roundLabel,
                sequenceProgress,
                runeBoard,
                feedback,
                stitchHint,
                completeCard
            );

            screen.prepend(
                game.ui.createHud(
                    context,
                    {
                        title:
                            "Арена · Запомни сигнал",
                        showPlayer: true
                    }
                )
            );

            root.appendChild(screen);

            /*
            * =========================================================
            * СОСТОЯНИЕ
            * =========================================================
            */

            let roundIndex = 0;
            let inputIndex = 0;
            let activeSequence = [];

            let showingSequence = false;
            let locked = false;

            let inactivityTimer = null;
            let animationToken = 0;

            /*
            * =========================================================
            * ПОЗИЦИИ РУН
            *
            * Это центры зон blur.
            * После первого просмотра можем подправить.
            * =========================================================
            */

            const DRAGON_RUNE_POSITIONS = {
                1: { x: 35, y: 65 },
                2: { x: 40, y: 68 },
                3: { x: 57, y: 70 },
                4: { x: 62, y: 67 }
            };

            const BEAST_RUNE_POSITIONS = {
                5: { x: 32, y: 66 },
                6: { x: 38, y: 70 },
                7: { x: 57, y: 71 },
                8: { x: 64, y: 67 }
            };

            const DRAGON_SIDE_BLUR = {
                left: {
                    left: 30,
                    top: 55,
                    width: 5,
                    height: 15,
                    angle: -15
                },
                right: {
                    right: 32,
                    top: 58,
                    width: 5,
                    height: 17,
                    angle: 22
                }
            };

            const BEAST_SIDE_BLUR = {
                left: [
                    {
                        left: 25,
                        top: 55,
                        width: 5,
                        height: 20,
                        angle: -17
                    },
                    {
                        left: 24,
                        top: 42,
                        width: 4,
                        height: 7,
                        angle: 4
                    }
                ],
                right: [
                    {
                        right: 27,
                        top: 55,
                        width: 6,
                        height: 21,
                        angle: 32.5
                    },
                    {
                        right: 23,
                        top: 38,
                        width: 4,
                        height: 9,
                        angle: 5
                    }
                ]
            };

            /*
            * =========================================================
            * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
            * =========================================================
            */

            function clearInactivityTimer() {
                if (inactivityTimer) {
                    global.clearTimeout(
                        inactivityTimer
                    );

                    inactivityTimer = null;
                }
            }

            function resetInactivityTimer() {
                clearInactivityTimer();

                stitchHint.classList.remove(
                    "is-whining"
                );

                stitchLabel.style.display =
                    "none";

                stitchHelp.style.display =
                    "none";

                stitchLabel.textContent = "";

                stitchHelp.textContent = "";


                if (
                    locked ||
                    showingSequence ||
                    roundIndex >=
                        RUNE_ROUNDS.length
                ) {
                    return;
                }

                inactivityTimer =
                    global.setTimeout(
                        function () {
                            stitchHint.classList.add(
                                "is-whining"
                            );

                            stitchLabel.textContent =
                                "Я ВСЁ ЗАПОМНИЛ";

                            stitchHelp.textContent =
                                "НАЖМИ — ПОКАЖУ";

                            stitchLabel.style.display =
                                "block";

                            stitchHelp.style.display =
                                "block";

                            stitchWhineSound.currentTime = 0;

                            stitchWhineSound.play().catch(
                                function () {}
                            );
                        },
                        INACTIVITY_MS
                    );
            }

            function setButtonsEnabled(
                enabled
            ) {
                Object.keys(
                    runeButtons
                ).forEach(
                    function (id) {
                        runeButtons[id].disabled =
                            !enabled;
                    }
                );
            }

            function clearButtonStates() {
                Object.keys(
                    runeButtons
                ).forEach(
                    function (id) {
                        runeButtons[id].classList.remove(
                            "is-correct",
                            "is-wrong"
                        );
                    }
                );
            }

            function updateSequenceProgress(
                current
            ) {
                sequenceProgress.innerHTML =
                    "";

                for (
                    let i = 0;
                    i < activeSequence.length;
                    i += 1
                ) {
                    const dot =
                        document.createElement("i");

                    if (i < current) {
                        dot.className =
                            "is-done";
                    } else if (
                        i === current
                    ) {
                        dot.className =
                            "is-current";
                    }

                    sequenceProgress.appendChild(
                        dot
                    );
                }
            }

            function setCollar(creature) {
                const source =
                    creature === "dragon"
                        ? ASSETS.dragon.collarClose
                        : ASSETS.beast.collarClose;

                collarImage.src = source;

                collarShot.dataset.creature = creature;

                positionSideBlurZones(creature);
            }

            function positionSideBlurZones(creature) {

                /* =========================
                ДРАКОН — ничего не меняем
                ========================= */

                if (creature === "dragon") {

                    const settings = DRAGON_SIDE_BLUR;

                    collarSideLeft.style.display = "";
                    collarSideRight.style.display = "";

                    collarSideLeftUpper.style.display = "none";
                    collarSideRightUpper.style.display = "none";

                    collarSideLeft.style.left =
                        settings.left.left + "%";

                    collarSideLeft.style.top =
                        settings.left.top + "%";

                    collarSideLeft.style.width =
                        settings.left.width + "%";

                    collarSideLeft.style.height =
                        settings.left.height + "%";

                    collarSideLeft.style.transform =
                        "translate(-50%, -50%) rotate(" +
                        settings.left.angle +
                        "deg)";

                    collarSideRight.style.right =
                        settings.right.right + "%";

                    collarSideRight.style.top =
                        settings.right.top + "%";

                    collarSideRight.style.width =
                        settings.right.width + "%";

                    collarSideRight.style.height =
                        settings.right.height + "%";

                    collarSideRight.style.transform =
                        "translate(50%, -50%) rotate(" +
                        settings.right.angle +
                        "deg)";

                    return;
                }


                /* =========================
                ЗВЕРЬ — два блюра слева
                и два справа
                ========================= */

                const leftBlurs = [
                    collarSideLeft,
                    collarSideLeftUpper
                ];

                const rightBlurs = [
                    collarSideRight,
                    collarSideRightUpper
                ];


                leftBlurs.forEach(function (blur, index) {

                    const settings =
                        BEAST_SIDE_BLUR.left[index];

                    blur.style.display = "";

                    blur.style.left =
                        settings.left + "%";

                    blur.style.top =
                        settings.top + "%";

                    blur.style.width =
                        settings.width + "%";

                    blur.style.height =
                        settings.height + "%";

                    blur.style.transform =
                        "translate(-50%, -50%) rotate(" +
                        settings.angle +
                        "deg)";
                });


                rightBlurs.forEach(function (blur, index) {

                    const settings =
                        BEAST_SIDE_BLUR.right[index];

                    blur.style.display = "";

                    blur.style.right =
                        settings.right + "%";

                    blur.style.top =
                        settings.top + "%";

                    blur.style.width =
                        settings.width + "%";

                    blur.style.height =
                        settings.height + "%";

                    blur.style.transform =
                        "translate(50%, -50%) rotate(" +
                        settings.angle +
                        "deg)";
                });
            }

            function getRunePosition(
                runeId,
                creature
            ) {
                const positions =
                    creature === "dragon"
                        ? DRAGON_RUNE_POSITIONS
                        : BEAST_RUNE_POSITIONS;

                return positions[runeId] || null;
            }

            /*
            * Проставляем геометрию 4 blur-зон.
            *
            * У дракона активны 1-4.
            * У зверя активны 5-8.
            */

            function positionBlurZones(
                creature
            ) {
                Object.keys(
                    runeBlurZones
                ).forEach(
                    function (id) {
                        const runeId =
                            Number(id);

                        const position =
                            getRunePosition(
                                runeId,
                                creature
                            );

                        const zone =
                            runeBlurZones[
                                runeId
                            ];

                        if (
                            !position ||
                            !zone
                        ) {
                            zone.style.display =
                                "none";
                            return;
                        }

                        zone.style.display =
                            "";

                        zone.style.left =
                            position.x + "%";

                        zone.style.top =
                            position.y + "%";
                    }
                );
            }

            /*
            * Все rune blur-зоны включаем.
            */

            function blurAllRunes(
                creature
            ) {
                Object.keys(
                    runeBlurZones
                ).forEach(
                    function (id) {
                        const runeId =
                            Number(id);

                        const position =
                            getRunePosition(
                                runeId,
                                creature
                            );

                        if (!position) {
                            runeBlurZones[
                                runeId
                            ].style.display =
                                "none";

                            return;
                        }

                        runeBlurZones[
                            runeId
                        ].style.display =
                            "";

                        runeBlurZones[
                            runeId
                        ].classList.remove(
                            "is-clear"
                        );
                    }
                );

                collarShot.classList.add(
                    "runic-blur-active"
                );
            }

            /*
            * Убираем blur только с одной
            * реальной руны ошейника.
            */

            function revealRune(
                runeId,
                creature
            ) {
                blurAllRunes(
                    creature
                );

                const zone =
                    runeBlurZones[
                        runeId
                    ];

                if (!zone) {
                    return;
                }

                zone.classList.add(
                    "is-clear"
                );

                collarShot.classList.remove(
                    "rune-flash"
                );

                void collarShot.offsetWidth;

                collarShot.classList.add(
                    "rune-flash"
                );
            }

            function hideRuneFocus() {
                Object.keys(
                    runeBlurZones
                ).forEach(
                    function (id) {
                        runeBlurZones[id]
                            .classList.remove(
                                "is-clear"
                            );
                    }
                );

                collarShot.classList.remove(
                    "rune-flash"
                );
            }

            /*
            * =========================================================
            * ОБЩИЙ ПЛАН
            * =========================================================
            */

            function resetOverview() {
                screen.classList.remove(
                    "focus-dragon",
                    "focus-beast",
                    "is-zooming",
                    "is-collar",
                    "is-returning",
                    "round-success"
                );
            }

            function prepareOverview(
                creature
            ) {
                resetOverview();

                if (
                    creature === "dragon"
                ) {
                    screen.classList.add(
                        "focus-dragon"
                    );
                } else {
                    screen.classList.add(
                        "focus-beast"
                    );
                }
            }

            /*
            * =========================================================
            * ПОКАЗ ПОСЛЕДОВАТЕЛЬНОСТИ
            * =========================================================
            */

            function showSequence(
                options
            ) {
                options =
                    options || {};

                if (
                    roundIndex >=
                        RUNE_ROUNDS.length ||
                    screen.classList.contains(
                        "arena-runes-finished"
                    )
                ) {
                    return;
                }

                clearInactivityTimer();

                animationToken += 1;

                const token =
                    animationToken;

                const round =
                    RUNE_ROUNDS[
                        roundIndex
                    ];

                const creature =
                    round.creature;

                activeSequence =
                    round.sequence.slice();

                inputIndex = 0;
                showingSequence = true;
                locked = true;

                setButtonsEnabled(
                    false
                );

                clearButtonStates();

                updateSequenceProgress(
                    0
                );

                setCollar(
                    creature
                );

                positionBlurZones(
                    creature
                );

                blurAllRunes(
                    creature
                );

                prepareOverview(
                    creature
                );

                phaseLabel.textContent =
                    [
                        "ПЕРВАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ",
                        "ВТОРАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ",
                        "ТРЕТЬЯ ПОСЛЕДОВАТЕЛЬНОСТЬ"
                    ][roundIndex];

                roundLabel.textContent =
                    "";

                feedback.textContent =
                    options.isReplay
                        ? "СТИЧ, ПОКАЖИ ЕЩЁ РАЗ."
                        : "СМОТРИ ВНИМАТЕЛЬНО.";

                /*
                * ---------------------------------------------------------
                * 1. ОБЩИЙ ПЛАН
                * ---------------------------------------------------------
                */

                screen.classList.add(
                    "is-zooming"
                );

                /*
                * ---------------------------------------------------------
                * 2. ZOOM В ОШЕЙНИК
                * ---------------------------------------------------------
                */

                context.timeout(
                    function () {
                        if (
                            token !==
                            animationToken
                        ) {
                            return;
                        }

                        screen.classList.remove(
                            "is-zooming"
                        );

                        screen.classList.add(
                            "is-collar"
                        );

                        feedback.textContent =
                            "ОН ПРОБУЖДАЕТСЯ.";
                    },
                    ZOOM_IN_MS
                );

                /*
                * ---------------------------------------------------------
                * 3. ПОСЛЕДОВАТЕЛЬНОСТЬ
                * ---------------------------------------------------------
                */

                activeSequence.forEach(
                    function (
                        runeId,
                        index
                    ) {
                        context.timeout(
                            function () {
                                if (
                                    token !==
                                    animationToken
                                ) {
                                    return;
                                }

                                /*
                                * В одной последовательности
                                * сейчас всегда руны одного
                                * монстра.
                                */

                                const
                                    runeCreature =
                                        runeId <=
                                        4
                                            ? "dragon"
                                            : "beast";

                                revealRune(
                                    runeId,
                                    runeCreature
                                );

                                roundLabel.textContent =
                                    "СИГНАЛ · " +
                                    ["I", "II", "III", "IV", "V"][index];

                                feedback.textContent =
                                    [
                                        "ПЕРВЫЙ СИГНАЛ.",
                                        "ВТОРОЙ СИГНАЛ.",
                                        "ТРЕТИЙ СИГНАЛ.",
                                        "ЧЕТВЁРТЫЙ СИГНАЛ.",
                                        "ПЯТЫЙ СИГНАЛ."
                                    ][index];

                                updateSequenceProgress(
                                    index
                                );
                            },
                            ZOOM_IN_MS +
                                ZOOM_SETTLE_MS +
                                index *
                                    RUNE_STEP_MS
                        );

                        /*
                        * Через RUNE_HOLD_MS
                        * эта руна снова становится
                        * размытой.
                        */

                        context.timeout(
                            function () {
                                if (
                                    token !==
                                    animationToken
                                ) {
                                    return;
                                }

                                hideRuneFocus();
                            },
                            ZOOM_IN_MS +
                                ZOOM_SETTLE_MS +
                                index *
                                    RUNE_STEP_MS +
                                RUNE_HOLD_MS
                        );
                    }
                );

                /*
                * ---------------------------------------------------------
                * 4. ZOOM OUT
                * ---------------------------------------------------------
                */

                const sequenceEnd =
                    ZOOM_IN_MS +
                    ZOOM_SETTLE_MS +
                    activeSequence.length *
                        RUNE_STEP_MS;

                context.timeout(
                    function () {
                        if (
                            token !==
                            animationToken
                        ) {
                            return;
                        }

                        hideRuneFocus();

                        screen.classList.remove(
                            "is-collar"
                        );

                        screen.classList.add(
                            "is-returning"
                        );

                        feedback.textContent =
                            "НЕ ЗАБЫЛА? ТЕПЕРЬ ПОВТОРИ.";
                    },
                    sequenceEnd
                );

                /*
                * ---------------------------------------------------------
                * 5. ВВОД
                * ---------------------------------------------------------
                */

                context.timeout(
                    function () {
                        if (
                            token !==
                            animationToken
                        ) {
                            return;
                        }

                        screen.classList.remove(
                            "is-returning"
                        );

                        showingSequence =
                            false;

                        locked = false;

                        setButtonsEnabled(
                            true
                        );

                        feedback.textContent =
                            "Теперь повтори последовательность.";

                        updateSequenceProgress(
                            0
                        );

                        resetInactivityTimer();

                        if (
                            activeSequence[0] &&
                            runeButtons[
                                activeSequence[0]
                            ]
                        ) {
                            runeButtons[
                                activeSequence[0]
                            ].focus();
                        }
                    },
                    sequenceEnd +
                        ZOOM_OUT_MS
                );
            }

            /*
            * =========================================================
            * СТИЧ
            * =========================================================
            */

            function replayFromStitch() {
                if (
                    showingSequence ||
                    roundIndex >= RUNE_ROUNDS.length
                ) {
                    return;
                }

                clearInactivityTimer();

                stitchHint.classList.remove("is-whining");

                showingSequence = true;
                locked = true;

                showSequence({
                    isReplay: true
                });
            }

            context.on(
                stitchHint,
                "click",
                function () {
                    replayFromStitch();
                }
            );

            context.on(
                stitchHint,
                "keydown",
                function (event) {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();

                        replayFromStitch();
                    }
                }
            );

            /*
            * =========================================================
            * НАЖАТИЯ КНОПОК РУН
            * =========================================================
            */

            Object.keys(
                runeButtons
            ).forEach(
                function (runeId) {
                    context.on(
                        runeButtons[runeId],
                        "click",
                        function () {
                            if (
                                locked ||
                                showingSequence ||
                                inputIndex >=
                                    activeSequence.length
                            ) {
                                return;
                            }

                            clearInactivityTimer();

                            const expected =
                                activeSequence[
                                    inputIndex
                                ];

                            /*
                            * ОШИБКА
                            */

                            if (
                                Number(runeId) !==
                                expected
                            ) {
                                const button =
                                    runeButtons[
                                        runeId
                                    ];

                                button.classList.add(
                                    "is-wrong"
                                );

                                feedback.textContent =
                                    "Нет. Последовательность нарушена. Смотри ещё раз.";

                                locked = true;

                                context.timeout(
                                    function () {
                                        button.classList.remove(
                                            "is-wrong"
                                        );
                                    },
                                    500
                                );

                                context.timeout(
                                    function () {
                                        locked =
                                            false;

                                        showSequence({
                                            isReplay:
                                                true
                                        });
                                    },
                                    800
                                );

                                return;
                            }

                            /*
                            * ПРАВИЛЬНО
                            */

                            const button =
                                runeButtons[
                                    runeId
                                ];

                            button.classList.add(
                                "is-correct"
                            );

                            context.timeout(
                                function () {
                                    button.classList.remove(
                                        "is-correct"
                                    );
                                },
                                350
                            );

                            inputIndex +=
                                1;

                            runeClickSound.currentTime = 0;
                            runeClickSound.play().catch(
                                function () {}
                            );

                            updateSequenceProgress(
                                inputIndex
                            );

                            feedback.textContent =
                                "ПРИНЯТО · " +
                                ["I", "II", "III", "IV", "V"][inputIndex - 1];

                            if (
                                inputIndex >=
                                activeSequence.length
                            ) {
                                completeRound();
                            } else {
                                resetInactivityTimer();
                            }
                        }
                    );
                }
            );

            /*
            * =========================================================
            * ФИНИШ
            * =========================================================
            */

            function finishTask(
                fromSave
            ) {
                clearInactivityTimer();

                animationToken +=
                    1;

                locked = true;
                showingSequence =
                    false;

                hideRuneFocus();

                setButtonsEnabled(
                    false
                );

                screen.classList.remove(
                    "is-zooming",
                    "is-collar",
                    "is-returning",
                    "round-success"
                );

                screen.classList.add(
                    "arena-runes-finished"
                );

                completeCard.style.display =
                    "";

                if (!fromSave) {
                    roundWinCrowdSound.currentTime = 0;

                    roundWinCrowdSound.play().catch(
                        function () {}
                    );
                }

                if (!fromSave) {
                    const progressState =
                        game.state.get()
                            .chapterProgress;

                    game.state.patch({
                        chapterProgress: {
                            ...progressState,
                            arena: Math.max(
                                progressState.arena,
                                2
                            )
                        }
                    });

                    game.save.write(
                        "Арена: Последовательность рун запомнена"
                    );
                }
            }

            /*
            * =========================================================
            * СТАРТ
            * =========================================================
            */

            completeCard.style.display =
                "none";

            setButtonsEnabled(
                false
            );

            context.timeout(
                function () {
                    screen.classList.add(
                        "arena-ready"
                    );

                    if (alreadyComplete) {
                        finishTask(
                            true
                        );

                        return;
                    }

                    screen.classList.add(
                        "runes-intro-waiting"
                    );

                    arenaRunesStartVoice.currentTime = 0;

                    const voicePromise =
                        arenaRunesStartVoice.play();

                    if (
                        voicePromise &&
                        typeof voicePromise.then === "function"
                    ) {
                        voicePromise.then(
                            function () {
                                arenaRunesStartVoice.onended =
                                    function () {
                                        screen.classList.remove(
                                            "runes-intro-waiting"
                                        );

                                        showSequence();
                                    };
                            }
                        ).catch(
                            function () {
                                screen.classList.remove(
                                    "runes-intro-waiting"
                                );

                                showSequence();
                            }

                            
                        );
                    } else {
                        arenaRunesStartVoice.onended =
                            function () {
                                screen.classList.remove(
                                    "runes-intro-waiting"
                                );

                                showSequence();
                            };
                    }
                },
                120
            );
        },

        unmount: function () {}
    };
    
    game.scenes.arena_freedom_seal = {
        id: "arena_freedom_seal",

        mount: function (root, context) {
            game.state.patch({
                activePlayer: "tuko"
            });

            const alreadyComplete =
                game.state.get().chapterProgress.arena >= 3;

            const screen =
                makeScreen("arena-break-screen");

            const stage =
                createArenaStage(screen);

            /*
            * =========================================================
            * НАСТРОЙКИ
            * =========================================================
            */

            const ATTACK_DELAY = 550;
            const WRONG_DELAY = 820;
            const RUNE_BREAK_DELAY = 2000;
            const NEXT_STEP_DELAY = 850;
            const NEXT_ROUND_DELAY = 1500;
            const arenaFreedomStartVoice =
                new Audio(
                    "assets/audio/arena_host_freedom_start.mp3"
                );

            arenaFreedomStartVoice.volume = 1;

            /*
            * =========================================================
            * HEADER
            * =========================================================
            */

            const header =
                document.createElement("div");

            header.className =
                "arena-task-header arena-break-header";

            header.innerHTML =
                "<span>ИСПЫТАНИЕ III · РАЗОРВИ СВЯЗЬ</span>" +
                "<strong>Выживи. Найди руну. Разорви узел</strong>";

            /*
            * =========================================================
            * СОЗДАНИЕ СУЩЕСТВ
            * =========================================================
            */

            const dragon =
                createCreature(
                    ASSETS.dragon.idle,
                    "arena-creature arena-break-dragon",
                    "Дракон Арены"
                );

            const beast =
                createCreature(
                    ASSETS.beast.idle,
                    "arena-creature arena-break-beast",
                    "Каменный зверь Арены"
                );

            const dragonEffect =
                createCreature(
                    ASSETS.dragon.controlEffect,
                    "arena-creature arena-break-dragon-effect",
                    ""
                );

            const beastEffect =
                createCreature(
                    ASSETS.beast.controlEffect,
                    "arena-creature arena-break-beast-effect",
                    ""
                );

            /*
            * =========================================================
            * ЦЕНТРАЛЬНОЕ ЯДРО
            * =========================================================
            */

            const coreWrap =
                document.createElement("div");

            coreWrap.className =
                "arena-break-core-wrap";

            const coreImage =
                document.createElement("img");

            coreImage.src =
                ASSETS.controlCore;

            coreImage.alt =
                "Ядро управления ошейниками";

            coreImage.className =
                "arena-break-core";

            coreWrap.appendChild(coreImage);

            /*
            * =========================================================
            * РУНЫ 1–8
            * =========================================================
            */

            const runeButtons = {};

            const RUNE_POSITIONS = {
                1: { x: 50, y: 16.2 },
                2: { x: 76, y: 25},
                3: { x: 84, y: 49 },
                4: { x: 76, y: 74 },
                5: { x: 50, y: 81 },
                6: { x: 24, y: 74 },
                7: { x: 16, y: 49 },
                8: { x: 25, y: 25 }
            };

            Object.keys(RUNE_POSITIONS).forEach(
                function (runeId) {
                    const button =
                        document.createElement("button");

                    button.type = "button";
                    button.className =
                        "arena-break-rune";

                    button.dataset.rune =
                        runeId;

                    button.disabled = true;

                    button.innerHTML =
                        "<img src=\"" +
                        ASSETS.runes[runeId] +
                        "\" alt=\"Руна " +
                        runeId +
                        "\">";

                    const position =
                        RUNE_POSITIONS[runeId];

                    button.style.left =
                        position.x + "%";

                    button.style.top =
                        position.y + "%";

                    coreWrap.appendChild(button);

                    runeButtons[runeId] =
                        button;
                }
            );

            /*
            * =========================================================
            * МАГИЧЕСКАЯ ЭНЕРГЕТИЧЕСКАЯ СВЯЗЬ
            * =========================================================
            */

            const SVG_NS =
                "http://www.w3.org/2000/svg";

            const energySvg =
                document.createElementNS(
                    SVG_NS,
                    "svg"
                );

            energySvg.classList.add(
                "arena-break-energy-svg"
            );

            energySvg.setAttribute(
                "aria-hidden",
                "true"
            );

            energySvg.setAttribute(
                "preserveAspectRatio",
                "none"
            );

            const runeScreenPulse =
                document.createElement("div");

            runeScreenPulse.className =
                "arena-break-rune-screen-pulse";

            runeScreenPulse.setAttribute(
                "aria-hidden",
                "true"
            );

            /*
            * ---------------------------------------------------------
            * GRADIENT
            * ---------------------------------------------------------
            */

            const defs =
                document.createElementNS(
                    SVG_NS,
                    "defs"
                );

            const gradient =
                document.createElementNS(
                    SVG_NS,
                    "linearGradient"
                );

            gradient.id =
                "arena-break-energy-gradient";

            gradient.setAttribute(
                "x1",
                "0%"
            );

            gradient.setAttribute(
                "y1",
                "0%"
            );

            gradient.setAttribute(
                "x2",
                "100%"
            );

            gradient.setAttribute(
                "y2",
                "0%"
            );

            [
                {
                    offset: "0%",
                    color: "#65df8b",
                    opacity: "0.05"
                },
                {
                    offset: "24%",
                    color: "#9ff6bd",
                    opacity: "0.70"
                },
                {
                    offset: "50%",
                    color: "#fff0b8",
                    opacity: "1"
                },
                {
                    offset: "76%",
                    color: "#9ff6bd",
                    opacity: "0.72"
                },
                {
                    offset: "100%",
                    color: "#65df8b",
                    opacity: "0.05"
                }
            ].forEach(
                function (stopData) {
                    const stop =
                        document.createElementNS(
                            SVG_NS,
                            "stop"
                        );

                    stop.setAttribute(
                        "offset",
                        stopData.offset
                    );

                    stop.setAttribute(
                        "stop-color",
                        stopData.color
                    );

                    stop.setAttribute(
                        "stop-opacity",
                        stopData.opacity
                    );

                    gradient.appendChild(
                        stop
                    );
                }
            );

            defs.appendChild(
                gradient
            );

            energySvg.appendChild(
                defs
            );

            /*
            * ---------------------------------------------------------
            * 3 СВЕТЯЩИЕСЯ НИТИ
            * ---------------------------------------------------------
            */

            const energyStrands = [];

            const strandWidths = [
                3.2,
                1.7,
                1.05
            ];

            [
                -7,
                0,
                7
            ].forEach(
                function (offset, index) {
                    const strand =
                        document.createElementNS(
                            SVG_NS,
                            "path"
                        );

                    strand.id =
                        "arena-break-energy-strand-" +
                        (index + 1);

                    strand.classList.add(
                        "arena-break-energy-strand"
                    );

                    strand.dataset.offset =
                        String(offset);

                    strand.setAttribute(
                        "fill",
                        "none"
                    );

                    strand.setAttribute(
                        "stroke",
                        "url(#arena-break-energy-gradient)"
                    );

                    strand.setAttribute(
                        "stroke-width",
                        String(
                            strandWidths[index]
                        )
                    );

                    strand.setAttribute(
                        "stroke-linecap",
                        "round"
                    );

                    strand.setAttribute(
                        "vector-effect",
                        "non-scaling-stroke"
                    );

                    energySvg.appendChild(
                        strand
                    );

                    energyStrands.push(
                        strand
                    );
                }
            );

            /*
            * ---------------------------------------------------------
            * ДВИЖУЩИЕСЯ ЧАСТИЦЫ
            * ---------------------------------------------------------
            */

            const energyParticleGroup =
                document.createElementNS(
                    SVG_NS,
                    "g"
                );

            energyParticleGroup.classList.add(
                "arena-break-energy-particles"
            );

            energySvg.appendChild(
                energyParticleGroup
            );

            [
                0,
                1,
                2
            ].forEach(
                function (strandIndex) {
                    const strandId =
                        "arena-break-energy-strand-" +
                        (strandIndex + 1);

                    [
                        {
                            duration: "1.85s",
                            begin: "0s",
                            radius: 2.8
                        },
                        {
                            duration: "2.20s",
                            begin: "0.45s",
                            radius: 2.1
                        },
                        {
                            duration: "1.65s",
                            begin: "0.88s",
                            radius: 2.4
                        }
                    ].forEach(
                        function (particleData) {
                            const particle =
                                document.createElementNS(
                                    SVG_NS,
                                    "circle"
                                );

                            particle.classList.add(
                                "arena-break-energy-particle"
                            );

                            particle.setAttribute(
                                "r",
                                particleData.radius
                            );

                            particle.setAttribute(
                                "fill",
                                "#fff3bd"
                            );

                            const motion =
                                document.createElementNS(
                                    SVG_NS,
                                    "animateMotion"
                                );

                            motion.setAttribute(
                                "dur",
                                particleData.duration
                            );

                            motion.setAttribute(
                                "begin",
                                particleData.begin
                            );

                            motion.setAttribute(
                                "repeatCount",
                                "indefinite"
                            );

                            motion.setAttribute(
                                "rotate",
                                "auto"
                            );

                            const mpath =
                                document.createElementNS(
                                    SVG_NS,
                                    "mpath"
                                );

                            mpath.setAttribute(
                                "href",
                                "#" + strandId
                            );

                            motion.appendChild(
                                mpath
                            );

                            particle.appendChild(
                                motion
                            );

                            energyParticleGroup.appendChild(
                                particle
                            );
                        }
                    );
                }
            );

            /*
            * ---------------------------------------------------------
            * ЧАСТИЦЫ РАЗРУШЕНИЯ РУНЫ
            * ---------------------------------------------------------
            */

            const runeBreakParticleGroup =
                document.createElementNS(
                    SVG_NS,
                    "g"
                );

            runeBreakParticleGroup.classList.add(
                "arena-break-rune-particles"
            );

            energySvg.appendChild(
                runeBreakParticleGroup
            );

            const energyBreakBurstGroup =
                document.createElementNS(
                    SVG_NS,
                    "g"
                );

            energyBreakBurstGroup.classList.add(
                "arena-break-energy-break-burst"
            );

            energySvg.appendChild(
                energyBreakBurstGroup
            );

            /*
            * =========================================================
            * ACTION BUTTONS
            * =========================================================
            */

            const actionBar =
                document.createElement("div");

            actionBar.className =
                "arena-break-action-bar";

            const actionButtons = {};

            Object.keys(ACTIONS).forEach(
                function (actionId) {
                    const action =
                        ACTIONS[actionId];

                    const button =
                        document.createElement("button");

                    button.type = "button";
                    button.className =
                        "arena-break-action";

                    button.dataset.action =
                        actionId;

                    button.innerHTML =
                        "<img class=\"arena-action-image\" src=\"" +
                        action.image +
                        "\" alt=\"\">" +
                        "<strong class=\"arena-reaction-label\">" +
                        action.label +
                        "</strong>";

                    button.disabled = true;

                    actionButtons[actionId] =
                        button;

                    actionBar.appendChild(button);
                }
            );

            /*
            * =========================================================
            * СТАТУС
            * =========================================================
            */

            const phaseLabel =
                document.createElement("div");

            phaseLabel.className =
                "arena-break-phase";

            const roundLabel =
                document.createElement("div");

            roundLabel.className =
                "arena-break-round";

            const stepLabel =
                document.createElement("div");

            stepLabel.className =
                "arena-break-step";

            const feedback =
                document.createElement("div");

            feedback.className =
                "arena-break-feedback";

            feedback.setAttribute(
                "role",
                "status"
            );

            /*
            * =========================================================
            * СТИЧ
            * =========================================================
            */

            const stitchHint =
                document.createElement("button");

            stitchHint.type = "button";

            stitchHint.className =
                "arena-break-stitch";

            stitchHint.innerHTML =
                "<img src=\"" +
                game.config.images.stitch +
                "\" alt=\"Стич\">" +
                "<span class=\"arena-break-stitch-symbol\">?</span>" +
                "<small>Снова посмотреть атаку</small>";

            /*
            * =========================================================
            * ФИНИШ-КАРТОЧКА
            * =========================================================
            */
            const completeCard =
                document.createElement("article");

            completeCard.className =
                "arena-control-complete arena-seal-final-card";

            completeCard.innerHTML =
            "<span>АРЕНА ПОМНИТ</span>" +
            "<img class=\"arena-control-seal-image\" " +
                "src=\"" +
                ASSETS.sealCourage +
                "\" " +
                "alt=\"Печать Смелости\">" +
            "<strong>ПЕЧАТЬ СМЕЛОСТИ</strong>" +
            "<p>" +
                "Ты не подчинилась. Ты не отступила. " +
                "Ты разорвала цепь и освободила тех, " +
                "кого заставили сражаться. " +
                "Арена увидела твой выбор. За смелость - Печать твоя." +
            "</p>" +
            "<small>ИСПЫТАНИЕ АРЕНЫ · ПРОЙДЕНО</small>";

            let crowdCelebrationActive = false;
            let crowdCelebrationAudio = null;

            function startCrowdCelebration() {

                crowdCelebrationActive = true;

                function playNextCheer() {

                    if (!crowdCelebrationActive) {
                        return;
                    }

                    crowdCelebrationAudio =
                        playBreakSfx(
                            "crowdCheer",
                            0.92
                        );

                    if (!crowdCelebrationAudio) {
                        return;
                    }

                    crowdCelebrationAudio.addEventListener(
                        "ended",
                        function () {

                            if (!crowdCelebrationActive) {
                                return;
                            }

                            context.timeout(
                                playNextCheer,
                                120
                            );

                        },
                        {
                            once: true
                        }
                    );

                }

                playNextCheer();
            }

            function stopCrowdCelebration() {

                crowdCelebrationActive = false;

                if (crowdCelebrationAudio) {
                    try {
                        crowdCelebrationAudio.pause();
                        crowdCelebrationAudio.currentTime = 0;
                    } catch (error) {}
                    crowdCelebrationAudio = null;
                }
            }

            const continueButton =
                game.mechanics.createButton(
                    "ПОЛУЧИТЬ ПЕЧАТЬ",
                    "gold-button arena-control-main-button"
                );

            context.on(
                continueButton,
                "click",
                function () {
                    stopCrowdCelebration();

                     if (arenaMusic) {
                        arenaMusic.pause();
                        arenaMusic.currentTime = 0;
                        arenaMusic = null;
                    }

                    context.goTo("board_after_arena", {
                        checkpointId: "board_after_arena",
                        save: true,
                        saveReason: "возвращение на поле после Арены"
                    });
                }
            );

            completeCard.appendChild(
                continueButton
            );

            completeCard.style.display =
                "none";

            /*
            * =========================================================
            * СОСТОЯНИЕ
            * =========================================================
            */

            let roundIndex = 0;
            let stepIndex = 0;

            let activeStep = null;
            let locked = false;
            let runeOpen = false;

            let totalErrors = 0;

            let dragonCracks = 0;
            let beastCracks = 0;

            /*
            * =========================================================
            * SFX
            * =========================================================
            */

            const BREAK_SFX = {
                coreActivate:
                    "arena_core_activate.mp3",

                energyLoop:
                    "arena_energy_loop.mp3",

                energyBurst:
                    "arena_energy_burst.mp3",

                runeBreak:
                    "arena_rune_break.mp3",

                collarCrack:
                    "arena_collar_crack.mp3",

                coreDestroy:
                    "arena_core_destroy.mp3",

                dragonFreed:
                    "arena_dragon_freed.mp3",

                beastFreed:
                    "arena_beast_freed.mp3",

                crowdCheer:
                    "arena_crowd_cheer.mp3",

                evade:
                    "arena_evade.mp3",

                dragonBreath:
                    "arena_dragon_breath.mp3",

                beastGrowl:
                    "arena_beast_growl.mp3"
            };

            let energyLoopAudio = null;

            let coreActivatePlayed = false;

            let coreDestroyAudio =
                new Audio(
                    "assets/audio/" +
                    BREAK_SFX.coreDestroy
                );

            coreDestroyAudio.preload = "auto";
            coreDestroyAudio.load();

            let coreDestroyAudioUnlocked = false;

            let runeBreakParticleToken = 0;

            function playBreakSfx(
                soundId,
                volume,
                cutAfter
            ) {
                const file =
                    BREAK_SFX[soundId];

                if (!file) {
                    return;
                }

                const audio =
                    new Audio(
                        "assets/audio/" +
                        file
                    );

                audio.preload = "auto";
                audio.volume =
                    volume === undefined
                        ? 0.5
                        : volume;

                audio.play().catch(
                    function () {}
                );

                if (cutAfter) {
                    context.timeout(
                        function () {
                            try {
                                audio.pause();
                                audio.currentTime = 0;
                            } catch (error) {}
                        },
                        cutAfter
                    );
                }

                return audio;
            }

            function startEnergyLoop() {
                if (!energyLoopAudio) {
                    energyLoopAudio =
                        new Audio(
                            "assets/audio/" +
                            BREAK_SFX.energyLoop
                        );

                    energyLoopAudio.loop =
                        true;

                    energyLoopAudio.volume =
                        0.18;

                    energyLoopAudio.preload =
                        "auto";
                }

                if (
                    energyLoopAudio.paused
                ) {
                    energyLoopAudio.play().catch(
                        function () {}
                    );
                }
            }

            function stopEnergyLoop() {
                if (!energyLoopAudio) {
                    return;
                }

                try {
                    energyLoopAudio.pause();
                    energyLoopAudio.currentTime = 0;
                } catch (error) {}
            }

            /*
            * =========================================================
            * ПОЗИЦИЯ КАБЕЛЯ
            * =========================================================
            */

            const COLLAR_ANCHORS = {
                dragon: {
                    x: 72,
                    y: 46
                },
                beast: {
                    x: 48,
                    y: 31
                }
            };

            const CORE_POWER_ANCHORS = {
                dragon: {
                    x: 14,
                    y: 50
                },
                beast: {
                    x: 86,
                    y: 50
                }
            };

            function buildEnergyCurve(
                startX,
                startY,
                endX,
                endY,
                offset
            ) {
                const dx =
                    endX - startX;

                const dy =
                    endY - startY;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                if (distance < 1) {
                    return (
                        "M " +
                        startX +
                        " " +
                        startY +
                        " L " +
                        endX +
                        " " +
                        endY
                    );
                }

                const nx =
                    -dy / distance;

                const ny =
                    dx / distance;

                const curve =
                    Math.min(
                        110,
                        distance * 0.24
                    );

                const c1x =
                    startX +
                    dx * 0.33 +
                    nx * (
                        offset +
                        curve * 0.28
                    );

                const c1y =
                    startY +
                    dy * 0.33 +
                    ny * (
                        offset +
                        curve * 0.28
                    );

                const c2x =
                    startX +
                    dx * 0.72 +
                    nx * (
                        offset -
                        curve * 0.20
                    );

                const c2y =
                    startY +
                    dy * 0.72 +
                    ny * (
                        offset -
                        curve * 0.20
                    );

                return (
                    "M " +
                    startX +
                    " " +
                    startY +
                    " C " +
                    c1x +
                    " " +
                    c1y +
                    ", " +
                    c2x +
                    " " +
                    c2y +
                    ", " +
                    endX +
                    " " +
                    endY
                );
            }

            function positionEnergySvg() {
                if (
                    !activeStep ||
                    !energySvg ||
                    !stage
                ) {
                    return;
                }

                const creature =
                    activeStep.creature ===
                    "dragon"
                        ? dragon
                        : beast;

                const rune =
                    runeButtons[
                        activeStep.rune
                    ];

                if (
                    !creature ||
                    !rune
                ) {
                    return;
                }

                const stageRect =
                    stage.getBoundingClientRect();

                const creatureRect =
                    creature.getBoundingClientRect();

                const runeRect =
                    rune.getBoundingClientRect();

                if (
                    stageRect.width <= 0 ||
                    stageRect.height <= 0
                ) {
                    return;
                }

                energySvg.setAttribute(
                    "viewBox",
                    "0 0 " +
                    stageRect.width +
                    " " +
                    stageRect.height
                );

                energySvg.setAttribute(
                    "width",
                    stageRect.width
                );

                energySvg.setAttribute(
                    "height",
                    stageRect.height
                );

                const anchor =
                    COLLAR_ANCHORS[
                        activeStep.creature
                    ];

                const startX =
                    creatureRect.left -
                    stageRect.left +
                    creatureRect.width *
                    (anchor.x / 100);

                const startY =
                    creatureRect.top -
                    stageRect.top +
                    creatureRect.height *
                    (anchor.y / 100);

                const endX =
                    runeRect.left -
                    stageRect.left +
                    runeRect.width / 2;

                const endY =
                    runeRect.top -
                    stageRect.top +
                    runeRect.height / 2;

                energyStrands.forEach(
                    function (strand) {
                        const offset =
                            Number(
                                strand.dataset.offset
                            );

                        strand.setAttribute(
                            "d",
                            buildEnergyCurve(
                                startX,
                                startY,
                                endX,
                                endY,
                                offset
                            )
                        );
                    }
                );

                energySvg.dataset.creature =
                    activeStep.creature;
            }

            function setEnergyVisible(
                visible
            ) {
                energySvg.classList.toggle(
                    "is-visible",
                    visible
                );
            }

            function triggerRunePulse(
                button
            ) {
                if (
                    !button ||
                    !runeScreenPulse
                ) {
                    return;
                }

                const stageRect =
                    stage.getBoundingClientRect();

                const runeRect =
                    button.getBoundingClientRect();

                const x =
                    runeRect.left -
                    stageRect.left +
                    runeRect.width / 2;

                const y =
                    runeRect.top -
                    stageRect.top +
                    runeRect.height / 2;

                runeScreenPulse.style.setProperty(
                    "--pulse-x",
                    x + "px"
                );

                runeScreenPulse.style.setProperty(
                    "--pulse-y",
                    y + "px"
                );

                runeScreenPulse.classList.remove(
                    "is-pulsing"
                );

                void runeScreenPulse.offsetWidth;

                runeScreenPulse.classList.add(
                    "is-pulsing"
                );

                button.classList.remove(
                    "is-awakening"
                );

                void button.offsetWidth;

                button.classList.add(
                    "is-awakening"
                );

                context.timeout(
                    function () {
                        runeScreenPulse.classList.remove(
                            "is-pulsing"
                        );

                        button.classList.remove(
                            "is-awakening"
                        );
                    },
                    1150
                );
            }

            function createEnergyPulse(
                duration,
                radius
            ) {
                const pulse =
                    document.createElementNS(
                        SVG_NS,
                        "circle"
                    );

                pulse.classList.add(
                    "arena-break-energy-surge-particle"
                );

                pulse.setAttribute(
                    "r",
                    radius
                );

                pulse.setAttribute(
                    "cx",
                    "0"
                );

                pulse.setAttribute(
                    "cy",
                    "0"
                );

                const motion =
                    document.createElementNS(
                        SVG_NS,
                        "animateMotion"
                    );

                motion.setAttribute(
                    "dur",
                    duration + "s"
                );

                motion.setAttribute(
                    "repeatCount",
                    "1"
                );

                motion.setAttribute(
                    "fill",
                    "freeze"
                );

                const mpath =
                    document.createElementNS(
                        SVG_NS,
                        "mpath"
                    );

                mpath.setAttribute(
                    "href",
                    "#arena-break-energy-strand-2"
                );

                motion.appendChild(
                    mpath
                );

                pulse.appendChild(
                    motion
                );

                energySvg.appendChild(
                    pulse
                );

                try {
                    motion.beginElement();
                } catch (error) {}

                context.timeout(
                    function () {
                        if (
                            pulse.parentNode
                        ) {
                            pulse.parentNode.removeChild(
                                pulse
                            );
                        }
                    },
                    duration * 1000 + 180
                );
            }

            function runEnergySurge() {
                energySvg.classList.remove(
                    "is-surge"
                );

                void energySvg.offsetWidth;

                energySvg.classList.add(
                    "is-surge"
                );

                screen.classList.remove(
                    "arena-break-surge"
                );

                void screen.offsetWidth;

                screen.classList.add(
                    "arena-break-surge"
                );

                createEnergyPulse(
                    0.56,
                    7
                );

                context.timeout(
                    function () {
                        createEnergyPulse(
                            0.48,
                            4
                        );
                    },
                    90
                );

                context.timeout(
                    function () {
                        energySvg.classList.remove(
                            "is-surge"
                        );

                        screen.classList.remove(
                            "arena-break-surge"
                        );
                    },
                    700
                );
            }

            function clearRuneBreakParticles() {
                runeBreakParticleToken += 1;

                while (
                    runeBreakParticleGroup.firstChild
                ) {
                    runeBreakParticleGroup.removeChild(
                        runeBreakParticleGroup.firstChild
                    );
                }
            }

            function scatterRuneBreakParticles(
                runeButton
            ) {
                clearRuneBreakParticles();

                const token =
                    runeBreakParticleToken;

                const stageRect =
                    stage.getBoundingClientRect();

                const runeRect =
                    runeButton.getBoundingClientRect();

                const originX =
                    runeRect.left -
                    stageRect.left +
                    runeRect.width / 2;

                const originY =
                    runeRect.top -
                    stageRect.top +
                    runeRect.height / 2;

                const count = 16;

                for (
                    let i = 0;
                    i < count;
                    i += 1
                ) {
                    const angle =
                        (
                            Math.PI * 2 * i
                        ) /
                            count +
                        (
                            i % 2
                                ? 0.08
                                : -0.05
                        );

                    const speed =
                        55 +
                        (
                            i % 5
                        ) * 19;

                    const velocityX =
                        Math.cos(angle) *
                        speed;

                    const velocityY =
                        Math.sin(angle) *
                        speed;

                    const particle =
                        document.createElementNS(
                            SVG_NS,
                            "circle"
                        );

                    particle.classList.add(
                        "arena-break-rune-particle"
                    );

                    particle.setAttribute(
                        "cx",
                        originX
                    );

                    particle.setAttribute(
                        "cy",
                        originY
                    );

                    particle.setAttribute(
                        "r",
                        1.6 +
                        (i % 3) * 0.65
                    );

                    runeBreakParticleGroup.appendChild(
                        particle
                    );

                    const startedAt =
                        Date.now();

                    function animateParticle() {
                        if (
                            token !==
                            runeBreakParticleToken
                        ) {
                            return;
                        }

                        const elapsed =
                            Date.now() -
                            startedAt;

                        const progress =
                            Math.min(
                                1,
                                elapsed / 620
                            );

                        const travel =
                            progress;

                        const x =
                            originX +
                            velocityX *
                            travel;

                        const y =
                            originY +
                            velocityY *
                            travel +
                            55 *
                            progress *
                            progress;

                        particle.setAttribute(
                            "cx",
                            x
                        );

                        particle.setAttribute(
                            "cy",
                            y
                        );

                        particle.setAttribute(
                            "opacity",
                            1 - progress
                        );

                        if (
                            progress >= 1
                        ) {
                            if (
                                particle.parentNode
                            ) {
                                particle.parentNode.removeChild(
                                    particle
                                );
                            }

                            return;
                        }

                        global.requestAnimationFrame(
                            animateParticle
                        );
                    }

                    global.requestAnimationFrame(
                        animateParticle
                    );
                }
            }

            /*
            * =========================================================
            * КНОПКИ РЕАКЦИИ
            * =========================================================
            */

            function setActionButtonsEnabled(
                enabled
            ) {
                Object.keys(
                    actionButtons
                ).forEach(
                    function (id) {
                        actionButtons[id].disabled =
                            !enabled;
                    }
                );
            }

            function clearActionHighlights() {
                Object.keys(
                    actionButtons
                ).forEach(
                    function (id) {
                        actionButtons[id]
                            .classList
                            .remove(
                                "is-correct",
                                "is-wrong",
                                "is-dimmed"
                            );
                    }
                );
            }

            /*
            * =========================================================
            * РУНЫ
            * =========================================================
            */

            function prepareRune(runeId) {
                Object.keys(
                    runeButtons
                ).forEach(
                    function (id) {
                        runeButtons[id]
                            .classList
                            .remove(
                                "is-active",
                                "is-open",
                                "is-broken",
                                "is-critical"
                            );

                        runeButtons[id].disabled =
                            true;
                    }
                );

                const button =
                    runeButtons[runeId];

                if (!button) {
                    return;
                }

                button.classList.add(
                    "is-active"
                );

                button.disabled = true;
            }

            function unlockActiveRune() {
                if (!activeStep) {
                    return;
                }

                const button =
                    runeButtons[
                        activeStep.rune
                    ];

                if (!button) {
                    return;
                }

                runeOpen = true;

                button.disabled = false;

                button.classList.add(
                    "is-open"
                );

                triggerRunePulse(
                    button
                );
            }

            /*
            * =========================================================
            * ПОРАЖЕНИЕ
            * =========================================================
            */

            function flashWrongAction(
                actionId
            ) {
                const button =
                    actionButtons[actionId];

                if (!button) {
                    return;
                }

                button.classList.remove(
                    "is-wrong"
                );

                void button.offsetWidth;

                button.classList.add(
                    "is-wrong"
                );
            }

            function replayCurrentStep() {
                if (
                    locked ||
                    !activeStep
                ) {
                    return;
                }

                runeOpen = false;

                if (
                    activeStep.creature ===
                    "dragon"
                ) {
                    dragon.classList.remove(
                        "is-breaking"
                    );

                    dragon.style.opacity =
                        "0.92";

                    dragonEffect.style.opacity =
                        "0";
                }

                if (
                    activeStep.creature ===
                    "beast"
                ) {
                    beast.classList.remove(
                        "is-breaking"
                    );

                    beast.style.opacity =
                        "0.92";

                    beastEffect.style.opacity =
                        "0";
                }

                clearActionHighlights();
                setActionButtonsEnabled(false);

                prepareRune(
                    activeStep.rune
                );

                const activeCreature =
                    activeStep.creature === "dragon"
                        ? dragon
                        : beast;

                /*
                * Активное существо получает свою боевую картинку.
                * Неактивное всегда возвращается в idle.
                */
                setCreatureState(
                    dragon,
                    activeStep.creature === "dragon"
                        ? ASSETS.dragon[activeStep.state]
                        : ASSETS.dragon.idle,
                    ASSETS.dragon.idle
                );

                setCreatureState(
                    beast,
                    activeStep.creature === "beast"
                        ? ASSETS.beast[activeStep.state]
                        : ASSETS.beast.idle,
                    ASSETS.beast.idle
                );

                /*
                * Сначала сбрасываем состояние у обоих.
                */
                [dragon, beast].forEach(function (creatureElement) {
                    creatureElement.classList.remove(
                        "is-active-threat",
                        "arena-break-attack"
                    );
                });

                /*
                * Затем активируем только нужного монстра.
                */
                void activeCreature.offsetWidth;

                activeCreature.classList.add(
                    "is-active-threat"
                );

                if (activeStep.answer !== "still") {
                    activeCreature.classList.add(
                        "arena-break-attack"
                    );
                }

                try {
                    positionEnergySvg();
                    setEnergyVisible(true);
                } catch (error) {
                    console.warn(
                        "Arena: не удалось рассчитать магическую связь.",
                        error
                    );
                }

                startEnergyLoop();

                if (
                    activeStep.creature ===
                    "dragon"
                ) {
                    playBreakSfx(
                        "dragonBreath",
                        0.42,
                        1450
                    );
                }

                if (
                    activeStep.creature ===
                    "beast"
                ) {
                    playBreakSfx(
                        "beastGrowl",
                        0.42,
                        1200
                    );
                }

                setActionButtonsEnabled(
                    true
                );

                feedback.textContent =
                    activeStep.creature === "dragon"
                        ? "ДРАКОН ИДЁТ НА ТЕБЯ."
                        : "ЗВЕРЬ ГРЯДЁТ.";

                context.timeout(
                    function () {
                        setActionButtonsEnabled(
                            true
                        );
                    },
                    ATTACK_DELAY
                );
            }

            /*
            * =========================================================
            * СТИЧ
            * =========================================================
            */

            function showStitchHint() {
                stitchHint.classList.add(
                    "is-visible"
                );

                if (
                    activeStep &&
                    ACTIONS[
                        activeStep.answer
                    ]
                ) {
                    stitchHint.querySelector(
                        ".arena-break-stitch-symbol"
                    ).textContent =
                        ACTIONS[
                            activeStep.answer
                        ].icon;
                }
            }

            function hideStitchHint() {
                stitchHint.classList.remove(
                    "is-visible"
                );
            }

            context.on(
                stitchHint,
                "click",
                function () {
                    hideStitchHint();
                    replayCurrentStep();
                }
            );

            /*
            * =========================================================
            * РЕАКЦИЯ ИГРОКА
            * =========================================================
            */

            function playCreatureRecoil() {
                const creature =
                    activeStep.creature ===
                    "dragon"
                        ? dragon
                        : beast;

                const effect =
                    activeStep.creature ===
                    "dragon"
                        ? dragonEffect
                        : beastEffect;

                [
                    creature,
                    effect
                ].forEach(
                    function (element) {
                        if (!element) {
                            return;
                        }

                        element.classList.remove(
                            "is-recoil"
                        );

                        void element.offsetWidth;

                        element.classList.add(
                            "is-recoil"
                        );
                    }
                );
            }

            function handleAction(
                actionId
            ) {
                if (
                    locked ||
                    !activeStep ||
                    runeOpen
                ) {
                    return;
                }

                if (
                    actionId !==
                    activeStep.answer
                ) {
                    totalErrors += 1;

                    locked = true;

                    flashWrongAction(
                        actionId
                    );

                    screen.classList.remove(
                        "arena-break-hit"
                    );

                    void screen.offsetWidth;

                    screen.classList.add(
                        "arena-break-hit"
                    );

                    feedback.textContent =
                        "ПОЗДНО. ТЫ ПРОПУСТИЛА СИГНАЛ. СМОТРИ ЕЩЁ РАЗ.";

                    setActionButtonsEnabled(
                        false
                    );

                    if (
                        totalErrors >= 2
                    ) {
                        showStitchHint();
                    }

                    context.timeout(
                        function () {
                            locked = false;
                            replayCurrentStep();
                        },
                        WRONG_DELAY
                    );

                    return;
                }

                /*
                * =========================================================
                * ПРАВИЛЬНАЯ РЕАКЦИЯ
                * =========================================================
                */

                locked = true;

                clearActionHighlights();

                actionButtons[
                    actionId
                ].classList.add(
                    "is-correct"
                );

                hideStitchHint();

                setActionButtonsEnabled(
                    false
                );

                /*
                * Первый пользовательский клик —
                * запускаем основной магический SFX.
                */

                if (
                    !coreActivatePlayed
                ) {
                    playBreakSfx(
                        "coreActivate",
                        0.42,
                        1800
                    );

                    coreActivatePlayed =
                        true;
                }

                startEnergyLoop();

                /*
                * ТуКо реагирует.
                * Для still — никакого уклонения.
                */

                if (
                    activeStep.answer !==
                    "still"
                ) {
                    playBreakSfx(
                        "evade",
                        0.36,
                        650
                    );

                    playCreatureRecoil();
                }

                /*
                * Мощный импульс в ядро.
                */

                runEnergySurge();

                /*
                * SFX импульса слегка позже
                * вспышки кнопки.
                */

                context.timeout(
                    function () {
                        playBreakSfx(
                            "energyBurst",
                            0.9,
                            800
                        );
                    },
                    70
                );

                /*
                * Пока энергия летит —
                * руна ещё закрыта.
                */

                feedback.textContent =
                    activeStep.answer ===
                    "still"
                        ? "ВЕРНО. НЕ ДВИГАЙСЯ."
                        :  "МОЛОДЕЦ!";

                /*
                * Затем руна открывается.
                */

                context.timeout(
                    function () {
                        unlockActiveRune();

                        feedback.textContent =
                            "ВОТ ОНО. РАЗБЕЙ РУНУ.";

                        locked = false;
                    },
                    850
                );
            }

            Object.keys(
                actionButtons
            ).forEach(
                function (actionId) {
                    context.on(
                        actionButtons[actionId],
                        "click",
                        function () {
                            handleAction(
                                actionId
                            );
                        }
                    );
                }
            );

            /*
            * =========================================================
            * РАЗРЫВ УЗЛА
            * =========================================================
            */
            function clearEnergyBreakBurst() {
                while (
                    energyBreakBurstGroup.firstChild
                ) {
                    energyBreakBurstGroup.removeChild(
                        energyBreakBurstGroup.firstChild
                    );
                }
            }

            function createEnergyBreakBurst() {
                clearEnergyBreakBurst();

                const path =
                    energyStrands[1];

                if (
                    !path ||
                    typeof path.getTotalLength !==
                        "function"
                ) {
                    return;
                }

                const length =
                    path.getTotalLength();

                if (length <= 0) {
                    return;
                }

                const point =
                    path.getPointAtLength(
                        length / 2
                    );

                /*
                * ---------------------------------------------------------
                * ЯРКАЯ ТОЧКА РАЗРЫВА
                * ---------------------------------------------------------
                */

                const flash =
                    document.createElementNS(
                        SVG_NS,
                        "circle"
                    );

                flash.classList.add(
                    "arena-break-energy-break-flash"
                );

                flash.setAttribute(
                    "cx",
                    point.x
                );

                flash.setAttribute(
                    "cy",
                    point.y
                );

                flash.setAttribute(
                    "r",
                    "9"
                );

                energyBreakBurstGroup.appendChild(
                    flash
                );

                /*
                * ---------------------------------------------------------
                * РАСХОДЯЩЕЕСЯ КОЛЬЦО
                * ---------------------------------------------------------
                */

                const ring =
                    document.createElementNS(
                        SVG_NS,
                        "circle"
                    );

                ring.classList.add(
                    "arena-break-energy-break-ring"
                );

                ring.setAttribute(
                    "cx",
                    point.x
                );

                ring.setAttribute(
                    "cy",
                    point.y
                );

                ring.setAttribute(
                    "r",
                    "8"
                );

                energyBreakBurstGroup.appendChild(
                    ring
                );

                /*
                * ---------------------------------------------------------
                * ЭНЕРГЕТИЧЕСКИЕ ОСКОЛКИ
                * ---------------------------------------------------------
                */

                const count = 22;

                for (
                    let i = 0;
                    i < count;
                    i += 1
                ) {
                    const angle =
                        (
                            Math.PI * 2 * i
                        ) /
                            count +
                        (
                            i % 3
                        ) *
                        0.07;

                    const speed =
                        70 +
                        (
                            i % 6
                        ) * 18;

                    const particle =
                        document.createElementNS(
                            SVG_NS,
                            "circle"
                        );

                    particle.classList.add(
                        "arena-break-energy-break-particle"
                    );

                    particle.setAttribute(
                        "cx",
                        point.x
                    );

                    particle.setAttribute(
                        "cy",
                        point.y
                    );

                    particle.setAttribute(
                        "r",
                        String(
                            1.8 +
                            (i % 4) * 0.7
                        )
                    );

                    energyBreakBurstGroup.appendChild(
                        particle
                    );

                    const velocityX =
                        Math.cos(angle) *
                        speed;

                    const velocityY =
                        Math.sin(angle) *
                        speed -
                        35;

                    const gravity = 430;

                    const startedAt =
                        performance.now();

                    function animateBreakParticle(
                        now
                    ) {
                        const elapsed =
                            now -
                            startedAt;

                        const time =
                            elapsed / 1000;

                        const progress =
                            Math.min(
                                1,
                                elapsed / 1050
                            );

                        const x =
                            point.x +
                            velocityX *
                            time;

                        const y =
                            point.y +
                            velocityY *
                            time +
                            0.5 *
                            gravity *
                            time *
                            time;

                        particle.setAttribute(
                            "cx",
                            x
                        );

                        particle.setAttribute(
                            "cy",
                            y
                        );

                        particle.setAttribute(
                            "opacity",
                            String(
                                1 -
                                progress
                            )
                        );

                        particle.setAttribute(
                            "r",
                            String(
                                3.2 -
                                progress * 2
                            )
                        );

                        if (
                            progress >= 1
                        ) {
                            return;
                        }

                        global.requestAnimationFrame(
                            animateBreakParticle
                        );
                    }

                    global.requestAnimationFrame(
                        animateBreakParticle
                    );
                }
            }

           function releaseEnergyParticles() {
                const particles =
                    Array.from(
                        energyParticleGroup.querySelectorAll(
                            ".arena-break-energy-particle"
                        )
                    );

                const svgRect =
                    energySvg.getBoundingClientRect();

                particles.forEach(
                    function (particle, index) {
                        const rect =
                            particle.getBoundingClientRect();

                        const startX =
                            rect.left -
                            svgRect.left +
                            rect.width / 2;

                        const startY =
                            rect.top -
                            svgRect.top +
                            rect.height / 2;

                        /*
                        * Отцепляем частицу от animateMotion.
                        */

                        while (
                            particle.firstChild
                        ) {
                            particle.removeChild(
                                particle.firstChild
                            );
                        }

                        particle.setAttribute(
                            "cx",
                            startX
                        );

                        particle.setAttribute(
                            "cy",
                            startY
                        );

                        const velocityX =
                            (
                                index % 2 === 0
                                    ? 1
                                    : -1
                            ) *
                            (
                                35 +
                                (index % 4) * 18
                            );

                        const velocityY =
                            -(
                                18 +
                                (index % 3) * 12
                            );

                        const gravity = 310;

                        const startedAt =
                            performance.now();

                        function fall(now) {
                            const elapsed =
                                now - startedAt;

                            const time =
                                elapsed / 1000;

                            const progress =
                                Math.min(
                                    1,
                                    elapsed / 920
                                );

                            const x =
                                startX +
                                velocityX *
                                time;

                            const y =
                                startY +
                                velocityY *
                                time +
                                0.5 *
                                gravity *
                                time *
                                time;

                            particle.setAttribute(
                                "cx",
                                x
                            );

                            particle.setAttribute(
                                "cy",
                                y
                            );

                            particle.setAttribute(
                                "opacity",
                                String(
                                    1 -
                                    progress
                                )
                            );

                            particle.setAttribute(
                                "r",
                                String(
                                    2.8 -
                                    progress * 1.4
                                )
                            );

                            if (
                                progress >= 1
                            ) {
                                if (
                                    particle.parentNode
                                ) {
                                    particle.parentNode.removeChild(
                                        particle
                                    );
                                }

                                return;
                            }

                            global.requestAnimationFrame(
                                fall
                            );
                        }

                        global.requestAnimationFrame(
                            fall
                        );
                    }
                );
            }

            function breakActiveRune() {
                if (
                    locked ||
                    !activeStep ||
                    !runeOpen
                ) {
                    return;
                }

                    if (!coreDestroyAudioUnlocked) {

                    coreDestroyAudio.muted = true;
                    coreDestroyAudio.currentTime = 0;

                    const unlockPromise =
                        coreDestroyAudio.play();

                    if (
                        unlockPromise &&
                        typeof unlockPromise.then === "function"
                    ) {
                        unlockPromise.then(
                            function () {

                                coreDestroyAudio.pause();
                                coreDestroyAudio.currentTime = 0;
                                coreDestroyAudio.muted = false;

                                coreDestroyAudioUnlocked = true;

                            }
                        ).catch(
                            function () {
                                coreDestroyAudio.muted = false;
                            }
                        );
                    } else {

                        coreDestroyAudio.muted = false;
                        coreDestroyAudioUnlocked = true;

                    }
                }

                const button =
                    runeButtons[
                        activeStep.rune
                    ];

                if (!button) {
                    return;
                }

                locked = true;
                runeOpen = false;

                button.disabled = true;

                /*
                * ---------------------------------------------------------
                * ТРЕСК
                * ---------------------------------------------------------
                */

                button.classList.remove(
                    "is-open"
                );

                button.classList.add(
                    "is-breaking"
                );

                playBreakSfx(
                    "runeBreak",
                    0.74,
                    950
                );

                /*
                * ЯДРО ВСПЫХИВАЕТ
                */

                screen.classList.remove(
                    "arena-break-node"
                );

                void screen.offsetWidth;

                screen.classList.add(
                    "arena-break-node"
                );

                /*
                * ---------------------------------------------------------
                * РАЗЛОМ
                * ---------------------------------------------------------
                */

                context.timeout(
                    function () {
                        playBreakSfx(
                            "collarCrack",
                            0.9,
                            850
                        );

                        scatterRuneBreakParticles(
                            button
                        );

                        releaseEnergyParticles();

                        createEnergyBreakBurst();

                        energySvg.classList.add(
                            "is-breaking"
                        );

                        feedback.textContent =
                            "ТРЕЩИНА ПОШЛА.";
                    },
                    220
                );

                /*
                * ---------------------------------------------------------
                * КАНАЛ ИСЧЕЗАЕТ
                * ---------------------------------------------------------
                */

                context.timeout(
                    function () {
                        button.classList.remove(
                            "is-open",
                            "is-breaking"
                        );

                        button.classList.add(
                            "is-broken"
                        );

                        setEnergyVisible(
                            false
                        );

                        energySvg.classList.remove(
                            "is-breaking",
                            "is-surge"
                        );

                        stopEnergyLoop();

                        feedback.textContent =
                            "ЕЩЁ ОДНА СВЯЗЬ РАЗОРВАНА.";

                        clearRuneBreakParticles();
                    },
                    1120
                );

                /*
                * ---------------------------------------------------------
                * СЛЕДУЮЩИЙ ШАГ
                * ---------------------------------------------------------
                */

                context.timeout(
                    function () {
                        stepIndex += 1;

                        if (
                            stepIndex >=
                            FREEDOM_ROUNDS[
                                roundIndex
                            ].steps.length
                        ) {
                            completeRound();
                            return;
                        }

                        locked = false;

                        showStep();
                    },
                    RUNE_BREAK_DELAY
                );
            }

            Object.keys(
                runeButtons
            ).forEach(
                function (runeId) {
                    context.on(
                        runeButtons[runeId],
                        "click",
                        function () {
                            breakActiveRune();
                        }
                    );
                }
            );

            function showStep() {
                const round =
                    FREEDOM_ROUNDS[
                        roundIndex
                    ];

                activeStep =
                    round.steps[
                        stepIndex
                    ];

                phaseLabel.textContent =
                    "ИСПЫТАНИЕ III";

                roundLabel.textContent =
                    round.label;

                stepLabel.textContent =
                    "ШАГ " +
                    (stepIndex + 1) +
                    " / " +
                    round.steps.length;

                feedback.textContent =
                    activeStep.creature === "dragon"
                        ? "ДРАКОН ИДЁТ НА ТЕБЯ."
                        : "ЗВЕРЬ ГРЯДЁТ.";

                replayCurrentStep();
            }

            function completeRound() {
                const round =
                    FREEDOM_ROUNDS[
                        roundIndex
                    ];

                locked = true;

                setEnergyVisible(false);
                energySvg.classList.remove(
                    "is-breaking",
                    "is-surge"
                );
                stopEnergyLoop();

                clearActionHighlights();

                setActionButtonsEnabled(
                    false
                );

                if (
                    round.final
                ) {
                    feedback.textContent =
                         "ВСЁ. КОНТУР РАЗРУШЕН.";

                    screen.classList.remove(
                        "arena-break-channel"
                    );

                    void screen.offsetWidth;

                    screen.classList.add(
                        "arena-break-channel"
                    );

                    context.timeout(
                        function () {
                            finishFinalBreak();
                        },
                        NEXT_STEP_DELAY
                    );

                    return;
                }

                if (
                    round.creature ===
                    "dragon"
                ) {
                    dragonCracks += 1;

                    dragonEffect.classList.remove(
                        "is-damaged"
                    );

                    dragon.classList.add(
                        "is-breaking"
                    );

                    context.timeout(
                        function () {
                            dragon.style.opacity =
                                "0";

                            dragonEffect.style.opacity =
                                "1";

                            dragonEffect.classList.add(
                                "is-damaged"
                                );
                            },
                            180
                        );
                    }

                    if (
                        round.creature ===
                        "beast"
                    ) {
                        beastCracks += 1;

                        beastEffect.classList.remove(
                            "is-damaged"
                        );

                        beast.classList.add(
                            "is-breaking"
                        );

                        context.timeout(
                            function () {
                                beast.style.opacity =
                                    "0";

                                beastEffect.style.opacity =
                                    "1";

                                beastEffect.classList.add(
                                    "is-damaged"
                                );
                            },
                            180
                        );
                    }

                feedback.textContent =
                    round.creature === "dragon"
                        ? "ДРАКОН СВОБОДЕН."
                        : "ЗВЕРЬ СВОБОДЕН.";

                screen.classList.remove(
                    "arena-break-channel"
                );

                void screen.offsetWidth;

                screen.classList.add(
                    "arena-break-channel"
                );

                context.timeout(
                    function () {
                        roundIndex += 1;
                        stepIndex = 0;

                        if (
                            roundIndex >=
                            FREEDOM_ROUNDS.length
                        ) {
                            finishFinalBreak();
                            return;
                        }

                        locked = false;

                        context.timeout(
                            function () {
                                showStep();
                            },
                            NEXT_ROUND_DELAY
                        );
                    },
                    NEXT_STEP_DELAY
                );
            }

            /*
            * =========================================================
            * ФИНАЛЬНЫЙ РАЗРЫВ ЯДРА
            * =========================================================
            */

            function finishFinalBreak() {

                locked = true;

                playBreakSfx(
                    "coreDestroy",
                    0.92
                );

                setActionButtonsEnabled(false);

                Object.keys(runeButtons).forEach(
                    function (id) {
                        runeButtons[id].disabled = true;
                    }
                );

                /*
                * =========================================================
                * 1. СНАЧАЛА — ТОЛЬКО ЯДРО
                * =========================================================
                */

                screen.classList.remove(
                    "arena-freedom-final",
                    "arena-freedom-core-break",
                    "arena-freedom-empty"
                );

                void screen.offsetWidth;

                screen.classList.add(
                    "arena-break-final",
                    "arena-freedom-final",
                    "arena-freedom-core-break"
                );

                feedback.textContent =
                    "ЯДРО РАЗРУШАЕТСЯ...";

                stopEnergyLoop();

                setEnergyVisible(false);

                energySvg.classList.remove(
                    "is-visible",
                    "is-breaking",
                    "is-surge"
                );

                coreWrap.classList.remove(
                    "is-critical"
                );

                /*
                * На этом этапе существа НЕ двигаются.
                * Их обычные изображения остаются на месте.
                *
                * Эффект ошейника пока выключен.
                */

                dragonEffect.style.opacity = "0";
                beastEffect.style.opacity = "0";

                /*
                * =========================================================
                * 2. ЯДРО РАЗРУШЕНО
                * =========================================================
                */

                context.timeout(
                    function () {

                        coreWrap.style.opacity = "0";

                        feedback.textContent =
                            "ЯДРО РАЗРУШЕНО.";

                    },
                    1250
                );

                /*
                * =========================================================
                * 3. ТЕПЕРЬ — ОСВОБОЖДЕНИЕ ОШЕЙНИКОВ
                * =========================================================
                */

                context.timeout(
                    function () {

                        /*
                        * Обычные изображения существ временно прячем,
                        * чтобы эффект ошейника не накладывался вторым
                        * неподвижным существом.
                        */

                        dragon.style.opacity = "0";
                        beast.style.opacity = "0";

                        dragonEffect.style.opacity = "1";
                        beastEffect.style.opacity = "1";

                        dragonEffect.classList.remove(
                            "is-damaged",
                            "is-final-burst"
                        );

                        beastEffect.classList.remove(
                            "is-damaged",
                            "is-final-burst"
                        );

                        void dragonEffect.offsetWidth;
                        void beastEffect.offsetWidth;

                        dragonEffect.classList.add(
                            "is-final-burst"
                        );

                        beastEffect.classList.add(
                            "is-final-burst"
                        );

                        feedback.textContent =
                            "ЦЕПИ РАЗОРВАНЫ.";

                    },
                    1450
                );

                /*
                * =========================================================
                * 4. РЫКИ ОСВОБОЖДЕНИЯ
                * =========================================================
                */

                context.timeout(
                    function () {

                        playBreakSfx(
                            "dragonFreed",
                            0.9
                        );

                        context.timeout(
                            function () {
                                playBreakSfx(
                                    "beastFreed",
                                    0.9
                                );
                            },
                            180
                        );

                    },
                    1750
                );

                /*
                * =========================================================
                * 5. ТОЛЬКО ТЕПЕРЬ СУЩЕСТВА УХОДЯТ
                * =========================================================
                */

                context.timeout(
                    function () {

                       dragonEffect.classList.remove(
                            "is-damaged",
                            "is-final-burst"
                        );

                        beastEffect.classList.remove(
                            "is-damaged",
                            "is-final-burst"
                        );

                        dragonEffect.style.transition = "none";
                        beastEffect.style.transition = "none";

                        dragonEffect.style.opacity = "0";
                        beastEffect.style.opacity = "0";

                        void dragonEffect.offsetWidth;
                        void beastEffect.offsetWidth;

                        dragon.style.opacity = "";
                        beast.style.opacity = "";

                        dragon.classList.remove(
                            "is-breaking"
                        );

                        beast.classList.remove(
                            "is-breaking"
                        );

                        void dragon.offsetWidth;
                        void beast.offsetWidth;

                        dragon.classList.add(
                            "is-freedom-escaping"
                        );

                        beast.classList.add(
                            "is-freedom-escaping"
                        );

                        feedback.textContent =
                            "ДРАКОН И ЗВЕРЬ СВОБОДНЫ.";

                    },
                    2200
                );

                /*
                * =========================================================
                * 6. ПУСТАЯ АРЕНА
                * =========================================================
                */

                context.timeout(
                    function () {

                        dragon.style.opacity = "0";
                        beast.style.opacity = "0";

                        dragonEffect.style.opacity = "0";
                        beastEffect.style.opacity = "0";

                        coreWrap.style.opacity = "0";

                        screen.classList.add(
                            "arena-freedom-empty"
                        );

                        feedback.textContent = "";

                        /*
                        * =====================================================
                        * 7. ТОЛПА — ДВА РАЗА
                        * =====================================================
                        */

                        function playCrowdOnce(done) {

                        const audio =
                            playBreakSfx(
                                "crowdCheer",
                                0.92
                            );

                        if (!audio) {
                            done();
                            return;
                        }

                        let completed = false;

                        function finishCrowd() {

                            if (completed) {
                                return;
                            }

                            completed = true;
                            done();
                        }

                        audio.addEventListener(
                            "ended",
                            finishCrowd,
                            {
                                once: true
                            }
                        );

                        context.timeout(
                            finishCrowd,
                            5000
                        );
                    }

                        /*
                        * =====================================================
                        * 8. ПОСЛЕ ВТОРОГО ЛИКОВАНИЯ — ПЕЧАТЬ
                        * =====================================================
                        */

                        playCrowdOnce(
                            function () {

                                screen.classList.remove(
                                    "arena-freedom-empty"
                                );

                                finishTask(false);

                            }
                        );

                    },
                    4050
                );
            }

            /*
            * =========================================================
            * ФИНИШ
            * =========================================================
            */

            function finishTask(
                fromSave
            ) {
                locked = true;

                setEnergyVisible(false);
                energySvg.classList.remove(
                    "is-breaking",
                    "is-surge"
                );
                stopEnergyLoop();

                setActionButtonsEnabled(
                    false
                );

                Object.keys(
                    runeButtons
                ).forEach(
                    function (id) {
                        runeButtons[id].disabled =
                            true;
                    }
                );

                screen.classList.add(
                    "arena-control-finished"
                );

                completeCard.style.display =
                    "";

                if (!fromSave) {

                    startCrowdCelebration();

                    playBreakSfx(
                        "crowdCheer",
                        0.92
                    );

                    const progressState =
                        game.state.get()
                            .chapterProgress;

                    const seals =
                        game.state.get()
                            .seals;

                    game.state.patch({
                        chapterProgress: {
                            ...progressState,
                            arena: Math.max(
                                progressState.arena,
                                3
                            )
                        },
                        seals: {
                            ...seals,
                            courage: true
                        }
                    });

                    game.save.write(
                        "Арена: Ошейники разорваны"
                    );
                }
            }

            context.registerCleanup(
                function () {
                    stopEnergyLoop();
                    clearRuneBreakParticles();
                    clearEnergyBreakBurst();
                }
            );

            /*
            * =========================================================
            * RESIZE
            * =========================================================
            */

            function refreshLayout() {
                positionEnergySvg();
            }

            global.addEventListener(
                "resize",
                refreshLayout
            );

            context.registerCleanup(
                function () {
                    global.removeEventListener(
                        "resize",
                        refreshLayout
                    );
                }
            );

            /*
            * =========================================================
            * СЦЕНА
            * =========================================================
            */

            stage.append(
                energySvg,
                runeScreenPulse,
                beast,
                beastEffect,
                dragon,
                dragonEffect,
                coreWrap,
                header,
                phaseLabel,
                roundLabel,
                stepLabel,
                feedback,
                actionBar,
                stitchHint,
                completeCard
            );

            screen.prepend(
                game.ui.createHud(
                    context,
                    {
                        title:
                            "Арена · Разорви связь",
                        showPlayer: true
                    }
                )
            );

            root.appendChild(
                screen
            );

            context.timeout(
                function () {
                    screen.classList.add(
                        "arena-ready"
                    );

                    if (
                        alreadyComplete
                    ) {
                        finishTask(true);
                        return;
                    }

                    arenaFreedomStartVoice.currentTime = 0;

                    arenaFreedomStartVoice.onended =
                        function () {
                            showStep();
                        };

                    arenaFreedomStartVoice.play().catch(
                        function () {
                            showStep();
                        }
                    );
                },
                100
            );
        },

        unmount: function () {}
    };
    

})(window);
