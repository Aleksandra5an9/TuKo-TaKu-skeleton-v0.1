(function (global) {

    "use strict";
    const game = global.TUKO_TAKU;
    if (!game) {

        throw new Error("TUKO_TAKU \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d.");

    }
   game.scenes = game.scenes || {};

    const ASSETS = {

        video1:
            "assets/video/finale_camera_transition.mp4",

        video1Sfx:
          "assets/audio/camera_whoosh.mp3",

        video2:
            "assets/video/finale_table_break.mp4",

        video2ImpactSfx:
            "assets/audio/final_table_impact.mp3",

        video2BreakSfx:
            "assets/audio/final_table_break.mp3",

        finalStarSpaceTransform:
          "assets/video/final_star_space_transform.mp4",

        revealBackground:
            "assets/images/final_gameplay_bg.png",

        brokenBackground:
            "assets/images/final_gameplay_broken_bg.png",

         finalStarSpace:
            "assets/images/final_star_space.png",

        collapseTavern:
            "assets/images/finale_collapse_tavern.png",

        collapseSpaceport:
            "assets/images/finale_collapse_spaceport.png",

        collapseArena:
            "assets/images/finale_collapse_arena.png",

        collapseCasino:
            "assets/images/finale_collapse_casino.png",

        collapseAllWorlds:
            "assets/images/finale_collapse_all_worlds.png",

        finalStarSpaceMusic:
            "assets/audio/final_star_space.mp3",

        epilogueCongratulation:
            "assets/images/epilogue_congratulation_bg.png",

        epilogueCongratulationMusic:
          "assets/audio/epilogue_congratulation.mp3",

        epilogueResults:
            "assets/images/epilogue_results_bg_seals_final.png",

        epilogueMenu:
            "assets/images/final_false_choice_bg.png",
        
        epilogueCreditsMusic:
            "assets/audio/a6f8b896323e584.mp3"

    };

    let epilogueCongratulationAudio = null;

    function wait(context, milliseconds) {

        return new Promise(function (resolve) {

            context.timeout(resolve, milliseconds);

        });

    }

    function playVoiceAndWait(

        context,

        path,

        fallbackMilliseconds

    ) {

        return new Promise(function (resolve) {

            const audio =

                game.audio.playVoice(path);



            if (!audio) {

                resolve();

                return;

            }



            let finished = false;



            function finish() {

                if (finished) {

                    return;

                }



                finished = true;



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



            context.timeout(

                finish,

                fallbackMilliseconds || 12000

            );

        });

    }

    function createStage(screenClass, stageClass) {

        const screen =

            document.createElement("section");



        screen.className =

            "screen " + screenClass;



        const stage =

            document.createElement("div");



        stage.className =

            stageClass || "finale-clean-stage";



        screen.appendChild(stage);



        return {

            screen: screen,

            stage: stage

        };

    }

    function createImage(

        src,

        className

    ) {

        return game.mechanics.createImage(

            src,

            className,

            ""

        );

    }

    function createFullScreenVideo(

        stage,

        src

    ) {

        const video =

            document.createElement("video");



        video.className =

            "finale-fullscreen-video";



        video.src = src;



        video.autoplay = true;

        video.muted = true;

        video.loop = false;

        video.playsInline = true;

        video.preload = "auto";

        video.controls = false;



        video.style.position = "absolute";

        video.style.inset = "0";

        video.style.width = "100%";

        video.style.height = "100%";

        video.style.display = "block";

        video.style.objectFit = "cover";

        video.style.objectPosition = "center center";

        video.style.zIndex = "1";

        video.style.background = "#050509";

        video.style.pointerEvents = "none";

        video.style.userSelect = "none";



        stage.appendChild(video);



        return video;

    }

    function createRevealCharacters(stage) {

        const tuko = createImage(

            game.config.players.tuko.image,

            "finale-reveal-character finale-clean-tuko"

        );



        const taku = createImage(

            game.config.players.taku.image,

            "finale-reveal-character finale-clean-taku"

        );



        const host = createImage(

            game.config.images.host,

            "finale-reveal-host finale-clean-host"

        );



        stage.append(

            tuko,

            taku,

            host

        );

    }

    async function finishVideo(

        video,

        callback,

        context

    ) {

        let finished = false;



        async function finish() {

            if (finished) {

                return;

            }



            finished = true;



            video.removeEventListener(

                "ended",

                finish

            );



            video.removeEventListener(

                "error",

                finish

            );



            video.removeEventListener(

                "timeupdate",

                onTimeUpdate

            );



            await callback();

        }



        function onTimeUpdate() {
            if (
                video.duration > 0 &&
                video.currentTime >=
                    video.duration - 0.08
            ) {
                finish();
            }

        }

        video.addEventListener(
            "ended",
            finish
        );

        video.addEventListener(
            "error",
            finish
        );

        video.addEventListener(
            "timeupdate",
            onTimeUpdate
        );

        context.timeout(
            finish,
            15000
        );

    }

    game.scenes.finale_reveal = {

        id: "finale_reveal",

        mount: function (root, context) {

            if (

                game.audio &&

                typeof game.audio.unlock === "function"

            ) {

                game.audio.unlock();

            }

            const scene = createStage(

                "finale-reveal-screen",

                "finale-clean-stage"

            );

            const video =

                createFullScreenVideo(

                    scene.stage,

                    ASSETS.video1

                );

            root.appendChild(
                scene.screen
            );

            // Звук движения камеры при смене ракурса

            context.timeout(function () {

                if (!video.isConnected) {
                    return;
                }

                const cameraWhoosh = new Audio(
                    ASSETS.video1Sfx
                );

                cameraWhoosh.volume = 0.65;

                cameraWhoosh.play().catch(function () {});

            }, 1300);

            async function afterVideo() {

                video.remove();

                const background =

                    document.createElement("img");

                background.className =

                    "finale-clean-background";

                background.src =

                    ASSETS.revealBackground;

                background.alt = "";

                background.draggable = false;


                const beforeReady =
                    scene.screen.classList.contains(

                        "finale-clean-ready"

                    );

                scene.stage.prepend(

                    background

                );

                createRevealCharacters(
                    scene.stage
                );

                context.timeout(

                    function () {

                        scene.screen.classList.add(

                            "finale-clean-ready"

                        );

                    },

                    40

                );

                await wait(
                    context,
                    400
                );              

                await playVoiceAndWait(
                    context,
                    "assets/audio/host_finale1.mp3"
                );

                await wait(
                    context,
                    650
                );

                await playVoiceAndWait(
                    context,
                    "assets/audio/tuko_finale1.mp3"
                );

                await wait(
                    context,
                    650
                );

                await playVoiceAndWait(
                    context,
                    "assets/audio/host_finale2.mp3"
                );

                await wait(
                    context,
                    650
                );

                await playVoiceAndWait(
                    context,
                    "assets/audio/taku_finale1.mp3"
                );

                await wait(
                    context,
                    650
                );

                await playVoiceAndWait(
                    context,
                    "assets/audio/host_finale3.mp3"
                );

                await wait(
                    context,
                    650
                );

                await playVoiceAndWait(
                    context,
                    "assets/audio/taku_finale2.mp3"
                );

                await wait(
                    context,
                    650
                );

                await playVoiceAndWait(
                    context,
                    "assets/audio/host_finale4.mp3"
                );

                await wait(
                    context,
                    650
                );

                await playVoiceAndWait(
                    context,
                    "assets/audio/tuko_finale2.mp3"
                );

                await wait(
                    context,
                    700
                );

                context.goTo(
                    "finale_false_choice",

                    {
                        checkpointId:
                            "finale_false_choice",
                        save: true
                    }
                );
            }



            finishVideo(
                video,
                afterVideo,
                context
            );

            context.timeout(

                function () {

                    const playResult =

                        video.play();



                    if (

                        playResult &&

                        typeof playResult.catch ===

                            "function"

                    ) {

                        playResult.catch(

                            function () {

                                afterVideo();

                            }

                        );

                    }

                },

                50

            );
        },

        unmount: function () {}
    };

    game.scenes.finale_false_choice = {

        id: "finale_false_choice",

        mount: function (root, context) {

            const scene = createStage(

                "finale-false-choice-screen finale-clean-screen"

            );

            const background =

                document.createElement("img");

            background.src =

                 ASSETS.revealBackground;

            background.alt = "";

            background.draggable = false;

            const tuko = createImage(

                game.config.players.tuko.image,

                "finale-clean-tuko",

                "\u0422\u0443\u041a\u043e"

            );

            const taku = createImage(

                game.config.players.taku.image,

                "finale-clean-taku",

                "\u0422\u0430\u041a\u0443"

            );

            const host = createImage(

                game.config.images.host,

                "finale-clean-host",

                "\u0412\u0435\u0434\u0443\u0449\u0438\u0439"

            );

            scene.stage.append(

                background,

                tuko,

                taku,

                host

            );

            const tukoChoice =

                document.createElement("div");



            tukoChoice.className =

                "finale-choice-plate finale-choice-plate-tuko";





            const takuChoice =

                document.createElement("div");



            takuChoice.className =

                "finale-choice-plate finale-choice-plate-taku";





            scene.stage.append(

                tukoChoice,

                takuChoice

            );

            document.body.appendChild(

                scene.screen

            );



            document.documentElement.style.width = "100vw";

            document.documentElement.style.height = "100vh";



            document.body.style.width = "100vw";

            document.body.style.height = "100vh";

            document.body.style.margin = "0";



            scene.screen.style.position = "fixed";

            scene.screen.style.left = "0";

            scene.screen.style.top = "0";

            scene.screen.style.width = window.innerWidth + "px";

            scene.screen.style.height = window.innerHeight + "px";

            scene.screen.style.maxWidth = "none";

            scene.screen.style.maxHeight = "none";

            scene.screen.style.margin = "0";

            scene.screen.style.padding = "0";

            scene.screen.style.transform = "none";

            scene.screen.style.overflow = "hidden";

            scene.screen.style.zIndex = "2147483647";



            scene.stage.style.position = "absolute";

            scene.stage.style.left = "0";

            scene.stage.style.top = "0";

            scene.stage.style.width = window.innerWidth + "px";

            scene.stage.style.height = window.innerHeight + "px";

            scene.stage.style.maxWidth = "none";

            scene.stage.style.maxHeight = "none";



            background.style.position = "absolute";

            background.style.left = "0";

            background.style.top = "0";

            background.style.width = window.innerWidth + "px";

            background.style.height = window.innerHeight + "px";

            background.style.objectFit = "cover";

            background.style.objectPosition = "center center";

            background.style.opacity = "1";



            context.timeout(

                function () {

                    scene.screen.classList.add(

                        "finale-clean-ready"

                    );

                },

                60

            );

            let selectionCount = 0;

            let busy = false;

            let finished = false;

            async function speak(

                path

            ) {

                busy = true;

                await playVoiceAndWait(

                    context,

                    path

                );

                await wait(

                    context,

                    300

                );

                busy = false;

            }

            async function chooseTuko() {

                if (

                    busy ||

                    finished ||

                    tukoChoice.dataset.disabled === "true"

                ) {

                    return;

                }

                selectionCount += 1;

                tukoChoice.dataset.disabled = "true";

                tukoChoice.classList.add(

                    "is-cracked"

                );

                takuChoice.classList.add(

                    "is-fading"

                );

                await speak(

                    "assets/audio/tuko_finale3.mp3"

                );

                if (

                    selectionCount >= 2

                ) {

                    await finishChoice();

                    return;

                }

                tukoChoice.classList.add(

                    "is-spent"

                );

                takuChoice.classList.remove(

                    "is-fading"

                );

                tukoChoice.dataset.disabled = "false";

            }

            async function chooseTaku() {

                if (

                    busy ||

                    finished ||

                    takuChoice.dataset.disabled === "true"

                ) {

                    return;

                }

                selectionCount += 1;

                takuChoice.dataset.disabled = "true";

                takuChoice.classList.add(

                    "is-cracked"

                );

                tukoChoice.classList.add(

                    "is-fading"

                );

                await speak(

                    "assets/audio/taku_finale3.mp3"

                );

                if (

                    selectionCount >= 2

                ) {

                    await finishChoice();

                    return;

                }

                takuChoice.classList.add(

                    "is-spent"

                );

                tukoChoice.classList.remove(

                    "is-fading"

                );

                tukoChoice.dataset.disabled = "false";

            }

            async function finishChoice() {

                if (finished) {

                    return;

                }

                finished = true;

                tukoChoice.disabled = true;

                takuChoice.disabled = true;

                await wait(

                    context,

                    500

                );

                await speak(

                    "assets/audio/host_finale6.mp3"

                );

                await speak(

                    "assets/audio/taku_finale4.mp3"

                );

                await speak(

                    "assets/audio/host_finale7.mp3"

                );

                game.state.patch({

                    finaleOpeningComplete:

                        true

                });

                await wait(

                    context,

                    300

                );

                context.goTo(

                    "finale_video2",

                    {

                        checkpointId:

                            "finale_video2",

                        save: true

                    }

                );

            }

            context.on(

                tukoChoice,

                "click",

                chooseTuko

            );

            context.on(

                takuChoice,

                "click",

                chooseTaku

            );

            context.on(

                document,

                "keydown",

                function (event) {

                    if (

                        busy ||

                        finished

                    ) {

                        return;

                    }

                    if (

                        event.key ===

                            "ArrowLeft" ||

                        event.key === "a" ||

                        event.key === "A"

                    ) {

                        event.preventDefault();

                        chooseTuko();

                        return;

                    }

                    if (

                        event.key ===

                        "ArrowRight"

                    ) {

                        event.preventDefault();

                        chooseTaku();

                    }

                }

            );

            context.timeout(

                async function () {

                    await speak(

                        "assets/audio/host_finale5.mp3"

                    );

                },

                80

            );

        },

        unmount: function () {

            const screen = document.querySelector(

                ".finale-false-choice-screen"

            );

            if (screen) {

                screen.remove();

            }

        }

    };

    game.scenes.finale_video2 = {

        id: "finale_video2",

        mount: function (root, context) {

            const scene = createStage(
                "finale-video2-screen",

                "finale-clean-stage"

            );



            const video =

                createFullScreenVideo(

                    scene.stage,

                    ASSETS.video2

                );



            root.appendChild(

                scene.screen

            );

            // =====================================================
            // УДАР ВЕДУЩЕГО И РАЗРУШЕНИЕ СТОЛА
            // =====================================================

            // Первый звук — непосредственно удар посоха.

            context.timeout(function () {

                if (!video.isConnected) {
                    return;
                }

                const impact = new Audio(
                    ASSETS.video2ImpactSfx
                );

                impact.volume = 0.9;

                impact.play().catch(function () {});

            }, 550);
            
            /* =====================================================
            ВТОРОЙ ЗВУК — РАЗРУШЕНИЕ СТОЛА
            Запускается по времени самого видео
            ===================================================== */

            let breakSoundPlayed = false;

            video.addEventListener("timeupdate", function () {

                // Звук срабатывает только один раз.
                if (breakSoundPlayed) {
                    return;
                }

                // Ждём момента, когда разрушение уже видно.
                if (video.currentTime < 2.5) {
                    return;
                }

                breakSoundPlayed = true;

                const destruction = new Audio(
                    ASSETS.video2BreakSfx
                );

                destruction.preload = "auto";
                destruction.volume = 1.0;

                destruction.addEventListener("error", function () {

                    console.error(
                        "Не удалось загрузить звук разрушения:",
                        ASSETS.video2BreakSfx
                    );

                }, { once: true });

                const playResult = destruction.play();

                if (
                    playResult &&
                    typeof playResult.catch === "function"
                ) {
                    playResult.catch(function (error) {

                        console.error(
                            "Не удалось воспроизвести звук разрушения:",
                            error
                        );

                    });
                }

            });


            async function afterVideo() {

                video.remove();



                context.goTo(

                    "finale_gameplay",

                    {

                        checkpointId:

                            "finale_gameplay",

                        save: true

                    }

                );

            }



            finishVideo(

                video,

                afterVideo,

                context

            );



            context.timeout(

                function () {

                    const playResult =

                        video.play();



                    if (

                        playResult &&

                        typeof playResult.catch ===

                            "function"

                    ) {

                        playResult.catch(

                            function () {

                                afterVideo();

                            }

                        );

                    }

                },

                50

            );

        },



        unmount: function () {}

    };

    game.scenes.finale_gameplay = {
        id: "finale_gameplay",

        mount: function (root, context) {
            const scene = createStage(
                "finale-broken-frame-screen",
                "finale-broken-frame-stage"
            );

            const background = document.createElement("img");
            background.className = "finale-broken-frame-background";
            background.src = ASSETS.brokenBackground;
            background.alt = "";
            background.draggable = false;

            const tuko = createImage(
                game.config.players.tuko.image,
                "finale-gameplay-tuko"
            );

            const taku = createImage(
                game.config.players.taku.image,
                "finale-gameplay-taku"
            );

            scene.stage.append(background, tuko, taku);

            /* =========================================================
            DEBUG-КАРТА ПРОХОДИМЫХ ЗОН

            Всё остальное на сцене считается БЕЗДНОЙ.

            Пока зоны видимые:
            🟢 зелёное = можно ходить
            🔴 красное = нельзя ходить

            Координаты потом можно спокойно подгонять.
            ========================================================= */

            const WALKABLE_ZONES = [

                /*
                * НИЖНЯЯ СТАРТОВАЯ ПЛОЩАДКА
                */
                {
                    id: "bottom",
                    left: "0%",
                    top: "85%",
                    width: "100%",
                    height: "22%"
                },

                /*
                * TAVERN — верхний левый остров
                */
                {
                    id: "tavern",
                    left: "20%",
                    top: "15%",
                    width: "10%",
                    height: "16%"
                },

                /*
                * ЛЕВЫЙ ЦЕНТРАЛЬНЫЙ ОСТРОВ
                */
                {
                    id: "left-center",
                    left: "28%",
                    top: "49%",
                    width: "10%",
                    height: "10%"
                },

                /*
                * ВЕРХНИЙ ЦЕНТРАЛЬНЫЙ ОСТРОВ
                */
                {
                    id: "center-upper-left",
                    left: "2%",
                    top: "65%",
                    width: "18%",
                    height: "22%"
                },

                /*
                * SPACEPORT
                */
                {
                    id: "spaceport",
                    left: "81%",
                    top: "15%",
                    width: "10%",
                    height: "16%"
                },

                /*
                * ПРАВЫЙ ЦЕНТРАЛЬНЫЙ ОСТРОВ
                */
                {
                    id: "right-center",
                    left: "62%",
                    top: "49%",
                    width: "10%",
                    height: "10%"
                },
    
                /*
                * НИЖНИЙ ПРАВЫЙ ОСТРОВ
                */
                {
                    id: "right-bottom",
                    left: "81%",
                    top: "70%",
                    width: "20%",
                    height: "24%"
                }
            ];

            const walkableLayer = document.createElement("div");

            walkableLayer.className =
                "finale-gameplay-walkable-debug-layer";


            /*
            * Большой красный слой:
            * по умолчанию весь экран запрещён.
            */
            const forbiddenLayer =
                document.createElement("div");

            forbiddenLayer.className =
                "finale-gameplay-forbidden-debug";


            walkableLayer.appendChild(
                forbiddenLayer
            );


            /*
            * Поверх красного рисуем разрешённые зоны.
            */
            WALKABLE_ZONES.forEach(function (zone) {

                const element =
                    document.createElement("div");

                element.className =
                    "finale-gameplay-walkable-zone";

                element.dataset.walkableId =
                    zone.id;

                element.style.left =
                    zone.left;

                element.style.top =
                    zone.top;

                element.style.width =
                    zone.width;

                element.style.height =
                    zone.height;

                element.innerHTML =
                    "<span>" +
                    zone.id +
                    "</span>";

                walkableLayer.appendChild(
                    element
                );
            });


            scene.stage.appendChild(
                walkableLayer
            );

            root.appendChild(scene.screen);

            const NEXT_SCENE_ID = "finale_threads";

            let destroyed = false;
            let gameplayStarted = false;
            let hostInterruptionRunning = false;
            let finaleFinished = false;
            let node4Ready = false;

            const phase = {
                value: "dialogue"
            };

            const state = {
                tuko: { x: 0, y: 0 },
                taku: { x: 0, y: 0 }
            };

            const STEP = 1.4;
            const ACTIVATION_RADIUS = 50;

            const NODE_OFFSETS = {
                node1: { x: 0, y: 0 },
                node2: { x: 15, y: -100 },
                node3: { x: 0, y: -130 },
                node4: { x: -100, y: -20 },
                node5: { x: -80, y: -35 },
                node6: { x: 120, y: 0 }
            };

            function makeImage(src, className) {
                const image = document.createElement("img");

                image.className = className;
                image.src = src;
                image.alt = "";
                image.draggable = false;
                image.setAttribute("aria-hidden", "true");

                return image;
            }

            function makeNode(number) {
                const node = makeImage(
                    "assets/images/finale_gameplay_activation_node.png",
                    "finale-gameplay-node finale-gameplay-node-" + number
                );

                node.dataset.nodeNumber = String(number);
                return node;
            }

            const node1 = makeNode(1);
            const node2 = makeNode(2);
            const node3 = makeNode(3);
            const node4 = makeNode(4);
            const node5 = makeNode(5);
            const node6 = makeNode(6);

            const bridge1 = makeImage(
                "assets/images/finale_gameplay_bridge1.png",
                "finale-gameplay-bridge finale-gameplay-bridge-1"
            );

            const bridge2 = makeImage(
                "assets/images/finale_gameplay_bridge2.png",
                "finale-gameplay-bridge finale-gameplay-bridge-2"
            );

            const bridge3 = makeImage(
                "assets/images/finale_gameplay_bridge3.png",
                "finale-gameplay-bridge finale-gameplay-bridge-3"
            );

            const bridge4 = makeImage(
                "assets/images/finale_gameplay_bridge4.png",
                "finale-gameplay-bridge finale-gameplay-bridge-4"
            );

            const bridge5 = makeImage(
                "assets/images/finale_gameplay_bridge5.png",
                "finale-gameplay-bridge finale-gameplay-bridge-5"
            );

            const host = makeImage(
                game.config.images.host,
                "finale-broken-host finale-gameplay-host"
            );

            function createControlHint(player) {

                const panel = document.createElement("div");

                panel.className =
                    "finale-gameplay-control-hint " +
                    "finale-gameplay-control-hint-" +
                    player;

                panel.dataset.player =
                    player;

                const title = document.createElement("div");

                title.className =
                    "finale-gameplay-control-hint-title";

                title.textContent =
                    player === "tuko"
                        ? "ТУКО"
                        : "ТАКУ";


                const controls = document.createElement("div");

                controls.className =
                    "finale-gameplay-control-hint-controls";


                if (player === "tuko") {

                    controls.innerHTML =

                        "<div class=\"control-row\">" +
                            "<span class=\"control-key\">W</span>" +
                        "</div>" +

                        "<div class=\"control-row\">" +
                            "<span class=\"control-key\">A</span>" +
                            "<span class=\"control-key\">S</span>" +
                            "<span class=\"control-key\">D</span>" +
                        "</div>";

                } else {

                    controls.innerHTML =

                        "<div class=\"control-row\">" +
                            "<span class=\"control-key\">↑</span>" +
                        "</div>" +

                        "<div class=\"control-row\">" +
                            "<span class=\"control-key\">←</span>" +
                            "<span class=\"control-key\">↓</span>" +
                            "<span class=\"control-key\">→</span>" +
                        "</div>";
                }


                panel.appendChild(title);
                panel.appendChild(controls);

                scene.stage.appendChild(panel);

                return panel;
            }


            const tukoControlHint =
                createControlHint("tuko");

            const takuControlHint =
                createControlHint("taku");


            function showControlHint(player) {

                const panel =
                    player === "tuko"
                        ? tukoControlHint
                        : takuControlHint;

                panel.classList.add("is-visible");
            }


            function hideControlHint(player) {

                const panel =
                    player === "tuko"
                        ? tukoControlHint
                        : takuControlHint;

                panel.classList.remove("is-visible");
            }


            hideControlHint("tuko");
            hideControlHint("taku");

            const bridgeBreakFlash = document.createElement("div");

            bridgeBreakFlash.className =
                "finale-gameplay-bridge-break-flash";

            bridgeBreakFlash.setAttribute(
                "aria-hidden",
                "true"
            );

            scene.stage.appendChild(
                bridgeBreakFlash
            );

            host.style.opacity = "0";
            host.style.visibility = "hidden";
            host.style.transition = "opacity 450ms ease";
            host.style.pointerEvents = "none";

            scene.stage.append(
                bridge1,
                bridge2,
                bridge3,
                bridge4,
                bridge5,
                node1,
                node2,
                node3,
                node4,
                node5,
                node6,
                host
            );

            const allBridges = [bridge1, bridge2, bridge3, bridge4, bridge5];
            const allNodes = [node1, node2, node3, node4, node5, node6];

            function setHidden(image) {
                image.classList.remove("is-open");
                image.classList.remove("is-active");
                image.classList.remove("is-destroyed");
                image.style.opacity = "0";
                image.style.visibility = "hidden";
                image.style.pointerEvents = "none";
            }

            function setVisible(image) {

                image.classList.add("is-open");

                image.style.opacity = "1";

                image.style.visibility = "visible";

                playGameplaySfx(
                    "assets/audio/finale_bridge_appear.mp3",
                    0.8
                );
            }

            function destroyBridge(image) {
                image.classList.remove("is-open");
                image.classList.add("is-destroyed");
                image.style.opacity = "0";
                image.style.visibility = "hidden";
            }

            function showNode(node) {
                node.classList.add("is-visible");
                node.classList.remove("is-active");
                node.style.opacity = "1";
                node.style.visibility = "visible";
                node.style.pointerEvents = "none";
            }

            function hideNode(node) {
                node.classList.remove("is-visible");
                node.classList.remove("is-active");
                node.style.opacity = "0";
                node.style.visibility = "hidden";
            }

            function activateNode(node) {

                node.classList.add("is-active");

                node.classList.add("is-visible");

                node.style.opacity = "1";

                node.style.visibility = "visible";

                playGameplaySfx(
                    "assets/audio/finale_node_activate.mp3",
                    0.9
                );
            }

            allBridges.forEach(setHidden);
            allNodes.forEach(hideNode);

            function setActivePlayer(player) {
                game.state.patch({
                    activePlayer: player
                });
            }

            function playerCenter(image) {
                const rect = image.getBoundingClientRect();

                return {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
            }

            function distanceBetween(a, b) {
                return Math.hypot(
                    a.x - b.x,
                    a.y - b.y
                );
            }

            function bridgeEndpoint(image, side) {
                const rect = image.getBoundingClientRect();

                switch (side) {
                    case "left":
                        return {
                            x: rect.left + 25,
                            y: rect.top + rect.height / 2
                        };

                    case "right":
                        return {
                            x: rect.right - 25,
                            y: rect.top + rect.height / 2
                        };

                    case "top-right":
                        return {
                            x: rect.right - 25,
                            y: rect.top + 25
                        };

                    case "top-left":
                        return {
                            x: rect.left + 25,
                            y: rect.top + 25
                        };

                    default:
                        return {
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2
                        };
                }
            }

            function playBridgeBreakFlash(bridge) {

                const bridgeRect =
                    bridge.getBoundingClientRect();

                const stageRect =
                    scene.stage.getBoundingClientRect();

                bridgeBreakFlash.style.left =
                    (
                        bridgeRect.left +
                        bridgeRect.width / 2 -
                        stageRect.left
                    ) + "px";

                bridgeBreakFlash.style.top =
                    (
                        bridgeRect.top +
                        bridgeRect.height / 2 -
                        stageRect.top
                    ) + "px";

                bridgeBreakFlash.classList.remove(
                    "is-active"
                );

                void bridgeBreakFlash.offsetWidth;

                bridgeBreakFlash.classList.add(
                    "is-active"
                );
            }

            function playGameplaySfx(path, volume) {

                const audio = new Audio(path);

                audio.preload = "auto";
                audio.volume = volume || 0.8;

                audio.currentTime = 0;

                audio.play().catch(
                    function () {}
                );

                return audio;
            }

            function playBridgeFallSound() {

                const audio = new Audio(
                    "assets/audio/bridge_fall.mp3"
                );

                audio.preload = "auto";
                audio.volume = 0.9;

                audio.currentTime = 0;

                audio.play().catch(
                    function () {}
                );

                context.timeout(
                    function () {

                        try {
                            audio.pause();
                            audio.currentTime = 0;
                        } catch (error) {}

                    },
                    3000
                );

                return audio;
            }

            function placeNodeAtPoint(node, point, offset) {

                const stageRect =
                    scene.stage.getBoundingClientRect();

                const offsetX =
                    offset ? offset.x : 0;

                const offsetY =
                    offset ? offset.y : 0;

                const xPercent =
                    ((point.x - stageRect.left + offsetX) /
                        stageRect.width) * 100;

                const yPercent =
                    ((point.y - stageRect.top + offsetY) /
                        stageRect.height) * 100;

                node.style.left = xPercent + "%";
                node.style.top = yPercent + "%";
                node.style.right = "auto";
                node.style.bottom = "auto";
            }

            function placeNodeAtBridgeEnd(
                node,
                bridge,
                side,
                offset
            ) {

                placeNodeAtPoint(
                    node,
                    bridgeEndpoint(bridge, side),
                    offset
                );
            }

            function renderPlayer(image, playerState, rotation) {
                const width = scene.stage.clientWidth;
                const height = scene.stage.clientHeight;

                const px = width * playerState.x / 100;
                const py = height * playerState.y / 100;

                image.style.transform =
                    "translate3d(" +
                    px +
                    "px, " +
                    py +
                    "px, 0) rotate(" +
                    rotation +
                    "deg)";
            }

            function finishToThreads() {
                if (destroyed || finaleFinished) {
                    return;
                }

                finaleFinished = true;
                phase.value = "tuko_at_tavern";
                setActivePlayer("both");
                hideNode(node6);

                context.timeout(function () {
                    if (destroyed) {
                        return;
                    }

                    if (game.scenes && game.scenes[NEXT_SCENE_ID]) {
                        context.goTo(
                            NEXT_SCENE_ID,
                            {
                                checkpointId: NEXT_SCENE_ID,
                                save: true
                            }
                        );
                        return;
                    }

                    console.warn(
                        "Finale reached the Tavern, but the next scene does not exist yet: " +
                        NEXT_SCENE_ID
                    );
                }, 700);
            }

            async function openBridge1() {
                phase.value = "bridge1_opening";
                setActivePlayer("none");

                setVisible(bridge1);

                await wait(context, 1000);
                if (destroyed) {
                    return;
                }

                placeNodeAtBridgeEnd(
                    node2,
                    bridge1,
                    "left",
                    NODE_OFFSETS.node2
                );
                showNode(node2);
                hideControlHint("tuko");
                phase.value = "taku_to_node2";
                setActivePlayer("taku");
                showControlHint("taku");
                render();
            }

            async function openBridge2() {
                phase.value = "bridge2_opening";
                setActivePlayer("none");

                setVisible(bridge2);

                await wait(context, 1000);
                if (destroyed) {
                    return;
                }

                placeNodeAtBridgeEnd(
                    node3,
                    bridge2,
                    "right",
                    NODE_OFFSETS.node3
                );
                showNode(node3);
                phase.value = "tuko_to_node3";
                setActivePlayer("tuko");
                render();
            }

            async function openBridge3AndInterrupt() {

                phase.value = "bridge3_opening";
                setActivePlayer("none");

                setVisible(bridge3);

                await wait(context, 3000);

                if (destroyed) {
                    return;
                }

                await hostDestroysBridge3();
            }

            async function hostDestroysBridge3() {

                if (
                    destroyed ||
                    hostInterruptionRunning
                ) {
                    return;
                }

                hostInterruptionRunning = true;

                phase.value = "host_interrupts";
                setActivePlayer("none");

                /* Появление Ведущего */
                await wait(context, 350);

                if (destroyed) {
                    return;
                }

                host.style.visibility = "visible";
                host.style.opacity = "1";

                /* Небольшая пауза перед репликой */
                await wait(context, 250);

                if (destroyed) {
                    return;
                }

                /* Реплика Ведущего */
                await playVoiceAndWait(
                    context,
                    "assets/audio/host_finale8.mp3"
                );

                await wait(context, 250);

                if (destroyed) {
                    return;
                }

                /* Вспышка в центре моста */
                playBridgeBreakFlash(bridge3);

                /* Звук разрушения — 3 секунды */
                playBridgeFallSound();

                /* Запускаем анимацию разрушения */
                bridge3.classList.add(
                    "is-breaking"
                );

                await wait(context, 3000);

                if (destroyed) {
                    return;
                }

                /* Полностью убираем мост */
                destroyBridge(bridge3);

                bridge3.classList.remove(
                    "is-breaking"
                );

                /* Убираем Ведущего */
                host.style.opacity = "0";

                await wait(context, 450);

                if (destroyed) {
                    return;
                }

                host.style.visibility = "hidden";

                const node3Rect = node3.getBoundingClientRect();
                const stageRect = scene.stage.getBoundingClientRect();

                const node4Left =
                    ((node3Rect.left - stageRect.left) / stageRect.width) * 100+4;

                const node4Top =
                    ((node3Rect.top - stageRect.top) / stageRect.height) * 100;

                node4.style.left = node4Left + "%";
                node4.style.top = node4Top + "%";

                node4.style.right = "auto";
                node4.style.bottom = "auto";

                node4Ready = false;

                showNode(node4);

                phase.value = "tuko_to_node4";
                setActivePlayer("tuko");

                hostInterruptionRunning = false;

                render();
            }

            async function openBridge5() {
                phase.value = "bridge5_opening";
                setActivePlayer("none");

                setVisible(bridge5);

                await wait(context, 1000);
                if (destroyed) {
                    return;
                }

                placeNodeAtBridgeEnd(
                    node6,
                    bridge5,
                    "top-left",
                    NODE_OFFSETS.node6
                );
                showNode(node6);
                phase.value = "tuko_to_node6";
                setActivePlayer("tuko");
                render();
            }

            async function startFinaleGameplay() {
                await wait(context, 650);
                if (destroyed) {
                    return;
                }

                await playVoiceAndWait(
                    context,
                    "assets/audio/taku_finale5.mp3"
                );
                await wait(context, 700);
                if (destroyed) {
                    return;
                }

                await playVoiceAndWait(
                    context,
                    "assets/audio/tuko_finale4.mp3"
                );
                await wait(context, 750);
                if (destroyed) {
                    return;
                }

                await playVoiceAndWait(
                    context,
                    "assets/audio/taku_finale6.mp3"
                );
                await wait(context, 700);
                if (destroyed) {
                    return;
                }

                await playVoiceAndWait(
                    context,
                    "assets/audio/tuko_finale5.mp3"
                );
                await wait(context, 500);
                if (destroyed) {
                    return;
                }

                gameplayStarted = true;
                phase.value = "tuko_to_node1";
                setActivePlayer("tuko");
                showNode(node1);
                showControlHint("tuko");
                render();
            }

            function onNode1Reached() {
                if (
                    phase.value !== "tuko_to_node1" ||
                    destroyed
                ) {
                    return;
                }

                const tukoPoint = playerCenter(tuko);
                const nodePoint = playerCenter(node1);

                if (
                    distanceBetween(tukoPoint, nodePoint) >
                    ACTIVATION_RADIUS
                ) {
                    return;
                }

                activateNode(node1);
                hideControlHint("tuko");
                hideNode(node1);
                openBridge1();
            }

            function onNode2Reached() {
                if (
                    phase.value !== "taku_to_node2" ||
                    destroyed
                ) {
                    return;
                }

                const takuPoint = playerCenter(taku);
                const nodePoint = playerCenter(node2);

                if (
                    distanceBetween(takuPoint, nodePoint) >
                    ACTIVATION_RADIUS
                ) {
                    return;
                }

                activateNode(node2);
                hideControlHint("taku");
                hideNode(node2);
                openBridge2();
            }

            function onNode3Reached() {
                if (
                    phase.value !== "tuko_to_node3" ||
                    destroyed
                ) {
                    return;
                }

                const tukoPoint = playerCenter(tuko);
                const nodePoint = playerCenter(node3);

                if (
                    distanceBetween(tukoPoint, nodePoint) >
                    ACTIVATION_RADIUS
                ) {
                    return;
                }

                activateNode(node3);
                hideNode(node3);
                openBridge3AndInterrupt();
            }

            function onNode4Reached() {

                if (
                    phase.value !== "tuko_to_node4" ||
                    destroyed
                ) {
                    return;
                }

                const tukoPoint = playerCenter(tuko);
                const nodePoint = playerCenter(node4);

                const distance =
                    distanceBetween(tukoPoint, nodePoint);

                /*
                * После появления node4 ТуКо всё ещё
                * находится на месте node3.
                * Сначала она должна ВЫЙТИ из зоны активации.
                */
                if (!node4Ready) {

                    if (distance > ACTIVATION_RADIUS) {
                        node4Ready = true;
                    }

                    return;
                }

                if (distance > ACTIVATION_RADIUS) {
                    return;
                }

                activateNode(node4);
                hideNode(node4);

                phase.value = "bridge4_building";
                setActivePlayer("none");

                setVisible(bridge4);

                context.timeout(function () {

                    if (destroyed) {
                        return;
                    }

                    placeNodeAtBridgeEnd(
                        node5,
                        bridge4,
                        "top-right",
                        NODE_OFFSETS.node5
                    );

                    showNode(node5);

                    phase.value = "taku_to_node5";
                    setActivePlayer("taku");

                    render();

                }, 1000);

                render();
            }

            function onNode5Reached() {
                if (
                    phase.value !== "taku_to_node5" ||
                    destroyed
                ) {
                    return;
                }

                const takuPoint = playerCenter(taku);
                const nodePoint = playerCenter(node5);

                if (
                    distanceBetween(takuPoint, nodePoint) >
                    ACTIVATION_RADIUS
                ) {
                    return;
                }

                activateNode(node5);
                hideNode(node5);
                openBridge5();
            }

            function onNode6Reached() {
                if (
                    phase.value !== "tuko_to_node6" ||
                    destroyed
                ) {
                    return;
                }

                const tukoPoint = playerCenter(tuko);
                const nodePoint = playerCenter(node6);

                if (
                    distanceBetween(tukoPoint, nodePoint) >
                    ACTIVATION_RADIUS
                ) {
                    return;
                }

                activateNode(node6);
                finishToThreads();
            }

            function render() {
                if (destroyed) {
                    return;
                }

                renderPlayer(tuko, state.tuko, -4);
                renderPlayer(taku, state.taku, 3);

                onNode1Reached();
                onNode2Reached();
                onNode3Reached();
                onNode4Reached();
                onNode5Reached();
                onNode6Reached();
            }

            /* =========================================================
            COLLISION ПО ПРОХОДИМЫМ ЗОНАМ
            ========================================================= */

            function pointInsideWalkableZone(point, zone) {

                const stageRect =
                    scene.stage.getBoundingClientRect();

                const pointX =
                    ((point.x - stageRect.left) /
                        stageRect.width) * 100;

                const pointY =
                    ((point.y - stageRect.top) /
                        stageRect.height) * 100;

                const left =
                    parseFloat(zone.left);

                const top =
                    parseFloat(zone.top);

                const width =
                    parseFloat(zone.width);

                const height =
                    parseFloat(zone.height);

                return (
                    pointX >= left &&
                    pointX <= left + width &&
                    pointY >= top &&
                    pointY <= top + height
                );
            }


            function pointInsideWalkableArea(point) {

                for (
                    let i = 0;
                    i < WALKABLE_ZONES.length;
                    i += 1
                ) {

                    if (
                        pointInsideWalkableZone(
                            point,
                            WALKABLE_ZONES[i]
                        )
                    ) {
                        return true;
                    }
                }

                return false;
            }

            function pointInsideBridge(point, bridge) {

                if (!bridge) {
                    return false;
                }

                const rect =
                    bridge.getBoundingClientRect();

                const style =
                    window.getComputedStyle(bridge);

                const matrix =
                    style.transform === "none"
                        ? new DOMMatrix()
                        : new DOMMatrix(style.transform);

                /*
                * Получаем угол поворота моста.
                */
                const angle =
                    Math.atan2(
                        matrix.b,
                        matrix.a
                    );

                /*
                * Центр визуального PNG.
                */
                const centerX =
                    rect.left +
                    rect.width / 2;

                const centerY =
                    rect.top +
                    rect.height / 2;

                /*
                * Положение точки относительно
                * центра PNG.
                */
                const dx =
                    point.x - centerX;

                const dy =
                    point.y - centerY;

                /*
                * Разворачиваем точку обратно
                * относительно угла моста.
                */
                const cos =
                    Math.cos(-angle);

                const sin =
                    Math.sin(-angle);

                const localX =
                    dx * cos -
                    dy * sin;

                const localY =
                    dx * sin +
                    dy * cos;

                /*
                * Проверяем весь PNG-мост.
                *
                * Прозрачные области изображения
                * тоже считаются частью
                * проходимой зоны.
                */
                const halfWidth =
                    bridge.offsetWidth / 2;

                const halfHeight =
                    bridge.offsetHeight / 2;

                return (
                    Math.abs(localX) <= halfWidth &&
                    Math.abs(localY) <= halfHeight
                );
            }

            function pointInsideOpenBridge(point) {

                for (
                    let i = 0;
                    i < allBridges.length;
                    i += 1
                ) {

                    const bridge = allBridges[i];

                    if (
                        !bridge.classList.contains("is-open")
                    ) {
                        continue;
                    }

                    if (
                        bridge.classList.contains("is-destroyed")
                    ) {
                        continue;
                    }

                    if (
                        pointInsideBridge(
                            point,
                            bridge
                        )
                    ) {
                        return true;
                    }
                }

                return false;
            }

            function canMoveTo(player, dx, dy) {

                const image =
                    player === "tuko"
                        ? tuko
                        : taku;

                const currentCenter =
                    playerCenter(image);

                const stageWidth =
                    scene.stage.clientWidth;

                const stageHeight =
                    scene.stage.clientHeight;

                const nextPoint = {

                    x:
                        currentCenter.x +
                        stageWidth * dx / 100,

                    y:
                        currentCenter.y +
                        stageHeight * dy / 100

                };


                /*
                * 1. ОТКРЫТЫЙ МОСТ
                *
                * Мост имеет приоритет.
                * Поэтому даже над красной бездной
                * по нему идти можно.
                */
                if (
                    pointInsideOpenBridge(nextPoint)
                ) {
                    return true;
                }


                /*
                * 2. РАЗРЕШЁННАЯ ПОВЕРХНОСТЬ
                *
                * Остров или нижняя стартовая зона.
                */
                if (
                    pointInsideWalkableArea(nextPoint)
                ) {
                    return true;
                }


                /*
                * 3. Всё остальное —
                * бездна.
                */
                return false;
            }

            function move(player, dx, dy) {

                if (
                    destroyed ||
                    !gameplayStarted ||
                    finaleFinished
                ) {
                    return false;
                }

                /*
                * Если следующий шаг запрещён,
                * персонаж не двигается.
                */
                if (
                    !canMoveTo(
                        player,
                        dx,
                        dy
                    )
                ) {
                    return false;
                }

                state[player].x += dx;
                state[player].y += dy;

                render();

                return true;
            }

            function handleKeydown(event) {

                if (
                    event.repeat ||
                    destroyed ||
                    !gameplayStarted ||
                    finaleFinished
                ) {
                    return;
                }


                let moved = false;

                let movedPlayer = null;


                switch (event.code) {

                    case "KeyW":

                        if (
                            phase.value !== "tuko_to_node1" &&
                            phase.value !== "tuko_to_node3" &&
                            phase.value !== "tuko_to_node4" &&
                            phase.value !== "tuko_to_node6"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "tuko",
                                0,
                                -STEP
                            );

                        movedPlayer = "tuko";

                        break;


                    case "KeyA":

                        if (
                            phase.value !== "tuko_to_node1" &&
                            phase.value !== "tuko_to_node3" &&
                            phase.value !== "tuko_to_node4" &&
                            phase.value !== "tuko_to_node6"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "tuko",
                                -STEP,
                                0
                            );

                        movedPlayer = "tuko";

                        break;


                    case "KeyS":

                        if (
                            phase.value !== "tuko_to_node1" &&
                            phase.value !== "tuko_to_node3" &&
                            phase.value !== "tuko_to_node4" &&
                            phase.value !== "tuko_to_node6"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "tuko",
                                0,
                                STEP
                            );

                        movedPlayer = "tuko";

                        break;


                    case "KeyD":

                        if (
                            phase.value !== "tuko_to_node1" &&
                            phase.value !== "tuko_to_node3" &&
                            phase.value !== "tuko_to_node4" &&
                            phase.value !== "tuko_to_node6"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "tuko",
                                STEP,
                                0
                            );

                        movedPlayer = "tuko";

                        break;


                    case "ArrowUp":

                        if (
                            phase.value !== "taku_to_node2" &&
                            phase.value !== "taku_to_node5"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "taku",
                                0,
                                -STEP
                            );

                        movedPlayer = "taku";

                        break;


                    case "ArrowLeft":

                        if (
                            phase.value !== "taku_to_node2" &&
                            phase.value !== "taku_to_node5"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "taku",
                                -STEP,
                                0
                            );

                        movedPlayer = "taku";

                        break;


                    case "ArrowDown":

                        if (
                            phase.value !== "taku_to_node2" &&
                            phase.value !== "taku_to_node5"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "taku",
                                0,
                                STEP
                            );

                        movedPlayer = "taku";

                        break;


                    case "ArrowRight":

                        if (
                            phase.value !== "taku_to_node2" &&
                            phase.value !== "taku_to_node5"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        moved =
                            move(
                                "taku",
                                STEP,
                                0
                            );

                        movedPlayer = "taku";

                        break;


                    default:
                        return;
                }


                /*
                * Подсказка исчезает только после
                * реального движения.
                */
                if (
                    moved &&
                    movedPlayer
                ) {
                    hideControlHint(movedPlayer);
                }
            }

            context.on(
                document,
                "keydown",
                handleKeydown
            );

            context.timeout(function () {
                if (destroyed) {
                    return;
                }

                scene.screen.classList.add(
                    "finale-broken-frame-ready"
                );

                render();
                startFinaleGameplay();
            }, 60);
        },

        unmount: function () {
            destroyed = true;
        }
    };

    game.scenes.finale_threads = {

        id: "finale_threads",

        mount: function (root, context) {

            const scene = createStage(
                "finale-threads-screen",
                "finale-threads-stage"
            );

            const background =
                document.createElement("img");

            background.className =
                "finale-threads-background";

            background.src =
                ASSETS.brokenBackground;

            background.alt = "";

            background.draggable = false;


            /*
            * =====================================================
            * ПЕРСОНАЖИ
            * =====================================================
            */

            const tuko = createImage(
                game.config.players.tuko.image,
                "finale-threads-tuko"
            );

            const taku = createImage(
                game.config.players.taku.image,
                "finale-threads-taku"
            );


            /*
            * =====================================================
            * ВЕДУЩИЙ
            * =====================================================
            */

            const host = createImage(
                game.config.images.host,
                "finale-threads-host"
            );

            function createHostShards() {

            const shards = [];

            const clips = [

                "polygon(0 0, 28% 0, 24% 28%, 0 35%)",

                "polygon(28% 0, 52% 0, 47% 24%, 24% 28%)",

                "polygon(52% 0, 78% 0, 82% 25%, 47% 24%)",

                "polygon(78% 0, 100% 0, 100% 34%, 82% 25%)",

                "polygon(0 35%, 24% 28%, 22% 58%, 0 64%)",

                "polygon(24% 28%, 47% 24%, 51% 55%, 22% 58%)",

                "polygon(47% 24%, 82% 25%, 76% 58%, 51% 55%)",

                "polygon(82% 25%, 100% 34%, 100% 65%, 76% 58%)",

                "polygon(0 64%, 22% 58%, 28% 100%, 0 100%)",

                "polygon(22% 58%, 51% 55%, 50% 100%, 28% 100%)",

                "polygon(51% 55%, 76% 58%, 74% 100%, 50% 100%)",

                "polygon(76% 58%, 100% 65%, 100% 100%, 74% 100%)"

            ];

            const directions = [

                [-24, -18, -22],
                [-12, -25, -16],
                [2, -28, 8],
                [20, -20, 22],

                [-30, -4, -32],
                [-15, 2, -12],
                [13, -2, 18],
                [30, -3, 34],

                [-24, 18, -28],
                [-9, 25, -15],
                [10, 24, 16],
                [25, 16, 26]

            ];

            clips.forEach(
                function (clip, index) {

                    const shard =
                        host.cloneNode(true);

                    shard.className =
                        "finale-threads-host-shard";

                    shard.style.clipPath =
                        clip;

                    shard.style.setProperty(
                        "--dx",
                        directions[index][0] + "vw"
                    );

                    shard.style.setProperty(
                        "--dy",
                        directions[index][1] + "vh"
                    );

                    shard.style.setProperty(
                        "--rot",
                        directions[index][2] + "deg"
                    );

                    scene.stage.appendChild(
                        shard
                    );

                    shards.push(
                        shard
                    );

                }
            );

            return shards;

        }


        function createFinaleExplosion() {

            const explosion =
                document.createElement("div");

            explosion.className =
                "finale-threads-explosion";

            explosion.setAttribute(
                "aria-hidden",
                "true"
            );


            const core =
                document.createElement("div");

            core.className =
                "finale-threads-explosion-core";


            const shockwave =
                document.createElement("div");

            shockwave.className =
                "finale-threads-explosion-shockwave";


            explosion.append(
                shockwave,
                core
            );


            const particleCount = 32;

            for (
                let i = 0;
                i < particleCount;
                i += 1
            ) {

                const particle =
                    document.createElement("span");

                particle.className =
                    "finale-threads-explosion-particle";


                const angle =
                    (
                        Math.PI * 2 * i
                    ) /
                    particleCount;

                const distance =
                    28 +
                    (
                        (i % 6) * 5
                    );

                const dx =
                    Math.cos(angle) *
                    distance;

                const dy =
                    Math.sin(angle) *
                    distance;


                particle.style.setProperty(
                    "--dx",
                    dx + "vw"
                );

                particle.style.setProperty(
                    "--dy",
                    dy + "vh"
                );

                particle.style.setProperty(
                    "--delay",
                    (
                        (i % 6) * 24
                    ) + "ms"
                );


                explosion.appendChild(
                    particle
                );

            }


            scene.stage.appendChild(
                explosion
            );


            requestAnimationFrame(
                function () {

                    explosion.classList.add(
                        "is-active"
                    );

                }
            );


            context.timeout(
                function () {

                    if (
                        explosion &&
                        explosion.parentNode
                    ) {
                        explosion.remove();
                    }

                },
                4300
            );

        }

            /*
            * =====================================================
            * 6 ЗОЛОТЫХ НИТЕЙ
            * =====================================================
            *
            * 4 нити ведут к мирам:
            *   tavern
            *   spaceport
            *   arena
            *   casino
            *
            * 2 нити удерживают Кость Перехода.
            * =====================================================
            */

            const goldenThreads = {

                tavern: createImage(
                    "assets/images/final_thread_tavern.svg",
                    "finale-threads-line finale-threads-line-tavern"
                ),

                casino: createImage(
                    "assets/images/final_thread_casino.svg",
                    "finale-threads-line finale-threads-line-casino"
                ),

                dieLeft: createImage(
                    "assets/images/final_thread_die_left.svg",
                    "finale-threads-line finale-threads-line-die-left"
                ),

                spaceport: createImage(
                    "assets/images/final_thread_spaceport.svg",
                    "finale-threads-line finale-threads-line-spaceport"
                ),

                arena: createImage(
                    "assets/images/final_thread_arena.svg",
                    "finale-threads-line finale-threads-line-arena"
                ),

                dieRight: createImage(
                    "assets/images/final_thread_die_right.svg",
                    "finale-threads-line finale-threads-line-die-right"
                )

            };

            const goldenThreadList = [
                goldenThreads.tavern,
                goldenThreads.casino,
                goldenThreads.dieLeft,
                goldenThreads.spaceport,
                goldenThreads.arena,
                goldenThreads.dieRight
            ];

            /* =====================================================
            * ЭНЕРГЕТИЧЕСКИЕ ИМПУЛЬСЫ НИТЕЙ
            * ===================================================== */

            const threadPulses = {

                tavern:
                    document.createElement("div"),

                spaceport:
                    document.createElement("div"),

                arena:
                    document.createElement("div"),

                casino:
                    document.createElement("div"),

                dieLeft:
                    document.createElement("div"),

                dieRight:
                    document.createElement("div")

            };


            Object.keys(threadPulses).forEach(
                function (threadId) {

                    const pulse =
                        threadPulses[threadId];

                    pulse.className =
                        "finale-threads-energy-pulse " +
                        "finale-threads-energy-pulse-" +
                        threadId;

                    pulse.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }
            );


            const threadPulseList = [
                threadPulses.tavern,
                threadPulses.spaceport,
                threadPulses.arena,
                threadPulses.casino,
                threadPulses.dieLeft,
                threadPulses.dieRight
            ];

            /* =====================================================
            * ЗВУКИ FINALE THREADS
            * ===================================================== */

            const THREAD_SFX = {

                energy:
                    "assets/audio/finale_threads_energy.mp3",

                selectorCorrect:
                    "assets/audio/finale_threads_selector_correct.mp3",

                selectorWrong:
                    "assets/audio/finale_threads_selector_wrong.mp3",

                stitchAppear:
                    "assets/audio/finale_threads_stitch.mp3",

                stitchRip:
                    "assets/audio/niti_rvet_stitch.mp3",

                hostBoom:
                    "assets/audio/host_boom.mp3"

            };


            function playThreadsSfx(
                path,
                volume
            ) {

                const audio =
                    new Audio(path);

                audio.preload = "auto";

                audio.volume =
                    volume || 0.85;

                audio.currentTime = 0;

                audio.play().catch(
                    function () {}
                );

                return audio;
            }

            function playSfxAndWait(
                context,
                path,
                volume,
                fallbackMilliseconds
            ) {

                return new Promise(
                    function (resolve) {

                        const audio =
                            playThreadsSfx(
                                path,
                                volume
                            );

                        let finished = false;

                        function finish() {

                            if (finished) {
                                return;
                            }

                            finished = true;

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

                        context.timeout(
                            finish,
                            fallbackMilliseconds || 3000
                        );

                    }
                );

            }

            /*
            * =====================================================
            * КОСТЬ ПЕРЕХОДА
            * =====================================================
            */

            const die = createImage(
                "assets/images/finale_threads_die.png",
                "finale-threads-die"
            );

            const stitch = createImage(
                "assets/images/stitch_push.png",
                "finale-threads-stitch"
            );

            /*
            * =====================================================
            * УСТРОЙСТВО ВЕДУЩЕГО
            * =====================================================
            */

            const selectorWrap =
                document.createElement("div");

            selectorWrap.className =
                "finale-threads-selector";

            selectorWrap.classList.add(
                "is-hidden"
            );


            const selectorFrame =
                createImage(
                    "assets/images/finale_world_selector.png",
                    "finale-threads-selector-frame"
                );

            const selectorDisplay =
                document.createElement("div");

            selectorDisplay.className =
                "finale-threads-selector-display";

            /* =====================================================
            * ПОДСКАЗКА ДЛЯ ТАКУ
            * ===================================================== */

            const takuMechanicHint =
                document.createElement("div");

            takuMechanicHint.className =
                "finale-threads-control-hint " +
                "finale-threads-control-hint-taku";

            takuMechanicHint.innerHTML =

                "<div class=\"finale-threads-control-title\">" +
                    "ТАКУ" +
                "</div>" +

                "<div class=\"finale-threads-control-subtitle\">" +
                    "ИСПОЛЬЗУЙ МЫШЬ" +
                "</div>" +

                "<div class=\"finale-threads-mouse-icon\">" +
                    "<span></span>" +
                "</div>";


            /* =====================================================
            * ПОДСКАЗКА ДЛЯ ТУКО
            * ===================================================== */

            const tukoThreadHint =
                document.createElement("div");

            tukoThreadHint.className =
                "finale-threads-control-hint " +
                "finale-threads-control-hint-tuko";

            tukoThreadHint.innerHTML =

                "<div class=\"finale-threads-control-title\">" +
                    "ТУКО" +
                "</div>" +

                "<div class=\"finale-threads-control-subtitle\">" +
                    "ИДИ К НИТИ" +
                "</div>" +

                "<div class=\"finale-threads-wasd\">" +

                    "<span class=\"finale-threads-key\">W</span>" +

                    "<div class=\"finale-threads-key-row\">" +

                        "<span class=\"finale-threads-key\">A</span>" +
                        "<span class=\"finale-threads-key\">S</span>" +
                        "<span class=\"finale-threads-key\">D</span>" +

                    "</div>" +

                "</div>";


            /*
            * =====================================================
            * МИРЫ
            *
            * Порядок:
            * 0 = Таверна
            * 1 = Космопорт
            * 2 = Арена
            * 3 = Казино
            * =====================================================
            */

            const WORLD_OPTIONS = [

                {
                    id: "tavern",
                    image:
                        "assets/images/tavern_bottle_flame.png"
                },

                {
                    id: "spaceport",
                    image:
                        "assets/images/spaceport_module_ring.png"
                },

                {
                    id: "arena",
                    image:
                        "assets/images/runa_1.png"
                },

                {
                    id: "casino",
                    image:
                        "assets/images/living_card.png"
                }

            ];

            /*
            * =====================================================
            * ПРЕДЗАГРУЗКА КАРТИНОК СЕЛЕКТОРА
            * =====================================================
            */

            const selectorImageCache = {};

            WORLD_OPTIONS.forEach(
                function (option) {

                    const image =
                        new Image();

                    image.src =
                        option.image;

                    selectorImageCache[
                        option.id
                    ] = image;

                }
            );

            const REQUIRED_WORLD_ORDER = [

                "tavern",
                "spaceport",
                "arena",
                "casino"

            ];


            /*
            * =====================================================
            * 4 СЛОТА
            * =====================================================
            */

            const selectorSlots = [];


            WORLD_OPTIONS.forEach(
                function (option, index) {

                    const slot =
                        document.createElement("button");

                    slot.type = "button";

                    slot.className =
                        "finale-threads-selector-slot";

                    slot.dataset.slot =
                        String(index);


                    const image =
                        document.createElement("img");

                    image.className =
                        "finale-threads-selector-world";

                    /*
                    * Только первое окно сразу заполнено.
                    *
                    * Остальные появляются только тогда,
                    * когда до них доходит очередь.
                    */

                    if (index === 0) {

                        image.src =
                            option.image;

                    } else {

                        image.removeAttribute(
                            "src"
                        );

                    }

                    image.alt = "";

                    image.draggable = false;


                    slot.appendChild(image);

                    selectorDisplay.appendChild(slot);

                    selectorSlots.push({
                        element: slot,
                        image: image,
                        worldIndex:
                            index === 0
                                ? 0
                                : -1,

                        worldId:
                            index === 0
                                ? option.id
                                : null
                    });

                }
            );

            selectorWrap.append(
                selectorFrame,
                selectorDisplay
            );

            /*
            * =====================================================
            * СОСТОЯНИЕ WORLD SELECTOR
            * =====================================================
            */

            let activeSlotIndex = -1;

            let selectorTimer = null;

            let selectorBusy = false;

            let selectorFinished = false;

            const selectorLocked = [
                false,
                false,
                false,
                false
            ];

            /*
            * =====================================================
            * СОСТОЯНИЕ ТУКО И НИТЕЙ
            * =====================================================
            */

            let activeThreadIndex = -1;

            let threadActivated = [
                false,
                false,
                false,
                false
            ];

            let tukoCanMove = false;

            let tukoThreadHintVisible = false;

            const TUKO_STEP = 1.2;

            const TUKO_TARGET_RADIUS = 2.8;

            const TUKO_TARGETS = {

                tavern: {
                    x: 30,
                    y: 25
                },

                spaceport: {
                    x: 69,
                    y: 22
                },

                arena: {
                    x: 95,
                    y: 59
                },

                casino: {
                    x: 5,
                    y: 55
                }

            };

            const TUKO_START_POSITIONS = {

                tavern: {
                    x: 22,
                    y: 27
                },

                spaceport: {
                    x: 84,
                    y: 27
                },

                arena: {
                    x: 82,
                    y: 56
                },

                casino: {
                    x: 18,
                    y: 55
                }

            };

            const tukoTargetMarkers = {};

            Object.keys(TUKO_TARGETS).forEach(
                function (worldId) {

                    const marker =
                        document.createElement("div");

                    marker.className =
                        "finale-threads-tuko-target";

                    marker.dataset.world =
                        worldId;

                    marker.style.left =
                        TUKO_TARGETS[worldId].x + "%";

                    marker.style.top =
                        TUKO_TARGETS[worldId].y + "%";

                    marker.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    tukoTargetMarkers[worldId] =
                        marker;
                }
            );

            const THREAD_TARGETS = {

                tavern: {
                    x: 28,
                    y: 27
                },

                spaceport: {
                    x: 76,
                    y: 27
                },

                arena: {
                    x: 87,
                    y: 50
                },

                casino: {
                    x: 11,
                    y: 49
                }

            };

            const tukoState = {

                x:
                    TUKO_START_POSITIONS.tavern.x,

                y:
                    TUKO_START_POSITIONS.tavern.y

            };

            function showTakuMechanicHint() {

                takuMechanicHint.classList.add(
                    "is-visible"
                );

            }


            function hideTakuMechanicHint() {

                takuMechanicHint.classList.remove(
                    "is-visible"
                );

            }


            function showTukoThreadHint() {

                tukoThreadHint.classList.add(
                    "is-visible"
                );

                tukoThreadHintVisible = true;

            }


            function hideTukoThreadHint() {

                tukoThreadHint.classList.remove(
                    "is-visible"
                );

                tukoThreadHintVisible = false;

            }

            /*
            * =====================================================
            * РЕНДЕР ТУКО
            * =====================================================
            */

            function renderTuko() {

                tuko.style.left =
                    tukoState.x + "%";

                tuko.style.top =
                    tukoState.y + "%";

                tuko.style.transform =
                    "translate(-50%, -50%) rotate(-4deg)";
            }


            renderTuko();

            function distanceToThread(
                worldId
            ) {

                const target =
                    THREAD_TARGETS[worldId];

                if (!target) {
                    return Infinity;
                }

                const dx =
                    tukoState.x -
                    target.x;

                const dy =
                    tukoState.y -
                    target.y;

                return Math.hypot(
                    dx,
                    dy
                );
            }

            /* =====================================================
            * ЗАПУСТИТЬ ИМПУЛЬС ПО НИТИ
            * ===================================================== */

            function playThreadEnergyPulse(
                threadId
            ) {

                const pulse =
                    threadPulses[threadId];

                if (!pulse) {
                    return;
                }


                /*
                * Полностью сбрасываем предыдущую анимацию.
                */

                pulse.classList.remove(
                    "is-active"
                );

                void pulse.offsetWidth;

                const energyAudio =
                    playThreadsSfx(
                        THREAD_SFX.energy,
                        0.9
                    );

                if (host) {

                    let hostShakeTriggered =
                        false;

                    function triggerHostShake() {

                        if (
                            hostShakeTriggered ||
                            destroyed
                        ) {
                            return;
                        }

                        hostShakeTriggered = true;

                        host.classList.remove(
                            "is-thread-shaking"
                        );

                        void host.offsetWidth;

                        host.classList.add(
                            "is-thread-shaking"
                        );

                        context.timeout(
                            function () {

                                if (destroyed) {
                                    return;
                                }

                                host.classList.remove(
                                    "is-thread-shaking"
                                );

                            },
                            520
                        );

                    }

                    energyAudio.addEventListener(
                        "ended",
                        triggerHostShake
                    );

                    energyAudio.addEventListener(
                        "error",
                        triggerHostShake
                    );

                }

                pulse.classList.add(
                    "is-active"
                );

            }

            /* =====================================================
            * ДИАЛОГ ПОСЛЕ АКТИВАЦИИ НИТИ
            * ===================================================== */

            async function continueAfterThread(
                world,
                nextSlot
            ) {

                if (destroyed) {
                    return;
                }


                /*
                * =================================================
                * ПЕРВАЯ НИТЬ
                * =================================================
                */

                if (
                    world === "tavern"
                ) {

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/host_finale_threads2.mp3"
                    );

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_taku5.mp3"
                    );

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/host_finale_threads3.mp3"
                    );

                }

                if (
                    world === "spaceport"
                ) {

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_tuko3.mp3"
                    );

                }


                /*
                * =================================================
                * ТРЕТЬЯ НИТЬ
                * =================================================
                */

                if (
                    world === "arena"
                ) {

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_tuko5.mp3"
                    );

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/host_finale_threads5.mp3"
                    );

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_taku8.mp3"
                    );

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_taku9.mp3"
                    );

                    await wait(
                        context,
                        180
                    );

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_tuko6.mp3"
                    );

                }


                /*
                * =================================================
                * ПЕРЕД СЛЕДУЮЩИМ ОКНОМ
                * =================================================
                */

                if (
                    destroyed
                ) {
                    return;
                }


                startSelectorSpin(
                    nextSlot
                );

            }

            function activateCurrentThread() {

                if (
                    destroyed ||
                    selectorFinished ||
                    activeThreadIndex < 0
                ) {
                    return;
                }


                const world =
                    REQUIRED_WORLD_ORDER[
                        activeThreadIndex
                    ];


                /*
                * Эта нить уже активирована.
                */

                if (
                    threadActivated[
                        activeThreadIndex
                    ]
                ) {
                    return;
                }


                const target =
                    TUKO_TARGETS[world];

                if (!target) {
                    return;
                }


                /*
                * =====================================================
                * ПРОВЕРЯЕМ ФАКТИЧЕСКОЕ ПОЛОЖЕНИЕ ТУКО ОТНОСИТЕЛЬНО
                * ВИЗУАЛЬНОЙ ТОЧКИ
                * =====================================================
                */

                const marker =
                    tukoTargetMarkers[world];

                if (!marker) {
                    return;
                }

                const stageRect =
                    scene.stage.getBoundingClientRect();

                const tukoRect =
                    tuko.getBoundingClientRect();

                const markerRect =
                    marker.getBoundingClientRect();


                /*
                * Центр ТуКо в пикселях относительно stage.
                */

                const tukoCenterX =
                    tukoRect.left +
                    tukoRect.width / 2 -
                    stageRect.left;

                const tukoCenterY =
                    tukoRect.top +
                    tukoRect.height / 2 -
                    stageRect.top;


                /*
                * Центр визуальной точки.
                */

                const markerCenterX =
                    markerRect.left +
                    markerRect.width / 2 -
                    stageRect.left;

                const markerCenterY =
                    markerRect.top +
                    markerRect.height / 2 -
                    stageRect.top;


                /*
                * Расстояние между центрами в пикселях.
                */

                const dx =
                    tukoCenterX -
                    markerCenterX;

                const dy =
                    tukoCenterY -
                    markerCenterY;

                const distance =
                    Math.hypot(
                        dx,
                        dy
                    );


                /*
                * 2.8% ширины stage сохраняем как
                * наш старый радиус срабатывания.
                */

                const targetRadiusPx =
                    stageRect.width *
                    (TUKO_TARGET_RADIUS / 100);


                if (
                    distance >
                    targetRadiusPx
                ) {
                    return;
                }


                /*
                * =====================================================
                * ТОЧКА ДОСТИГНУТА
                * СТАВИМ ТУКО ТОЧНО В ЦЕНТР ТОЧКИ
                * =====================================================
                */

                tukoState.x =
                    (
                        markerCenterX /
                        stageRect.width
                    ) * 100;

                tukoState.y =
                    (
                        markerCenterY /
                        stageRect.height
                    ) * 100;

                renderTuko();


                /*
                * =====================================================
                * ТОЧКА ДОСТИГНУТА
                * =====================================================
                */

                threadActivated[
                    activeThreadIndex
                ] = true;

                tukoCanMove = false;
                hideTukoThreadHint();

                if (marker) {

                    marker.classList.remove(
                        "is-active"
                    );

                    marker.classList.add(
                        "is-reached"
                    );
                }

                /*
                * =====================================================
                * НИТЬ НАЧИНАЕТ НАТЯГИВАТЬСЯ
                * =====================================================
                */

                const currentGoldenThread =
                    goldenThreads[world];

                if (currentGoldenThread) {

                    /*
                    * Сбрасываем предыдущее состояние,
                    * чтобы анимация гарантированно проигралась.
                    */

                    currentGoldenThread.classList.remove(
                        "is-taut"
                    );

                    currentGoldenThread.classList.remove(
                        "is-tightening"
                    );

                    /*
                    * =====================================================
                    * ЭНЕРГЕТИЧЕСКИЙ ИМПУЛЬС
                    * =====================================================
                    */

                    playThreadEnergyPulse(
                        world
                    );


                    /*
                    * Короткий удар всей сцены.
                    */

                    scene.screen.classList.remove(
                        "is-thread-impact"
                    );

                    void scene.screen.offsetWidth;

                    scene.screen.classList.add(
                        "is-thread-impact"
                    );

                    void currentGoldenThread.offsetWidth;

                    /*
                    * Резкий магический рывок нити.
                    */

                    currentGoldenThread.classList.add(
                        "is-tightening"
                    );


                    /*
                    * После рывка нить остаётся
                    * натянутой и светится сильнее.
                    */

                    context.timeout(
                        function () {

                            if (destroyed) {
                                return;
                            }

                            currentGoldenThread.classList.remove(
                                "is-tightening"
                            );

                            currentGoldenThread.classList.add(
                                "is-taut"
                            );

                        },
                        1100
                    );

                }

                const activatedWorldThreads =
                    threadActivated.filter(
                        Boolean
                    ).length;

                if (
                    activatedWorldThreads >= 4
                ) {

                    goldenThreads.dieLeft.classList.add(
                        "is-tense"
                    );

                    goldenThreads.dieRight.classList.add(
                        "is-tense"
                    );

                }


                /*
                * Фиксируем слот ТаКу.
                */

                const slot =
                    selectorSlots[
                        activeThreadIndex
                    ];

                if (slot) {

                    slot.element.classList.remove(
                        "is-active"
                    );

                    slot.element.classList.add(
                        "is-locked"
                    );

                    slot.element.classList.add(
                        "is-correct"
                    );
                }


                /*
                * =====================================================
                * СЛЕДУЮЩИЙ МИР
                * =====================================================
                */

                const nextSlot =
                    activeThreadIndex + 1;


                /*
                * Все четыре мира пройдены.
                */

                if (
                    nextSlot >=
                    selectorSlots.length
                ) {

                    /*
                    * =====================================================
                    * ПОСЛЕ АКТИВАЦИИ ВСЕХ ЧЕТЫРЁХ МИРОВЫХ НИТЕЙ
                    * НАТЯГИВАЮТСЯ ДВЕ НИТИ, ДЕРЖАЩИЕ КОСТЬ
                    * =====================================================
                    */

                    const dieThreads = [
                        goldenThreads.dieLeft,
                        goldenThreads.dieRight
                    ];

                    dieThreads.forEach(
                        function (thread) {

                            if (!thread) {
                                return;
                            }

                            thread.classList.remove(
                                "is-taut"
                            );

                            thread.classList.remove(
                                "is-tightening"
                            );

                            if (
                                thread ===
                                goldenThreads.dieLeft
                            ) {

                                playThreadEnergyPulse(
                                    "dieLeft"
                                );

                            }

                            if (
                                thread ===
                                goldenThreads.dieRight
                            ) {

                                playThreadEnergyPulse(
                                    "dieRight"
                                );

                            }

                            void thread.offsetWidth;

                            thread.classList.add(
                                "is-tightening"
                            );

                        }
                    );


                    context.timeout(
                        function () {

                            if (destroyed) {
                                return;
                            }

                            dieThreads.forEach(
                                function (thread) {

                                    if (!thread) {
                                        return;
                                    }

                                    thread.classList.remove(
                                        "is-tightening"
                                    );

                                    thread.classList.add(
                                        "is-taut"
                                    );

                                }
                            );

                        },
                        1300
                    );

                    selectorFinished = true;

                    activeThreadIndex = -1;

                    updateActiveSelectorSlot();


                    console.log(
                        "ВСЕ ЧЕТЫРЕ НИТИ АКТИВИРОВАНЫ"
                    );

                    /*
                    * Здесь позже поставим:
                    * Стич → Кость → разрыв нитей.
                    */

                    context.timeout(
                        async function () {

                            if (destroyed) {
                                return;
                            }

                            await wait(
                                context,
                                2000
                            );

                            if (destroyed) {
                                return;
                            }

                            await playVoiceAndWait(
                                context,
                                "assets/audio/finale_threads_tuko7.mp3"
                            );

                            if (destroyed) {
                                return;
                            }


                            await wait(
                                context,
                                220
                            );


                            /*
                            * ВЕДУЩИЙ:
                            * «НЕТ!... Остановитесь!»
                            */

                            await playVoiceAndWait(
                                context,
                                "assets/audio/host_finale_threads6.mp3"
                            );

                            if (destroyed) {
                                return;
                            }


                            /*
                            * Пауза.
                            * Все четыре нити уже натянуты.
                            */

                            await wait(
                                context,
                                1000
                            );


                            /*
                            * ВЕДУЩИЙ:
                            * «Что вы сделали?..»
                            */

                            await playVoiceAndWait(
                                context,
                                "assets/audio/host_finale_threads7.mp3"
                            );

                            if (destroyed) {
                                return;
                            }

                            /*
                            * =================================================
                            * СТИЧ → ТАКУ → ТОЛЧОК → РАЗРЫВ
                            * =================================================
                            */

                            await wait(
                                context,
                                250
                            );

                            if (destroyed) {
                                return;
                            }


                            /*
                            * -------------------------------------------------
                            * СТИЧ ПОЯВЛЯЕТСЯ
                            * -------------------------------------------------
                            */

                            stitch.classList.add(
                                "is-visible"
                            );


                            /*
                            * Ждём именно окончания звука появления Стича.
                            */

                            await playSfxAndWait(
                                context,
                                THREAD_SFX.stitchAppear,
                                0.9,
                                3000
                            );

                            if (destroyed) {
                                return;
                            }


                            /*
                            * -------------------------------------------------
                            * ТАКУ:
                            * «СТИЧ, ТОЛКАЙ»
                            * -------------------------------------------------
                            */

                            await playVoiceAndWait(
                                context,
                                "assets/audio/finale_threads_taku10.mp3"
                            );

                            if (destroyed) {
                                return;
                            }


                            await wait(
                                context,
                                180
                            );


                            /*
                            * -------------------------------------------------
                            * СТИЧ И КОСТЬ ДВИГАЮТСЯ ВЛЕВО
                            * -------------------------------------------------
                            */

                            stitch.classList.add(
                                "is-pushing"
                            );

                            die.classList.add(
                                "is-pushing"
                            );


                            /*
                            * -------------------------------------------------
                            * ТРЕСК НИТИ В МОМЕНТ ТОЛЧКА СТИЧА
                            * -------------------------------------------------
                            */

                            playThreadsSfx(
                                THREAD_SFX.stitchRip,
                                1.0
                            );


                            await wait(
                                context,
                                1350
                            );

                            if (destroyed) {
                                return;
                            }


                            /*
                            * -------------------------------------------------
                            * РАЗРЫВ ВЕДУЩЕГО И НИТЕЙ
                            * -------------------------------------------------
                            */

                            const hostShards =
                                createHostShards();

                            host.classList.add(
                                "is-shattering-source"
                            );

                            goldenThreadList.forEach(
                                function (thread) {

                                    if (!thread) {
                                        return;
                                    }

                                    thread.classList.remove(
                                        "is-taut"
                                    );

                                    thread.classList.remove(
                                        "is-tense"
                                    );

                                    thread.classList.remove(
                                        "is-tightening"
                                    );

                                    thread.classList.add(
                                        "is-shattering"
                                    );

                                }
                            );

                            /* -------------------------------------------------
                            * ОГРОМНЫЙ ВЗРЫВ ВЕДУЩЕГО
                            * -------------------------------------------------
                            */

                            const hostBoom =
                                playThreadsSfx(
                                    THREAD_SFX.hostBoom,
                                    1.0
                                );

                            hostBoom.addEventListener(
                                "error",
                                function () {

                                    console.error(
                                        "Не удалось загрузить звук взрыва Ведущего:",
                                        THREAD_SFX.hostBoom
                                    );

                                }
                            );

                            /*
                            * =====================================================
                            * 0.0 СЕК — ВЗРЫВ ВЕДУЩЕГО
                            *
                            * host_boom.mp3 = примерно 15 секунд.
                            * Но визуально сам Ведущий живёт
                            * только первые 4 секунды.
                            * =====================================================
                            */

                            createFinaleExplosion();


                            /*
                            * -----------------------------------------------------
                            * 0 — 4 СЕК
                            * ВЕДУЩИЙ РАЗРЫВАЕТСЯ
                            * -----------------------------------------------------
                            */

                            await wait(
                                context,
                                4000
                            );

                            if (destroyed) {
                                return;
                            }

                            scene.screen.classList.add(
                                "is-final-collapse"
                            );

                            await wait(
                                context,
                                1000
                            );

                            if (destroyed) {
                                return;
                            }

                            finalBlackout.classList.add(
                                "is-active"
                            );

                            /*
                            * =====================================================
                            * ОСКОЛКИ РАЗРУШАЮЩИХСЯ МИРОВ
                            *
                            * Короткие кинематографические вспышки
                            * поверх полного чёрного экрана.
                            * =====================================================
                            */

                            const collapseFlashLayer =
                                document.createElement("div");

                            collapseFlashLayer.className =
                                "finale-threads-collapse-flashes";

                            collapseFlashLayer.setAttribute(
                                "aria-hidden",
                                "true"
                            );


                            const collapseFlashSources = [
                                ASSETS.collapseTavern,
                                ASSETS.collapseSpaceport,
                                ASSETS.collapseArena,
                                ASSETS.collapseCasino,
                                ASSETS.collapseAllWorlds
                            ];


                            const collapseFlashImages =
                                collapseFlashSources.map(
                                    function (src) {

                                        const image =
                                            document.createElement("img");

                                        image.className =
                                            "finale-threads-collapse-flash";

                                        image.src =
                                            src;

                                        image.alt = "";

                                        image.draggable = false;

                                        image.setAttribute(
                                            "aria-hidden",
                                            "true"
                                        );

                                        collapseFlashLayer.appendChild(
                                            image
                                        );

                                        return image;

                                    }
                                );


                            scene.stage.appendChild(
                                collapseFlashLayer
                            );

                            /*
                            * =====================================================
                            * ПОКАЗ ОСКОЛКОВ МИРОВ
                            *
                            * Общая длительность:
                            * 3860 ms.
                            *
                            * После этого остаётся ещё примерно 590 ms
                            * полной темноты до перехода в космос.
                            * =====================================================
                            */

                            async function playCollapseFlashSequence() {

                                const visibleDurations = [
                                    1500,
                                    1500,
                                    1500,
                                    1500,
                                    1500
                                ];

                                const blackGap =
                                    500;


                                for (
                                    let i = 0;
                                    i < collapseFlashImages.length;
                                    i += 1
                                ) {

                                    if (destroyed) {
                                        return;
                                    }


                                    const image =
                                        collapseFlashImages[i];


                                    image.classList.remove(
                                        "is-active"
                                    );


                                    void image.offsetWidth;


                                    image.classList.add(
                                        "is-active"
                                    );


                                    await wait(
                                        context,
                                        visibleDurations[i]
                                    );


                                    image.classList.remove(
                                        "is-active"
                                    );


                                    /*
                                    * Между кадрами снова
                                    * виден абсолютный чёрный экран.
                                    */

                                    if (
                                        i <
                                        collapseFlashImages.length - 1
                                    ) {

                                        await wait(
                                            context,
                                            blackGap
                                        );

                                    }

                                }

                            }


                            /*
                            * Фоновая музыка больше не нужна.
                            * Оставляем только последние раскаты
                            * host_boom.mp3 в темноте.
                            */

                            if (backgroundMusic) {

                                backgroundMusic.pause();

                                backgroundMusic.currentTime = 0;

                                backgroundMusic = null;

                            }


                            /*
                            * -----------------------------------------------------
                            * 10.8 — 15.25 СЕК
                            *
                            * ЧЁРНЫЙ ЭКРАН
                            * +
                            * КОРОТКИЕ ВСПЫШКИ РАЗРУШАЮЩИХСЯ МИРОВ
                            *
                            * Сам звук host_boom.mp3 продолжает идти.
                            * Последние раскаты остаются уже в темноте.
                            * -----------------------------------------------------
                            */

                            await playCollapseFlashSequence();

                            if (destroyed) {
                                return;
                            }

                            /*
                            * =====================================================
                            * 14.5 — 15.0 СЕК
                            *
                            * ПОСЛЕДНИЕ РАСКАТЫ УЖЕ В ПОЛНОЙ ТЕМНОТЕ
                            * =====================================================
                            */

                            await wait(
                                context,
                                500
                            );

                            if (destroyed) {
                                return;
                            }

                            /*
                            * =====================================================
                            * ПЕРЕХОД В КОСМОС
                            * =====================================================
                            */

                            context.goTo(
                                "final_star_space",
                                {
                                    checkpointId:
                                        "final_star_space",

                                    save: true
                                }
                            );

                            return;

                        },
                        250
                    );

                    return;
                }


                /*
                * Пока ждём следующий выбор ТаКу.
                */

                activeThreadIndex = -1;

                updateActiveSelectorSlot();

                context.timeout(
                    function () {

                        if (destroyed) {
                            return;
                        }

                        continueAfterThread(
                            world,
                            nextSlot
                        );

                    },
                    250
                );
                
            }

            function setSelectorSlotImage(
                slotIndex,
                worldIndex
            ) {

                const slot =
                    selectorSlots[slotIndex];

                if (!slot) {
                    return;
                }

                const option =
                    WORLD_OPTIONS[worldIndex];

                if (!option) {
                    return;
                }

                /*
                * Новый кадр получает собственный токен.
                * Если игрок нажал во время ожидания кадра,
                * старый отложенный кадр будет отменён.
                */

                slot.visualToken =
                    (slot.visualToken || 0) + 1;

                const visualToken =
                    slot.visualToken;

                requestAnimationFrame(
                    function () {

                        if (
                            destroyed ||
                            selectorFinished ||
                            visualToken !==
                                slot.visualToken
                        ) {
                            return;
                        }

                        const cachedImage =
                            selectorImageCache[
                                option.id
                            ];

                        /*
                        * Сначала меняем саму видимую картинку.
                        */

                        slot.image.src =
                            cachedImage
                                ? cachedImage.src
                                : option.image;

                        /*
                        * И только в этом же кадре
                        * меняем логическое состояние.
                        */

                        slot.worldIndex =
                            worldIndex;

                        slot.worldId =
                            option.id;

                    }
                );
            }

            /*
            * =====================================================
            * ПОДСВЕТИТЬ АКТИВНЫЙ СЛОТ
            * =====================================================
            */

            function updateActiveSelectorSlot() {

                selectorSlots.forEach(
                    function (slot, index) {

                        slot.element.classList.toggle(
                            "is-active",
                            index === activeSlotIndex
                        );

                        slot.element.classList.toggle(
                            "is-locked",
                            selectorLocked[index]
                        );

                    }
                );

            }


            /*
            * =====================================================
            * ЗАПУСТИТЬ ПРОКРУТКУ СЛОТА
            * =====================================================
            */

            function startSelectorSpin(slotIndex) {

                if (
                    destroyed ||
                    selectorFinished
                ) {
                    return;
                }

                const slot =
                    selectorSlots[slotIndex];

                if (
                    !slot ||
                    selectorLocked[slotIndex]
                ) {
                    return;
                }


                stopSelectorSpin();


                selectorBusy = true;

                activeSlotIndex =
                    slotIndex;

                updateActiveSelectorSlot();


                slot.element.classList.add(
                    "is-spinning"
                );


                let nextIndex =
                    slot.worldIndex;


                /*
                * Пустой слот впервые получает
                * первую картинку только сейчас.
                */

                if (
                    nextIndex < 0
                ) {

                    nextIndex = 0;

                    setSelectorSlotImage(
                        slotIndex,
                        nextIndex
                    );

                }


                selectorTimer =
                    window.setInterval(
                        function () {

                            if (
                                destroyed ||
                                selectorFinished
                            ) {
                                return;
                            }

                            nextIndex =
                                (
                                    nextIndex + 1
                                ) %
                                WORLD_OPTIONS.length;

                            setSelectorSlotImage(
                                slotIndex,
                                nextIndex
                            );

                        },
                        1200
                    );
            }


            /*
            * =====================================================
            * ОСТАНОВИТЬ ТЕКУЩИЙ СЛОТ
            * =====================================================
            */

            function stopSelectorSpin() {

                if (
                    selectorTimer !== null
                ) {

                    window.clearInterval(
                        selectorTimer
                    );

                    selectorTimer =
                        null;
                }

                selectorBusy = false;


                selectorSlots.forEach(
                    function (slot) {

                        slot.element.classList.remove(
                            "is-spinning"
                        );

                        /*
                        * Отменяем кадр, который ещё не успел
                        * визуально примениться.
                        */
                        slot.visualToken =
                            (slot.visualToken || 0) + 1;

                    }
                );
            }

            function activateWorldThread(
                worldId
            ) {

                if (
                    destroyed ||
                    selectorFinished
                ) {
                    return;
                }


                const worldIndex =
                    REQUIRED_WORLD_ORDER.indexOf(
                        worldId
                    );

                if (
                    worldIndex < 0
                ) {
                    return;
                }


                const target =
                    TUKO_TARGETS[worldId];

                const start =
                    TUKO_START_POSITIONS[worldId];

                if (
                    !target ||
                    !start
                ) {
                    return;
                }


                /*
                * =====================================================
                * ТА-КУ ВЫБРАЛА МИР
                * =====================================================
                */

                activeThreadIndex =
                    worldIndex;


                /*
                * Пока ТуКо автоматически
                * перемещается к нужному миру,
                * WASD отключён.
                */

                tukoCanMove = false;


                /*
                * Убираем старые точки.
                */

                Object.keys(
                    tukoTargetMarkers
                ).forEach(
                    function (id) {

                        tukoTargetMarkers[id]
                            .classList.remove(
                                "is-active"
                            );

                        tukoTargetMarkers[id]
                            .classList.remove(
                                "is-reached"
                            );

                    }
                );


                /*
                * =====================================================
                * АВТОМАТИЧЕСКОЕ ПЕРЕМЕЩЕНИЕ ТУКО
                * =====================================================
                */

                tuko.classList.add(
                    "is-travelling"
                );


                tukoState.x =
                    start.x;

                tukoState.y =
                    start.y;

                renderTuko();


                /*
                * =====================================================
                * ПОСЛЕ ПЕРЕМЕЩЕНИЯ
                * ПЕРЕДАЁМ УПРАВЛЕНИЕ ТУКО
                * =====================================================
                */

                context.timeout(
                    function () {

                        if (destroyed) {
                            return;
                        }


                        tuko.classList.remove(
                            "is-travelling"
                        );


                        /*
                        * Показываем точку,
                        * куда нужно прийти WASD.
                        */

                        const marker =
                            tukoTargetMarkers[
                                worldId
                            ];

                        if (marker) {

                            marker.classList.add(
                                "is-active"
                            );

                        }


                        /*
                        * Теперь ТуКо управляет сама.
                        */

                        tukoCanMove = true;
                        showTukoThreadHint();


                        console.log(
                            "ТА-КУ ВЫБРАЛА:",
                            worldId
                        );

                        console.log(
                            "ТУКО ПЕРЕМЕЩЕНА В:",
                            start.x,
                            start.y
                        );

                        console.log(
                            "ТУКО ДОЛЖНА ДОЙТИ ДО:",
                            target.x,
                            target.y
                        );

                    },
                    1000
                );


                updateActiveSelectorSlot();
            }

            async function chooseSelectorSlot(
                slotIndex
            ) {

                if (
                    destroyed ||
                    selectorFinished ||
                    selectorBusy === false ||
                    slotIndex !== activeSlotIndex
                ) {
                    return;
                }

                const slot =
                    selectorSlots[slotIndex];

                if (!slot) {
                    return;
                }


                /*
                * Игрок нажал на активный слот.
                * Останавливаем вращение.
                */

                stopSelectorSpin();
                hideTakuMechanicHint();

                const selectedWorld =
                    slot.worldId;

                const correctWorld =
                    REQUIRED_WORLD_ORDER[
                        slotIndex
                    ];


                /*
                * =====================================================
                * ПРАВИЛЬНЫЙ МИР
                * =====================================================
                */

                if (
                    selectedWorld === correctWorld
                ) {

                    playThreadsSfx(
                        THREAD_SFX.selectorCorrect,
                        0.9
                    );

                    selectorLocked[
                        slotIndex
                    ] = true;


                    slot.element.classList.remove(
                        "is-active"
                    );

                    slot.element.classList.add(
                        "is-locked"
                    );

                    slot.element.classList.add(
                        "is-correct"
                    );
                    
                    
                    if (
                        slotIndex === 2
                    ) {

                        await wait(
                            context,
                            150
                        );

                        await playVoiceAndWait(
                            context,
                            "assets/audio/finale_threads_taku7.mp3"
                        );

                        if (destroyed) {
                            return;
                        }

                    }

                    if (
                        slotIndex === 1
                    ) {

                        await wait(
                            context,
                            150
                        );

                        await playVoiceAndWait(
                            context,
                            "assets/audio/finale_threads_taku6.mp3"
                        );

                        await wait(
                            context,
                            180
                        );

                        await playVoiceAndWait(
                            context,
                            "assets/audio/finale_threads_tuko4.mp3"
                        );

                        await wait(
                            context,
                            180
                        );

                        await playVoiceAndWait(
                            context,
                            "assets/audio/host_finale_threads4.mp3"
                        );

                        if (destroyed) {
                            return;
                        }

                    }

                    activateWorldThread(
                        selectedWorld
                    );

                    return;
                }


                /*
                * =====================================================
                * НЕПРАВИЛЬНЫЙ МИР
                * =====================================================
                */

                slot.element.classList.add(
                    "is-wrong"
                );

                playThreadsSfx(
                    THREAD_SFX.selectorWrong,
                    0.75
                );

                context.timeout(
                    function () {

                        if (destroyed) {
                            return;
                        }


                        slot.element.classList.remove(
                            "is-wrong"
                        );


                        /*
                        * Продолжаем вращение
                        * именно этого слота.
                        */

                        startSelectorSpin(
                            slotIndex
                        );

                    },
                    450
                );
            }

            function handleTukoMovement(
                event
            ) {

                if (
                    destroyed ||
                    selectorFinished ||
                    !tukoCanMove
                ) {
                    return;
                }


                let dx = 0;
                let dy = 0;


                switch (event.code) {

                    case "KeyW":

                        dy = -TUKO_STEP;

                        break;


                    case "KeyA":

                        dx = -TUKO_STEP;

                        break;


                    case "KeyS":

                        dy = TUKO_STEP;

                        break;


                    case "KeyD":

                        dx = TUKO_STEP;

                        break;


                    default:

                        return;
                }


                event.preventDefault();

                if (
                    tukoThreadHintVisible
                ) {

                    hideTukoThreadHint();

                }


                const nextX =
                    tukoState.x + dx;

                const nextY =
                    tukoState.y + dy;


                /*
                * Пока ограничиваем только
                * краями экрана.
                *
                * Не добавляем новые зоны.
                */

                if (
                    nextX < 2 ||
                    nextX > 98 ||
                    nextY < 5 ||
                    nextY > 93
                ) {
                    return;
                }


                tukoState.x =
                    nextX;

                tukoState.y =
                    nextY;


                renderTuko();


                /*
                * Проверяем:
                * дошла ли ТуКо до текущей нити.
                */

                activateCurrentThread();
            }


            context.on(
                document,
                "keydown",
                handleTukoMovement
            );

            selectorSlots.forEach(
                function (slot, index) {

                    context.on(
                        slot.element,
                        "click",
                        function () {

                            chooseSelectorSlot(
                                index
                            );

                        }
                    );

                }
            );

            function startSelectorMechanic() {

                if (
                    destroyed ||
                    selectorFinished
                ) {
                    return;
                }


                activeSlotIndex = 0;

                updateActiveSelectorSlot();

                showTakuMechanicHint();

                startSelectorSpin(0);
            }

            scene.stage.append(
                background,
                ...goldenThreadList,
                ...threadPulseList,
                die,
                stitch,
                tuko,
                taku,
                host,
                selectorWrap,
                takuMechanicHint,
                tukoThreadHint
            );

            Object.keys(tukoTargetMarkers).forEach(
                function (worldId) {

                    scene.stage.append(
                        tukoTargetMarkers[worldId]
                    );

                }
            );

            root.appendChild(
                scene.screen
            );

            /*
            * =====================================================
            * ФИНАЛЬНОЕ ЗАТЕМНЕНИЕ
            *
            * С 10.8 секунды экран постепенно уходит
            * в абсолютную темноту.
            * =====================================================
            */

            const finalBlackout =
                document.createElement("div");

            finalBlackout.className =
                "finale-threads-final-blackout";

            finalBlackout.setAttribute(
                "aria-hidden",
                "true"
            );

            scene.stage.appendChild(
                finalBlackout
            );

            let destroyed = false;
            let shakeSound = null;
            let backgroundMusic = null;

        function startScene() {

            backgroundMusic =
                new Audio(
                    "assets/audio/teknoaxe-brittle-picks.mp3"
                );

            backgroundMusic.preload = "auto";
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.2;

            backgroundMusic.onerror = function () {

                console.error(
                    "Не удалось загрузить фоновую музыку:",
                    "assets/audio/teknoaxe-brittle-picks.mp3"
                );

            };

            backgroundMusic.load();

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }

                    shakeSound =
                        new Audio(
                            "assets/audio/finale_threads_shake.mp3"
                        );

                    shakeSound.loop = true;

                    shakeSound.volume = 0.55;

                    shakeSound.play().catch(
                        function () {}
                    );

                },
                250
            );


            /*
            * -----------------------------------------------------
            * 1250 ms
            * ЧЕРЕЗ 1 СЕКУНДУ НАЧИНАЕТСЯ ВИЗУАЛЬНАЯ ТРЯСКА
            * -----------------------------------------------------
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }

                    scene.screen.classList.add(
                        "is-trembling"
                    );

                },
                1250
            );


            /*
            * -----------------------------------------------------
            * 1600 ms
            * ТУКО
            * -----------------------------------------------------
            */

            context.timeout(
                async function () {

                    if (destroyed) {
                        return;
                    }

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_tuko1.mp3"
                    );

                },
                1600
            );


            /*
            * -----------------------------------------------------
            * 4400 ms
            * ТАКУ СРЫВАЕТ С КОСМОПОРТА
            *
            * ТуКо уже закончила свою реплику.
            * -----------------------------------------------------
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }

                    taku.classList.add(
                        "is-thrown"
                    );

                },
                4400
            );


            /*
            * -----------------------------------------------------
            * 4550 ms
            * ТАКУ ГОВОРИТ ВО ВРЕМЯ ПОЛЁТА
            * -----------------------------------------------------
            */

            context.timeout(
                async function () {

                    if (destroyed) {
                        return;
                    }

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_taku1.mp3"
                    );

                },
                4550
            );


            /*
            * -----------------------------------------------------
            * 5700 ms
            * УСТРОЙСТВО ПРИЗЕМЛЯЕТСЯ
            *
            * ТаКу уже долетела вниз.
            * -----------------------------------------------------
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }

                    selectorWrap.classList.remove(
                        "is-hidden"
                    );

                    selectorWrap.classList.add(
                        "is-landed"
                    );

                },
                5700
            );


            /*
            * -----------------------------------------------------
            * 6100 ms
            * ВЕДУЩИЙ ПОЯВЛЯЕТСЯ
            *
            * К этому моменту устройство уже видно.
            * -----------------------------------------------------
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }

                    host.classList.add(
                        "is-visible"
                    );

                },
                6100
            );

            /*
            * -----------------------------------------------------
            * 6500 ms
            * НИТИ + КОСТЬ ПЕРЕХОДА
            * -----------------------------------------------------
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }

                    goldenThreadList.forEach(
                        function (thread) {

                            thread.classList.add(
                                "is-visible"
                            );

                        }
                    );

                    die.classList.add(
                        "is-visible"
                    );

                },
                8500
            );


            /*
            * -----------------------------------------------------
            * 6500 ms
            * ОСТАНАВЛИВАЕМ ЗЕМЛЕТРЯСЕНИЕ
            * -----------------------------------------------------
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }

                    if (shakeSound) {
                        shakeSound.pause();
                        shakeSound.currentTime = 0;
                        shakeSound = null;
                    }

                    scene.screen.classList.remove(
                        "is-trembling"
                    );

                    if (backgroundMusic) {

                        const playResult =
                            backgroundMusic.play();

                        if (
                            playResult &&
                            typeof playResult.catch ===
                                "function"
                        ) {

                            playResult.catch(
                                function (error) {

                                    console.error(
                                        "Не удалось запустить фоновую музыку:",
                                        error
                                    );

                                }
                            );

                        }
                    }

                },
                6500
            );


            /*
            * -----------------------------------------------------
            * 7000 ms
            * ВЕДУЩИЙ:
            * «НЕ СМЕЙТЕ ТРОГАТЬ УСТРОЙСТВО»
            * -----------------------------------------------------
            */

            context.timeout(
                async function () {

                    if (destroyed) {
                        return;
                    }

                    await playVoiceAndWait(
                        context,
                        "assets/audio/host_finale_threads1.mp3"
                    );


                    if (destroyed) {
                        return;
                    }


                    /*
                    * -------------------------------------------------
                    * ТАКУ:
                    * «ПОЗДНО»
                    * -------------------------------------------------
                    */

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_taku4.mp3"
                    );


                    if (destroyed) {
                        return;
                    }


                    /*
                    * -------------------------------------------------
                    * СРАЗУ:
                    * ТАКУ — «ВОТ ОНО»
                    * -------------------------------------------------
                    */

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_taku2.mp3"
                    );


                    if (destroyed) {
                        return;
                    }


                    /*
                    * -------------------------------------------------
                    * ТУКО — «ЧТО?»
                    * -------------------------------------------------
                    */

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_tuko2.mp3"
                    );


                    if (destroyed) {
                        return;
                    }


                    /*
                    * -------------------------------------------------
                    * ТАКУ — «ТО, ЧТО ОН ВСЁ ВРЕМЯ
                    * НАЗЫВАЛ СЛУЧАЙНОСТЬЮ»
                    * -------------------------------------------------
                    */

                    await playVoiceAndWait(
                        context,
                        "assets/audio/finale_threads_taku3.mp3"
                    );


                    if (destroyed) {
                        return;
                    }


                    /*
                    * -------------------------------------------------
                    * ТОЛЬКО ПОСЛЕ ЭТОГО:
                    * ИГРОК МОЖЕТ НАЖИМАТЬ НА УСТРОЙСТВО
                    * -------------------------------------------------
                    */

                    startSelectorMechanic();

                },
                7000
            );

        }

            startScene();

            console.log(
                "finale_threads started"
            );

            return {

                destroy: function () {

                    destroyed = true;


                    if (shakeSound) {
                        shakeSound.pause();
                        shakeSound.currentTime = 0;
                        shakeSound = null;
                    }

                    if (backgroundMusic) {
                    backgroundMusic.pause();
                    backgroundMusic.currentTime = 0;
                    backgroundMusic = null;
                }
                }

            };

        },

        unmount: function () {}

    };

    game.scenes.final_star_space = {

        id: "final_star_space",

        mount: function (root, context) {

            const scene = createStage(
                "final-star-space-screen",
                "final-star-space-stage"
            );


            /*
            * =====================================================
            * ФОН
            * =====================================================
            */

            const background =
                createImage(
                    ASSETS.finalStarSpace,
                    "final-star-space-background"
                );


            /*
            * =====================================================
            * МАГИЧЕСКИЕ ФОРМЫ
            * =====================================================
            */

            const tukoMagic =
                createImage(
                    game.config.players.tuko.image,
                    "final-star-space-magic final-star-space-tuko-magic"
                );


            const takuMagic =
                createImage(
                    game.config.players.taku.image,
                    "final-star-space-magic final-star-space-taku-magic"
                );


            /*
            * =====================================================
            * ЧЕЛОВЕЧЕСКИЕ ФОРМЫ
            *
            * Пока скрыты.
            * Появятся ПОСЛЕ окончания видео.
            * =====================================================
            */

            const tukoHuman =
                createImage(
                    "assets/images/tuko_human_final.png",
                    "final-star-space-human final-star-space-tuko-human"
                );


            const takuHuman =
                createImage(
                    "assets/images/taku_human_final.png",
                    "final-star-space-human final-star-space-taku-human"
                );


            /*
            * =====================================================
            * ВИДЕО ПРЕВРАЩЕНИЯ
            * =====================================================
            */

            const transformationVideo =
                document.createElement("video");


            transformationVideo.className =
                "final-star-space-transform-video";


            transformationVideo.src =
                ASSETS.finalStarSpaceTransform;


            transformationVideo.autoplay =
                false;

            transformationVideo.muted =
                true;

            transformationVideo.loop =
                false;

            transformationVideo.playsInline =
                true;

            transformationVideo.preload =
                "auto";

            transformationVideo.controls =
                false;

            transformationVideo.disablePictureInPicture =
                true;


            transformationVideo.setAttribute(
                "playsinline",
                ""
            );

            transformationVideo.setAttribute(
                "webkit-playsinline",
                ""
            );

            transformationVideo.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
            * Первый кадр видео —
            * космос с магическими формами.
            */

            transformationVideo.poster =
                ASSETS.finalStarSpace;


            /*
            * Заставляем браузер
            * начать загрузку видео заранее.
            */

            transformationVideo.load();


            /*
            * =====================================================
            * СОБИРАЕМ СЦЕНУ
            * =====================================================
            */

            scene.stage.append(
                background,
                tukoMagic,
                takuMagic,
                tukoHuman,
                takuHuman,
                transformationVideo
            );


            root.appendChild(
                scene.screen
            );


            /*
            * =====================================================
            * СОХРАНЯЕМ ССЫЛКИ
            * =====================================================
            */

            scene.transformationVideo =
                transformationVideo;


            let backgroundMusic = null;

            let destroyed = false;


            /*
            * =====================================================
            * 2.0 СЕК
            *
            * МУЗЫКА
            *
            * До этого момента:
            * абсолютная темнота + тишина.
            * =====================================================
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }


                    backgroundMusic =
                        new Audio(
                            ASSETS.finalStarSpaceMusic
                        );


                    scene.backgroundMusic =
                        backgroundMusic;


                    backgroundMusic.preload =
                        "auto";

                    backgroundMusic.loop =
                        true;

                    backgroundMusic.volume =
                        0.38;


                    backgroundMusic.onerror =
                        function () {

                            console.error(
                                "Не удалось загрузить музыку FINAL STAR SPACE:",
                                ASSETS.finalStarSpaceMusic
                            );

                        };


                    backgroundMusic
                        .play()
                        .catch(
                            function () {}
                        );

                },
                2000
            );


            /*
            * =====================================================
            * 2.0 СЕК
            *
            * НАЧИНАЕТ ПОЯВЛЯТЬСЯ КОСМОС
            *
            * CSS делает плавную прорисовку
            * примерно за 2 секунды.
            * =====================================================
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }


                    scene.screen.classList.add(
                        "is-ready"
                    );

                },
                2000
            );


            /*
            * =====================================================
            * 5.0 СЕК
            *
            * ФОН УЖЕ ПОЛНОСТЬЮ ВИДЕН.
            *
            * Ждали ещё 1 секунду.
            *
            * Теперь ТуКо и ТаКу начинают
            * очень медленно спускаться сверху.
            * =====================================================
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }


                    tukoMagic.classList.add(
                        "is-rising"
                    );


                    takuMagic.classList.add(
                        "is-rising"
                    );

                },
                5000
            );


            /*
            * =====================================================
            * 13.4 СЕК
            *
            * СПУСК ЗАКОНЧИЛСЯ.
            *
            * Теперь 2 секунды спокойного floating.
            * =====================================================
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }


                    tukoMagic.classList.add(
                        "is-floating"
                    );


                    takuMagic.classList.add(
                        "is-floating"
                    );

                },
                13400
            );


            /*
            * =====================================================
            * 15.4 СЕК
            *
            * НАЧИНАЕТСЯ ВИДЕО
            * ПРЕВРАЩЕНИЯ.
            *
            * =====================================================
            */

            context.timeout(
                function () {

                    if (destroyed) {
                        return;
                    }


                    try {

                        transformationVideo.currentTime =
                            0;

                    } catch (error) {}



                    /*
                    * Видео становится видимым.
                    */

                    scene.screen.classList.add(
                        "is-transform-video"
                    );


                    /*
                    * Запуск видео.
                    */

                    const playPromise =
                        transformationVideo.play();


                    if (
                        playPromise &&
                        typeof playPromise.catch ===
                            "function"
                    ) {

                        playPromise.catch(
                            function (error) {

                                console.error(
                                    "Не удалось запустить видео превращения:",
                                    error
                                );

                            }
                        );

                    }

                },
                15400
            );


            /*
            * =====================================================
            * ОШИБКА ЗАГРУЗКИ
            * =====================================================
            */

            transformationVideo.onerror =
                function () {

                    console.error(
                        "Не удалось загрузить видео превращения:",
                        ASSETS.finalStarSpaceTransform
                    );

                };


            /*
            * =====================================================
            * ВИДЕО ЗАКОНЧИЛОСЬ
            *
            * ВАЖНО:
            *
            * НЕ ПЕРЕХОДИМ СРАЗУ.
            *
            * Сначала:
            * - убираем видео
            * - показываем final_star_space
            * - показываем PNG людей
            *
            * Потом держим этот кадр 3 секунды.
            * =====================================================
            */

            context.on(
                transformationVideo,
                "ended",
                function () {

                    if (destroyed) {
                        return;
                    }


                    /*
                    * Видео больше не нужно.
                    */

                    transformationVideo.pause();

                    transformationVideo.remove();


                    /*
                    * Магические формы остаются скрытыми.
                    */

                    tukoMagic.classList.add(
                        "is-transformed"
                    );

                    takuMagic.classList.add(
                        "is-transformed"
                    );


                    /*
                    * Показываем именно те
                    * человеческие PNG,
                    * которые мы подготовили.
                    */

                    tukoHuman.classList.add(
                        "is-visible"
                    );

                    takuHuman.classList.add(
                        "is-visible"
                    );


                    /*
                    * =================================================
                    * 3 СЕКУНДЫ ДЕРЖИМ ГОТОВЫЙ КАДР
                    * =================================================
                    */

                    context.timeout(
                        function () {

                            if (destroyed) {
                                return;
                            }


                            /*
                            * Останавливаем музыку.
                            */

                            if (backgroundMusic) {

                                backgroundMusic.pause();

                                backgroundMusic.currentTime =
                                    0;

                                backgroundMusic =
                                    null;

                            }


                            /*
                            * ПЕРЕХОД К ПОЗДРАВЛЕНИЮ
                            */

                            context.goTo(
                                "epilogue_congratulation_final",
                                {
                                    checkpointId:
                                        "epilogue_congratulation_final",

                                    save: true
                                }
                            );

                        },
                        5000
                    );

                }
            );


            /*
            * =====================================================
            * CLEANUP
            * =====================================================
            */

            scene.destroy =
                function () {

                    destroyed = true;


                    if (transformationVideo) {

                        transformationVideo.pause();

                        transformationVideo.currentTime =
                            0;

                    }


                    if (backgroundMusic) {

                        backgroundMusic.pause();

                        backgroundMusic.currentTime =
                            0;

                        backgroundMusic =
                            null;

                    }

                };


            return {
                destroy:
                    scene.destroy
            };

        },


        unmount: function () {

            if (this.backgroundMusic) {

                this.backgroundMusic.pause();

                this.backgroundMusic.currentTime =
                    0;

                this.backgroundMusic =
                    null;

            }

        }

    };
    
    game.scenes.epilogue_congratulation_final = {

        id: "epilogue_congratulation_final",

        mount: function (root, context) {

                        // =====================================================
            // МУЗЫКА ПОЗДРАВЛЕНИЯ
            // Продолжает играть и на экране результатов
            // =====================================================

            if (epilogueCongratulationAudio) {
                epilogueCongratulationAudio.pause();
                epilogueCongratulationAudio.currentTime = 0;
                epilogueCongratulationAudio = null;
            }

            epilogueCongratulationAudio = new Audio(
                ASSETS.epilogueCongratulationMusic
            );

            epilogueCongratulationAudio.preload = "auto";
            epilogueCongratulationAudio.loop = true;
            epilogueCongratulationAudio.volume = 0.45;

            epilogueCongratulationAudio.play().catch(function (error) {
                console.warn(
                    "Музыка поздравления не запустилась:",
                    error
                );
            });

            const scene = createStage(
                "epilogue-congrats-v2-screen",
                "epilogue-congrats-v2-stage"
            );


            /*
            * =====================================================
            * ФОН — ОРИГИНАЛЬНОЕ ИЗОБРАЖЕНИЕ
            * =====================================================
            */

            const background = document.createElement("img");

            background.src =
                ASSETS.epilogueCongratulation;

            background.alt = "";

            background.className =
                "epilogue-congrats-v2-background";

            background.draggable = false;


            /*
            * =====================================================
            * ТУКО — ИМЕННО tuko_human_final.png
            * =====================================================
            */

            const tukoHuman = document.createElement("img");

            tukoHuman.src =
                "assets/images/tuko_human_final.png";

            tukoHuman.alt = "";

            tukoHuman.className =
                "epilogue-congrats-v2-human epilogue-congrats-v2-tuko";

            tukoHuman.draggable = false;

            tukoHuman.loading = "eager";

            tukoHuman.onerror = function () {
                console.error(
                    "Не загрузился tuko_human_final.png:",
                    tukoHuman.src
                );
            };


            /*
            * =====================================================
            * ТАКУ — ИМЕННО taku_human_final.png
            * =====================================================
            */

            const takuHuman = document.createElement("img");

            takuHuman.src =
                "assets/images/taku_human_final.png";

            takuHuman.alt = "";

            takuHuman.className =
                "epilogue-congrats-v2-human epilogue-congrats-v2-taku";

            takuHuman.draggable = false;

            takuHuman.loading = "eager";

            takuHuman.onerror = function () {
                console.error(
                    "Не загрузился taku_human_final.png:",
                    takuHuman.src
                );
            };


            /*
            * =====================================================
            * ТЕКСТ — БЕЗ ЦЕНТРАЛЬНОЙ ПЛАШКИ
            * =====================================================
            */

            const title = document.createElement("div");

            title.className =
                "epilogue-congrats-v2-title";

            title.textContent =
                "ПАРТИЯ ЗАВЕРШЕНА";


            const mainText = document.createElement("div");

            mainText.className =
                "epilogue-congrats-v2-main";

            mainText.textContent =
                "Вы обе победили.";


            const description = document.createElement("div");

            description.className =
                "epilogue-congrats-v2-description";

            description.textContent =
                "Игра больше не требует выбрать одну из вас.";


            const together = document.createElement("div");

            together.className =
                "epilogue-congrats-v2-together";

            together.textContent =
                "";


            /*
            * =====================================================
            * НАТИВНАЯ КНОПКА
            *
            * НЕ используем game.mechanics.createButton(),
            * чтобы не наследовать стандартный стиль gold-button.
            * =====================================================
            */

            const continueButton =
                document.createElement("button");

            continueButton.type = "button";

            continueButton.className =
                "epilogue-congrats-v2-button";

            continueButton.textContent =
                "ПОСМОТРЕТЬ РЕЗУЛЬТАТЫ";


            /*
            * =====================================================
            * СБОРКА ЭКРАНА
            * НИКАКОЙ КАРТОЧКИ ИЛИ PANEL НЕ СОЗДАЁМ.
            * =====================================================
            */

            scene.stage.append(
                background,
                tukoHuman,
                takuHuman,
                title,
                mainText,
                description,
                together,
                continueButton
            );

            root.appendChild(scene.screen);


            /*
            * =====================================================
            * ПОЯВЛЕНИЕ
            * =====================================================
            */

            context.timeout(function () {
                scene.screen.classList.add("is-ready");
            }, 60);

            context.timeout(function () {
                tukoHuman.classList.add("is-visible");
                takuHuman.classList.add("is-visible");
            }, 450);

            context.timeout(function () {
                title.classList.add("is-visible");
            }, 500);

            context.timeout(function () {
                mainText.classList.add("is-visible");
            }, 950);

            context.timeout(function () {
                description.classList.add("is-visible");
            }, 1450);

            context.timeout(function () {
                together.classList.add("is-visible");
            }, 1900);

            context.timeout(function () {
                continueButton.classList.add("is-visible");
            }, 2300);


            /*
            * =====================================================
            * ПЕРЕХОД К РЕЗУЛЬТАТАМ
            * =====================================================
            */

            context.on(
                continueButton,
                "click",
                function () {

                    context.goTo(
                        "epilogue_results_final",
                        {
                            checkpointId: "epilogue_results_final",
                            save: true
                        }
                    );

                }
            );

        },

        unmount: function () {}

    };

    
    game.scenes.epilogue_results_final = {

        id: "epilogue_results_final",

        mount: function (root, context) {

            const scene = createStage(
                "epilogue-results-v3-screen",
                "epilogue-results-v3-stage"
            );


            // ФОН: все четыре печати уже встроены в изображение

            const background = createImage(
                ASSETS.epilogueResults,
                "epilogue-results-v3-background"
            );


            // ТЕКСТ В НИЖНЕЙ ЗОЛОТОЙ ТАБЛИЧКЕ

            const title = document.createElement("div");

            title.className = "epilogue-results-v3-title";

            title.textContent =
                "Все четыре печати собраны.";


            const description = document.createElement("div");

            description.className = "epilogue-results-v3-description";

            description.textContent =
    "Главное правило оказалось самым простым:\nникто не должен проигрывать ради того, чтобы другой победил!";


            // ЧЁРНАЯ КНОПКА С ЗОЛОТОЙ ОКАЙМЛЁВКОЙ

            const finishButton = document.createElement("button");

            finishButton.type = "button";

            finishButton.className =
                "epilogue-results-v3-button";

            finishButton.textContent =
                "ЗАВЕРШИТЬ ПАРТИЮ";


            // СБОРКА: никаких дополнительных печатей или карточек

            scene.stage.append(
                background,
                title,
                description,
                finishButton
            );

            root.appendChild(scene.screen);


            // ПЛАВНОЕ ПОЯВЛЕНИЕ ФОНА

            context.timeout(function () {

                scene.screen.classList.add("is-ready");

            }, 60);


            // ПОЯВЛЕНИЕ ЗАГОЛОВКА

            context.timeout(function () {

                title.classList.add("is-visible");

            }, 700);


            // ПОЯВЛЕНИЕ ГЛАВНОГО ТЕКСТА

            context.timeout(function () {

                description.classList.add("is-visible");

            }, 1100);


            // КНОПКА ПОЯВЛЯЕТСЯ РОВНО ЧЕРЕЗ 5 СЕКУНД

            context.timeout(function () {

                finishButton.classList.add("is-visible");

            }, 5000);


            // ЗАВЕРШИТЬ ПАРТИЮ

            context.on(finishButton, "click", function () {

                context.goTo(
                    "epilogue_credits_final",
                    {
                        checkpointId: "epilogue_credits_final",
                        save: true
                    }
                );

            });

        },

        unmount: function () {}

    };


    let epilogueCreditsMusic = null;

    game.scenes.epilogue_credits_final = {

        id: "epilogue_credits_final",

        mount: function (root, context) {

            const scene = createStage(
                "epilogue-credits-final-screen",
                "epilogue-credits-final-stage"
            );

            let destroyed = false;
            let endShown = false;


            // =====================================================
            // ОРИГИНАЛЬНЫЙ ФОН — БЕЗ ФИЛЬТРОВ
            // =====================================================

            const background = createImage(
                ASSETS.epilogueMenu,
                "epilogue-credits-final-background"
            );


            // =====================================================
            // МУЗЫКА ФИНАЛЬНЫХ ТИТРОВ
            // =====================================================
            // Останавливаем музыку поздравления перед запуском музыки титров

            if (epilogueCongratulationAudio) {
                epilogueCongratulationAudio.pause();
                epilogueCongratulationAudio.currentTime = 0;
                epilogueCongratulationAudio = null;
            }

            if (epilogueCreditsMusic) {

                epilogueCreditsMusic.pause();
                epilogueCreditsMusic.currentTime = 0;

                epilogueCreditsMusic = null;

            }

            epilogueCreditsMusic =
                new Audio(ASSETS.epilogueCreditsMusic);

            const creditsMusic = epilogueCreditsMusic;

            creditsMusic.preload = "auto";
            creditsMusic.loop = true;
            creditsMusic.volume = 0.45;

            creditsMusic.addEventListener(
                "error",
                function () {

                    console.error(
                        "Не удалось загрузить музыку финальных титров:",
                        ASSETS.epilogueCreditsMusic
                    );

                },
                { once: true }
            );

            const musicPlayPromise = creditsMusic.play();

            if (
                musicPlayPromise &&
                typeof musicPlayPromise.catch === "function"
            ) {

                musicPlayPromise.catch(function (error) {

                    console.warn(
                        "Музыка финальных титров не запустилась:",
                        error
                    );

                });

            }


            // =====================================================
            // ПЕРВЫЙ ЭКРАН — ТОЛЬКО ТЕКСТ
            // =====================================================

            const intro = document.createElement("div");

            intro.className =
                "epilogue-credits-final-intro";


            const introTitle = document.createElement("div");

            introTitle.className =
                "epilogue-credits-final-intro-title";

            introTitle.textContent =
                "До следующей партии.";


            const introText = document.createElement("div");

            introText.className =
                "epilogue-credits-final-intro-text";

            introText.textContent =
                "Доска замолчала.\n" +
                "Но некоторые игры заканчиваются только затем,\n" +
                "чтобы однажды начаться снова.";


            intro.append(
                introTitle,
                introText
            );


            // =====================================================
            // КИНОТИТРЫ
            // =====================================================

            const creditsViewport = document.createElement("div");

            creditsViewport.className =
                "epilogue-credits-final-viewport";


            const creditsRoll = document.createElement("div");

            creditsRoll.className =
                "epilogue-credits-final-roll";


            function addCredit(heading, text) {

                const block = document.createElement("section");

                block.className =
                    "epilogue-credits-final-block";


                const headingElement =
                    document.createElement("div");

                headingElement.className =
                    "epilogue-credits-final-heading";

                headingElement.textContent = heading;


                const textElement =
                    document.createElement("div");

                textElement.className =
                    "epilogue-credits-final-text";

                textElement.textContent = text;


                block.append(
                    headingElement,
                    textElement
                );

                creditsRoll.appendChild(block);

            }


            // =====================================================
            // СОДЕРЖАНИЕ ТИТРОВ
            // =====================================================

            addCredit(
                "ТУКО И ТАКУ",
                "Настольная игра, которая сыграла в ответ."
            );


            addCredit(
                "В ЭТОЙ ИСТОРИИ",
                "Четыре мира.\n" +
                "Четыре печати.\n" +
                "Два игрока, которые решили остаться командой."
            );


            addCredit(
                "ГЛАВНЫЕ ГЕРОИ",
                "ТуКо — магический ботинок\n" +
                "ТаКу — живая таблица"
            );


            addCredit(
                "ЧЕТЫРЕ МИРА",
                "Таверна между мирами\n" +
                "Космопорт\n" +
                "Магическое казино\n" +
                "Арена"
            );


            addCredit(
                "ЧЕТЫРЕ ПЕЧАТИ",
                "Равновесие · Логика · Смелость · Хитрость"
            );


            addCredit(
                "ВЕДУЩИЙ",
                "Мастер золотых нитей\n" +
                "И тот, кто знал больше, чем говорил."
            );


            addCredit(
                "СТИЧАМБА",
                "Тот, кто снова и снова приходил на помощь\n" +
                "в самый нужный момент."
            );


            addCredit(
                "ИДЕЯ И СОЗДАНИЕ",
                "Птица"
            );


            addCredit(
                "ГЛАВНОЕ ПРАВИЛО",
                "Никто не должен проигрывать ради того,\n" +
                "чтобы другой победил."
            );


            addCredit(
                "СПАСИБО ЗА ЭТУ ПАРТИЮ",
                "Самая важная победа — та, которую разделяют."
            );


            addCredit(
                "С ДНЁМ РОЖДЕНИЯ, ДЕВОЧКИ!",
                "Эта игра - подарок специально для вас.\n" +
                "Пусть впереди будет ещё много приключений,\n" +
                "смеха и побед, которые вы разделите вместе."
            );


            addCredit(
                "С ЛЮБОВЬЮ, ДЛЯ ВАС",
                "Пусть ваша следующая глава будет ещё интереснее.\n" +
                "И пусть рядом всегда будут те,\n" +
                "с кем можно пройти любой мир."
            );


            creditsViewport.appendChild(creditsRoll);


            // =====================================================
            // ПОСЛЕДНИЙ ЭКРАН
            // =====================================================

            const endCard = document.createElement("div");

            endCard.className =
                "epilogue-credits-final-end";


            const endTitle = document.createElement("div");

            endTitle.className =
                "epilogue-credits-final-end-title";

            endTitle.textContent =
                "КОНЕЦ?";


            const endSubtitle = document.createElement("div");

            endSubtitle.className =
                "epilogue-credits-final-end-subtitle";

            endSubtitle.textContent =
                "…До следующей партии.";


            endCard.append(
                endTitle,
                endSubtitle
            );


            // =====================================================
            // СБОРКА СЦЕНЫ
            // =====================================================

            scene.stage.append(
                background,
                intro,
                creditsViewport,
                endCard
            );

            root.appendChild(scene.screen);


            // =====================================================
            // ПЛАВНОЕ ЗАТИХАНИЕ МУЗЫКИ
            // =====================================================

            function fadeOutMusic() {

                const track = epilogueCreditsMusic;

                if (!track) {
                    return;
                }

                const startingVolume = track.volume;
                const steps = 30;
                let step = 0;


                function fadeStep() {

                    if (
                        destroyed ||
                        epilogueCreditsMusic !== track
                    ) {
                        return;
                    }

                    step += 1;

                    track.volume = Math.max(
                        0,
                        startingVolume * (1 - step / steps)
                    );

                    if (step < steps) {

                        context.timeout(fadeStep, 100);

                    } else {

                        track.pause();
                        track.currentTime = 0;

                        if (epilogueCreditsMusic === track) {
                            epilogueCreditsMusic = null;
                        }

                    }

                }

                fadeStep();

            }


            // =====================================================
            // ПОЯВЛЕНИЕ ВСТУПИТЕЛЬНОЙ ФРАЗЫ
            // =====================================================

            context.timeout(function () {

                if (destroyed) {
                    return;
                }

                scene.screen.classList.add("is-ready");
                intro.classList.add("is-visible");

            }, 300);


            // Фраза остаётся на экране около 6 секунд.

            context.timeout(function () {

                if (destroyed) {
                    return;
                }

                intro.classList.add("is-fading");

            }, 6500);


            // =====================================================
            // ЗАПУСК ПРОКРУТКИ ТИТРОВ
            // =====================================================

            context.timeout(function () {

                if (destroyed) {
                    return;
                }

                scene.screen.classList.add(
                    "is-credits-running"
                );

            }, 7600);


            // =====================================================
            // ЗАВЕРШЕНИЕ ТИТРОВ
            // =====================================================

            function showEndCard() {

                if (destroyed || endShown) {
                    return;
                }

                endShown = true;

                scene.screen.classList.add("is-end");

                fadeOutMusic();

            }


            context.on(
                creditsRoll,
                "animationend",
                showEndCard
            );


            // Резервный таймер — после окончания прокрутки.

            context.timeout(
                showEndCard,
                60000
            );

        },


        unmount: function () {

            if (epilogueCreditsMusic) {

                epilogueCreditsMusic.pause();
                epilogueCreditsMusic.currentTime = 0;

                epilogueCreditsMusic = null;

            }

        }

    };


})(window);
