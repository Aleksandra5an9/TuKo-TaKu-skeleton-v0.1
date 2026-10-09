(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    game.scenes = game.scenes || {};

    let crazhaVideo = null;
    let crazhaVideoReady = null;

    function preloadCrazhaVideo() {
        if (crazhaVideoReady) return crazhaVideoReady;

        crazhaVideo = document.createElement("video");

        crazhaVideo.preload = "auto";
        crazhaVideo.playsInline = true;
        crazhaVideo.setAttribute("playsinline", "");
        crazhaVideo.setAttribute("webkit-playsinline", "");

        crazhaVideo.src = "assets/video/crazha.mp4?v=2";
        crazhaVideo.load();

        crazhaVideoReady = Promise.resolve(crazhaVideo);

        return crazhaVideoReady;
    }

    preloadCrazhaVideo();    

    const steps = {
        prologue_title: {
            eyebrow: "ПРОЛОГ · ДО НАЧАЛА ПАРТИИ",
            title: "Одна партия на двоих",
            text: "Настя и Рита собирались просто сыграть. На коробке не было ни названия, ни правил — только два свободных места за столом.",
            subtitle: "Два места заняты. Два игрока обнаружены. Можно начинать.",
            button: "ОТКРЫТЬ КОРОБКУ",
            next: "prologue_scan",
            visual: "both"
        },
        prologue_scan: {
            eyebrow: "ПРОВЕРКА ИГРОКОВ",
            title: "Имена повреждены",
            text: "Голос из темноты зачитывает результат: «Туфля Ко. Таблица Ку». Сокращённо — ТуКо и ТаКу.",
            subtitle: "Игроки определены. Туфля Ко. Таблица Ку. Возражения не предусмотрены правилами.",
            button: "ПРИНЯТЬ ОБЛИКИ",
            next: "prologue_storage",
            visual: "both"
        },
        prologue_storage: {
            eyebrow: "НЕУЧТЁННЫЙ УЧАСТНИК",
            title: "Стич узнаёт их первым",
            text: "Бостон-терьер не сомневается ни секунды. Если Стич знает, кто перед ним, значит прежняя жизнь всё ещё существует — и к ней можно вернуться.",
            subtitle: "Поправка. Владельцы определены. Обе. Похоже, собака знала это с самого начала.",
            button: "К ЦЕНТРАЛЬНОМУ СТОЛУ",
            next: "board_intro",
            visual: "stitch"
        }
    };

    function addStoryVisual(container, visual) {
        const sigil = document.createElement("div");
        sigil.className = "story-sigil";
        container.appendChild(sigil);

        if (visual === "both") {
            container.append(
                game.mechanics.createImage(
                    game.config.players.tuko.image,
                    "story-character left",
                    "ТуКо — волшебная туфля на высокой платформе"
                ),
                game.mechanics.createImage(
                    game.config.players.taku.image,
                    "story-character right",
                    "ТаКу — живая электронная таблица"
                )
            );
            return;
        }

        container.appendChild(
            game.mechanics.createImage(
                game.config.images.stitch,
                "story-character center",
                "Стич — бостон-терьер"
            )
        );
    }

    function createTitleScene() {
        return {
            id: "prologue_title",

            mount: function (root, context) {
                let isOpening = false;
                const screen = document.createElement("section");
                screen.className = "screen prologue-title-screen";
                screen.style.setProperty(
                    "--prologue-title-bg",
                    "url(\"" + game.config.images.prologueTitle + "\")"
                );

                // Только интерактивная зона на коробке
                const boxHotspot = document.createElement("button");
                boxHotspot.type = "button";
                boxHotspot.className = "prologue-box-hotspot";
                boxHotspot.setAttribute("aria-label", "Открыть магическую коробку");
                boxHotspot.dataset.label = "ОТКРЫТЬ";


                function openBox() {
                    if (isOpening) {
                        return;
                    }
                    isOpening = true;
                    game.audio.unlock();
                    screen.classList.add("is-opening");
                    boxHotspot.disabled = true;
                    game.ui.showSubtitle("Ход принят. Возражения правилами не предусмотрены.");

                    context.timeout(function () {
                        context.goTo("prologue_scan", {   // ← переход на следующий экран пролога
                            checkpointId: "prologue_scan",
                            save: true,
                            saveReason: "пролог: коробка открыта"
                        });
                    }, 1250);
                }

                context.on(boxHotspot, "click", openBox);

                // Контент содержит только hotspot (без текста и кнопки)
                const content = document.createElement("div");
                content.className = "screen-content prologue-title-content";
                content.appendChild(boxHotspot);

                // HUD не добавляем
                screen.appendChild(content);
                root.appendChild(screen);

                context.timeout(function () {
                    screen.classList.add("is-ready");
                }, 60);

                game.ui.showSubtitle("Нажмите на коробку, чтобы начать.");
            },

            unmount: function () {}
        };
    }

    function createScanPlayer(playerId, playerNumber, initialName) {
        const player = game.config.players[playerId];
        const container = document.createElement("div");
        container.className = "scan-player scan-player-" + playerId;

        const readout = document.createElement("div");
        readout.className = "scan-readout";

        const label = document.createElement("span");
        label.className = "scan-player-number";
        label.textContent = "ИГРОК " + playerNumber;

        const name = document.createElement("strong");
        name.className = "scan-player-name";
        name.textContent = initialName;
        name.dataset.text = initialName;

        const note = document.createElement("small");
        note.textContent = "ПОИСК СОВПАДЕНИЯ…";

        const image = game.mechanics.createImage(
            player.image,
            "scan-avatar",
            player.fullName
        );

        readout.append(label, name, note);
        container.append(readout, image);

        return {
            element: container,
            name: name,
            note: note
        };
    }

    function createScanScene() {
        const step = steps.prologue_scan;

        return {
            id: "prologue_scan",

            mount: function (root, context) {
                const screen = document.createElement("section");
                screen.className = "screen prologue-scan-screen";
                screen.style.setProperty(
                    "--prologue-scan-bg",
                    "url(\"" + game.config.images.prologueScan + "\")"
                );

                // Делаем экран видимым
                context.timeout(function () {
                    screen.classList.add("is-ready");
                }, 50);

                const stage = document.createElement("div");
                stage.className = "scan-stage";

                // ---- СОЗДАЁМ ЛИНИЮ КАК ОБЫЧНЫЙ ЭЛЕМЕНТ ----
                const scanLine = document.createElement("div");
                scanLine.className = "scan-line";
                scanLine.style.cssText = `
                    position: absolute;
                    top: -20px;
                    left: 0;
                    width: 100%;
                    height: 8px;
                    background: linear-gradient(to right, transparent, rgba(100, 200, 255, 0.6), transparent);
                    box-shadow: 0 0 20px rgba(100, 200, 255, 0.3);
                    pointer-events: none;
                    z-index: 10;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                // Стили для анимации будем добавлять через класс
                const lineStyle = document.createElement("style");
                lineStyle.textContent = `
                    .scan-line.active {
                        opacity: 1;
                        animation: scan-line-move 2.5s linear infinite;
                    }
                    @keyframes scan-line-move {
                        0% { top: -20px; }
                        100% { top: calc(100% + 20px); }
                    }
                `;
                document.head.appendChild(lineStyle);
                // сохраняем ссылку, чтобы убрать при размонтировании
                context.registerCleanup(function () {
                    lineStyle.remove();
                });

                

                // ---- ФИГУРЫ ----
                const tuko = createScanPlayer("tuko", "Ⅰ", "НАСТЯ");
                const taku = createScanPlayer("taku", "Ⅱ", "РИТА");

                // Центральный текст
                const result = document.createElement("div");
                result.className = "scan-result";
                result.style.opacity = "0";
                result.style.transform = "translate(-50%, 10px) scale(0.96)";
                result.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                result.style.top = "7%";
                // Кнопка
                const nextButton = game.mechanics.createButton(step.button, "gold-button scan-next-button");
                nextButton.disabled = true;
                nextButton.style.opacity = "0";
                nextButton.style.pointerEvents = "none";

                context.on(nextButton, "click", function () {
                    game.audio.unlock();
                    context.goTo(step.next, {
                        checkpointId: step.next,
                        save: true,
                        saveReason: "пролог: " + step.next
                    });
                });

                // Скрываем фигуры изначально
                tuko.element.style.opacity = "0";
                taku.element.style.opacity = "0";

                // ---- СБОРКА ----
                stage.append(tuko.element, taku.element, result, nextButton, scanLine);
                screen.append(stage);
                root.appendChild(screen);

                // ---- ТАЙМЛАЙН ----
                context.timeout(function () {
                    result.textContent = "ОБНАРУЖЕНЫ ДВА ИГРОКА.";
                    result.style.opacity = "1";
                    result.style.transform = "translate(-50%, 0) scale(1)";
                }, 500);

                context.timeout(function () {
                    result.textContent = "ИДЁТ СКАНИРОВАНИЕ.";
                    scanLine.classList.add("active"); // включаем линию
                }, 1200);

                context.timeout(function () {
                    result.textContent = "ОСТАВАЙТЕСЬ НЕПОДВИЖНЫ.";
                }, 1800);

                context.timeout(function () {
                    tuko.element.style.opacity = "1";
                    tuko.element.style.transition = "opacity 0.4s ease";
                    tuko.note.textContent = "ИСХОДНОЕ ИМЯ ОБНАРУЖЕНО";
                    screen.classList.add("scan-tuko-found");
                }, 2300);

                context.timeout(function () {
                    tuko.name.textContent = "ТУФЛЯ КО";
                    tuko.note.textContent = "ФОРМА НАЗНАЧЕНА СИСТЕМОЙ";
                    tuko.element.classList.add("scan-tuko-corrupted");
                }, 3200);

                context.timeout(function () {
                    taku.element.style.opacity = "1";
                    taku.element.style.transition = "opacity 0.4s ease";
                    taku.note.textContent = "ИСХОДНОЕ ИМЯ ОБНАРУЖЕНО";
                    screen.classList.add("scan-taku-found");
                }, 3700);

                context.timeout(function () {
                    taku.name.textContent = "ТАБЛИЦА КУ";
                    taku.note.textContent = "ФОРМА НАЗНАЧЕНА СИСТЕМОЙ";
                    taku.element.classList.add("scan-taku-corrupted");
                }, 4400);

                context.timeout(function () {
                    result.textContent = "ИГРОКИ ОПРЕДЕЛЕНЫ";
                    scanLine.classList.remove("active"); // выключаем линию
                }, 5000);

                context.timeout(function () {
                    result.textContent = "ТУФЛЯ КО. ТАБЛИЦА КУ. СОКРАЩЁННО — ТУКО И ТАКУ.";
                    nextButton.style.opacity = "1";
                    nextButton.style.pointerEvents = "auto";
                    nextButton.disabled = false;
                    nextButton.focus();
                }, 6000);

                game.ui.showSubtitle("Проверка игроков завершена.");
            },

            unmount: function () {}
        };
    }

    function createStorageScene() {
        const step = steps.prologue_storage;

        return {
            id: "prologue_storage",

            mount: function (root, context) {
                let phase = "waiting";
                const screen = document.createElement("section");
                screen.className = "screen prologue-storage-screen";
                screen.style.setProperty(
                    "--prologue-storage-bg",
                    "url(\"" + game.config.images.prologueStorage + "\")"
                );

                context.timeout(function () {
                    screen.classList.add("is-ready");
                }, 50);

                const stage = document.createElement("div");
                stage.className = "storage-stage";

                // ---- ТЕКСТ ----
                const textContainer = document.createElement("div");
                textContainer.style.cssText = `
                    position: absolute;
                    top: clamp(80px, 10vh, 120px);
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    width: min(700px, 80vw);
                    color: var(--gold-pale);
                    font-family: 'Arial Black', Impact, sans-serif;
                    font-weight: 900;
                    text-shadow: 0 2px 12px rgba(0,0,0,0.8);
                `;
                const line1 = document.createElement("p");
                line1.style.cssText = `
                    font-size: clamp(18px, 2vw, 28px);
                    margin: 0 0 8px 0;
                    letter-spacing: 0.05em;
                    min-height: 1.5em;
                    font-weight: 900;
                `;
                line1.textContent = "";
                const line2 = document.createElement("p");
                line2.style.cssText = `
                    font-size: clamp(14px, 1.4vw, 20px);
                    margin: 0;
                    color: var(--gold-pale);
                    min-height: 1.5em;
                    font-weight: 700;
                `;
                line2.textContent = "";
                textContainer.appendChild(line1);
                textContainer.appendChild(line2);

                // ---- КАРТОЧКА ----
                const systemCard = document.createElement("aside");
                systemCard.style.cssText = `
                    position: absolute;
                    top: clamp(200px, 22vh, 260px);
                    left: 50%;
                    transform: translateX(-50%);
                    width: min(500px, 70vw);
                    text-align: center;
                    padding: 20px 24px;
                    border-radius: 16px;
                    border: 2px solid transparent;
                    background: rgba(7, 5, 12, 0.88);
                    box-shadow: 0 0 30px rgba(255, 74, 115, 0.1);
                    backdrop-filter: blur(10px);
                    opacity: 0;
                    transition: opacity 0.5s ease, border-color 0.3s ease;
                `;
                systemCard.innerHTML = `
                    <span style="display: block; font-size: 11px; letter-spacing: 0.12em; color: rgba(255,255,255,0.6);">НЕУЧТЁННЫЙ ОБЪЕКТ</span>
                    <strong style="display: block; font-size: 28px; margin: 8px 0; color: var(--text); font-weight: 900;">ТИП: НЕ ОПРЕДЕЛЁН</strong>
                    <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.6);">ВЛАДЕЛЕЦ: <b style="color: var(--danger);">НЕ ОПРЕДЕЛЁН</b></p>
                `;

                // ---- ФИГУРКИ ----
                const tukoImage = game.mechanics.createImage(
                    game.config.players.tuko.image,
                    "storage-piece storage-piece-tuko",
                    "ТуКо"
                );
                const takuImage = game.mechanics.createImage(
                    game.config.players.taku.image,
                    "storage-piece storage-piece-taku",
                    "ТаКу"
                );

                // ---- СТИЧ (невидим) ----
                const stitchImage = game.mechanics.createImage(
                    game.config.images.stitch,
                    "storage-stitch",
                    "Стич — бостон-терьер"
                );
                stitchImage.style.opacity = "0";
                stitchImage.style.transition = "opacity 0.6s ease";

                // ---- РЕАКЦИЯ (отдельный элемент в stage) ----
                const reaction = document.createElement("div");
                reaction.className = "storage-reaction";
                reaction.setAttribute("aria-hidden", "true");
                reaction.style.cssText = `
                    position: absolute;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                    display: flex;
                    gap: 8px;
                    white-space: nowrap;
                    z-index: 20;
                `;
                reaction.innerHTML = `
                    <span style="font-size: 50px; color: #ff6b81; text-shadow: 0 0 30px rgba(255, 80, 120, 0.9);">♥</span>
                    <i style="font-size: 40px; font-style: normal; color: #ff3b5c; text-shadow: 0 0 30px rgba(255, 50, 80, 0.9);">♥</i>
                    <b style="font-size: 30px; font-weight: bold; color: #ff1a4a; text-shadow: 0 0 30px rgba(255, 20, 60, 0.9);">♥</b>
                `;
                // Не добавляем в stitchImage, а сразу в stage

                // ---- СИСТЕМНОЕ СООБЩЕНИЕ ----
                const result = document.createElement("article");
                result.className = "storage-result panel";
                result.style.cssText = `
                    position: absolute;
                    top: 25%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.96);
                    opacity: 0;
                    transition: opacity 0.5s ease, transform 0.5s ease;
                    width: min(650px, 80vw);
                    padding: 24px 28px;
                    text-align: center;
                    background: var(--panel);
                    border: 1px solid rgba(245,199,93,0.3);
                    border-radius: 22px;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.48);
                    backdrop-filter: blur(14px);
                    pointer-events: none;
                `;
                result.innerHTML = `
                    <p class="eyebrow">ОШИБКА СИСТЕМЫ</p>
                    <h2 style="font-size: clamp(25px, 3vw, 40px); color: var(--gold-pale); font-family: 'Arial Black', Impact, sans-serif; font-weight: 900; margin: 8px 0;">ОБЪЕКТ РАСПОЗНАН.<br>ЛИЧНОСТИ НЕ СОВПАДАЮТ.<br>СВЯЗЬ ПОДТВЕРЖДЕНА.</h2>
                `;

                // ---- КНОПКА ----
                const actionButton = game.mechanics.createButton("ПОСМОТРЕТЬ", "gold-button storage-action-button");
                actionButton.style.cssText = `
                    position: absolute;
                    left: 50%;
                    bottom: clamp(100px, 12vh, 140px);
                    transform: translateX(-50%);
                    min-width: 220px;
                    z-index: 12;
                    font-weight: 900;
                `;

                // ---- ХЕЛПЕР ПОЗИЦИОНИРОВАНИЯ РЕАКЦИИ ----
                function positionReactionAboveStitch() {
                    if (!stitchImage || !reaction) return;
                    const rect = stitchImage.getBoundingClientRect();
                    const stageRect = stage.getBoundingClientRect();
                    const left = rect.left - stageRect.left + rect.width / 2;
                    const top = rect.top - stageRect.top - 10; // 10px отступа сверху
                    reaction.style.left = left + "px";
                    reaction.style.top = top + "px";
                    reaction.style.transform = "translateX(-50%)";
                }

                // ---- ЗВУК ----
                let callSound = null;
                try {
                    callSound = new Audio("assets/audio/3228b0eebfc7ef7.mp3");
                    callSound.volume = 0.5;
                } catch (e) {}

                // ---- ОСНОВНАЯ ЛОГИКА ----
                function finishScene() {
                    game.audio.stop('ambience');
                    screen.remove();
                    const container = document.createElement("div");
                    container.style.cssText = `
                        position: fixed;
                        inset: 0;
                        background: #000;
                        z-index: 200;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    `;

                    document.body.appendChild(container);

                    let video = crazhaVideo;
                    let finished = false;

                    function goNext() {
                        if (finished) return;
                        finished = true;

                        if (video) {
                            video.pause();
                            video.remove();
                        }

                        container.remove();

                        context.goTo(step.next, {
                            checkpointId: step.next,
                            save: true,
                            saveReason: "пролог: " + step.next
                        });
                    }

                    function startVideo() {
                        if (finished || !video) return;

                        video.style.cssText = `
                            position: absolute;
                            inset: 0;
                            width: 100%;
                            height: 100%;
                            display: block;
                        `;

                        container.appendChild(video);

                        video.addEventListener("ended", goNext, { once: true });

                        video.addEventListener("error", function () {
                            console.warn("Ошибка воспроизведения crazha.mp4");
                            goNext();
                        }, { once: true });

                        video.play().catch(function (error) {
                            console.warn("Не удалось воспроизвести crazha.mp4:", error);
                            goNext();
                        });
                    }

                    if (!video) {
                        video = document.createElement("video");
                        video.preload = "auto";
                        video.playsInline = true;
                        video.setAttribute("playsinline", "");
                        video.setAttribute("webkit-playsinline", "");
                        video.src = "assets/video/crazha.mp4?v=2";
                        video.load();
                    }

                    startVideo();
                }

                function callStitch() {
                    if (phase !== "waiting") return;

                    phase = "running";
                    game.audio.unlock();
                    if (callSound) {
                        callSound.currentTime = 0;
                        callSound.play().catch(() => {});
                    }

                    actionButton.disabled = true;
                    actionButton.textContent = "СТИЧ ПРИБЫВАЕТ…";
                    screen.classList.add("storage-stitch-entered");
                    stitchImage.style.opacity = "1";
                    game.ui.showSubtitle("Стич появляется из тени.");

                    // Через 1.2 сек – показываем сердечки над Стичем
                    context.timeout(function () {
                        screen.classList.add("storage-check-tuko", "storage-check-taku");
                        positionReactionAboveStitch(); // вычисляем позицию
                        reaction.style.opacity = "1";
                        game.ui.showSubtitle("Стич смотрит на них… и радостно виляет хвостом.");
                    }, 1200);

                    // Через 3.2 сек – системное сообщение
                    context.timeout(function () {
                        phase = "complete";
                        screen.classList.add("storage-recognized");
                        result.style.opacity = "1";
                        result.style.transform = "translate(-50%, -50%) scale(1)";
                        actionButton.textContent = "К ЦЕНТРАЛЬНОМУ СТОЛУ";
                        actionButton.disabled = false;
                        // скрываем сердечки
                        reaction.style.opacity = "0";
                        game.ui.showSubtitle("Связь подтверждена. Игра зафиксировала несоответствие.");
                        actionButton.focus();
                    }, 3200);
                }

                context.on(actionButton, "click", function () {
                    if (phase === "complete") {
                        finishScene();
                        return;
                    }
                    callStitch();
                });

                // ---- СБОРКА ----
                stage.append(
                    textContainer,
                    systemCard,
                    tukoImage,
                    takuImage,
                    stitchImage,
                    reaction,   // теперь отдельно
                    result,
                    actionButton
                );
                screen.append(stage);
                root.appendChild(screen);

                // ---- ПЕЧАТЬ ----
                const fullText1 = "СИСТЕМА СКАНИРУЕТ ПОМЕЩЕНИЕ";
                const fullText2 = "Среди фигурок обнаружен неизвестный объект";
                let index1 = 0, index2 = 0;

                function typeLine1() {
                    if (index1 < fullText1.length) {
                        line1.textContent += fullText1.charAt(index1);
                        index1++;
                        const delay = 40 + Math.random() * 60;
                        context.timeout(typeLine1, delay);
                    } else {
                        context.timeout(typeLine2, 300);
                    }
                }

                function typeLine2() {
                    if (index2 < fullText2.length) {
                        line2.textContent += fullText2.charAt(index2);
                        index2++;
                        const delay = 30 + Math.random() * 50;
                        context.timeout(typeLine2, delay);
                    } else {
                        context.timeout(function () {
                            systemCard.style.opacity = "1";
                            systemCard.style.borderColor = "rgba(255, 74, 115, 0.9)";
                            game.ui.showSubtitle("Объект классифицирован как неизвестный.");
                        }, 400);
                    }
                }

                context.timeout(function () {
                    screen.classList.add("storage-ready");
                    context.timeout(typeLine1, 500);
                }, 80);

                game.ui.showSubtitle("Сканирование...");
                actionButton.focus();
            },

            unmount: function () {}
        };
    }


    function createPrologueScene(id) {
        const step = steps[id];

        return {
            id: id,

            mount: function (root, context) {
                if (id === "prologue_scan") {
                    preloadCrazhaVideo();
                }

                const screen = document.createElement("section");
                screen.className = "screen prologue-screen";

                const content = document.createElement("div");
                content.className = "screen-content";

                const card = document.createElement("article");
                card.className = "story-card panel";
                card.innerHTML =
                    "<p class=\"eyebrow\">" + step.eyebrow + "</p>" +
                    "<h1>" + step.title + "</h1>" +
                    "<p>" + step.text + "</p>";

                const actions = document.createElement("div");
                actions.className = "button-row";
                const nextButton = game.mechanics.createButton(step.button, "gold-button");
                context.on(nextButton, "click", function () {
                    game.audio.unlock();
                    context.goTo(step.next, {
                        checkpointId: step.next,
                        save: true,
                        saveReason: "пролог: " + step.next
                    });
                });
                actions.appendChild(nextButton);
                card.appendChild(actions);

                const visual = document.createElement("div");
                visual.className = "story-visual";
                addStoryVisual(visual, step.visual);

                content.append(card, visual);
                screen.append(content);
                root.appendChild(screen);
                game.ui.showSubtitle(step.subtitle);
                nextButton.focus();
            },

            unmount: function () {}
        };
    }

    game.scenes.prologue_title = createTitleScene();
    game.scenes.prologue_scan = createScanScene();
    game.scenes.prologue_storage = createStorageScene();

    Object.keys(steps).filter(function (id) {
        return id !== "prologue_title" && id !== "prologue_scan" && id !== "prologue_storage";
    }).forEach(function (id) {
        game.scenes[id] = createPrologueScene(id);
    });
})(window);