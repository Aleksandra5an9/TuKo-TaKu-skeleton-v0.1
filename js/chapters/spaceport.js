(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    game.scenes = game.scenes || {};
    game.chapters = game.chapters || {};
    game.chapters.spaceport = { id: "spaceport", status: "in-progress" };

    const INTRO_LINES = [
        {
            speaker: "ВЕДУЩИЙ",
            speakerClass: "host",
            text: "Ход ТаКу. Кость открывает Порт Нулевой Орбиты."
        },
        {
            speaker: "ТаКу",
            speakerClass: "taku",
            text: "Она опять выпала ровно той гранью, которая вам нужна."
        },
        {
            speaker: "ВЕДУЩИЙ",
            speakerClass: "host",
            text: "Вероятность не обязана быть удобной для понимания."
        },
        {
            speaker: "СИСТЕМА ПОРТА",
            speakerClass: "system",
            text: "Навигационное ядро разобрано. Расчёт курса невозможен."
        },
        {
            speaker: "ТуКо",
            speakerClass: "tuko",
            text: "Рита, кажется, это место буквально ждало тебя."
        },
        {
            speaker: "ТаКу",
            speakerClass: "taku",
            text: "Наконец-то помещение с нормальной структурой. Почти."
        }
    ];

    const CORE_FREQUENCIES = {
        orbit: { glyph: "○", title: "ОРБИТА", color: "#63e8ff" },
        prism: { glyph: "◇", title: "ПРИЗМА", color: "#b873ff" },
        nova: { glyph: "✦", title: "НОВА", color: "#ffd46b" }
    };

    const CORE_COLORS = {
        cyan: "#63e8ff",
        violet: "#b873ff",
        gold: "#ffd46b",
        white: "#e9f5ff"
    };

    /*
       Логика задачи:
       - у каждого гнезда есть частота;
       - модуль можно повернуть на 180°, тем самым поменяв местами левый/правый контакт;
       - соседние контакты по кольцу должны совпасть по цвету;
       - решение единственное.

       Правильная конфигурация по часовой стрелке от верхнего гнезда:
       pyramid → ring → sphere → moon(повёрнут) → diamond → star.
       В интерфейсе это нигде не показывается.
    */
    const CORE_SLOT_FREQUENCIES = [
        "orbit",
        "orbit",
        "prism",
        "nova",
        "prism",
        "nova"
    ];

    const CORE_MODULES = {
        pyramid: {
            name: "Пирамида",
            image: "assets/images/spaceport_module_pyramid.png",
            frequency: "orbit",
            left: "gold",
            right: "cyan"
        },
        ring: {
            name: "Кольцо",
            image: "assets/images/spaceport_module_ring.png",
            frequency: "orbit",
            left: "cyan",
            right: "violet"
        },
        diamond: {
            name: "Ромб",
            image: "assets/images/spaceport_module_diamond.png",
            frequency: "prism",
            left: "white",
            right: "cyan"
        },
        sphere: {
            name: "Сфера",
            image: "assets/images/spaceport_module_sphere.png",
            frequency: "prism",
            left: "violet",
            right: "cyan"
        },
        star: {
            name: "Звезда",
            image: "assets/images/spaceport_module_star.png",
            frequency: "nova",
            left: "cyan",
            right: "gold"
        },
        moon: {
            name: "Полумесяц",
            image: "assets/images/spaceport_module_crescent.png",
            frequency: "nova",
            left: "white",
            right: "cyan"
        }
    };

    const CORE_TRAY_ORDER = [
        "sphere",
        "pyramid",
        "moon",
        "diamond",
        "ring",
        "star"
    ];


    const ROUTE_DESTINATIONS = [
        { id: "ring", name: "Кольцевая", image: "assets/images/spaceport_planet_rings.png" },
        { id: "crystal", name: "Кристалл", image: "assets/images/spaceport_planet_crystal.png" },
        { id: "vortex", name: "Вихрь", image: "assets/images/spaceport_planet_vortex.png" },
        { id: "binary", name: "Двойная звезда", image: "assets/images/spaceport_planet_twinstar.png" }
    ];

    const ROUTE_SHIPS = {
        violet: {
            name: "Фиолетовая",
            genitive: "фиолетовой ракеты",
            color: "#b873ff",
            image: "assets/images/spaceport_ship_violet.png"
        },
        cyan: {
            name: "Голубая",
            genitive: "голубой ракеты",
            color: "#63e8ff",
            image: "assets/images/spaceport_ship_blue.png"
        },
        green: {
            name: "Зелёная",
            genitive: "зелёной ракеты",
            color: "#69f29a",
            image: "assets/images/spaceport_ship_green.png"
        },
        gold: {
            name: "Золотая",
            genitive: "золотой ракеты",
            color: "#ffd46b",
            image: "assets/images/spaceport_ship_gold.png"
        }
    };

    const ROUTE_SHIP_ORDER = ["gold", "cyan", "violet", "green"];

    const ROUTE_HINTS = [
        "Начните с двух пар, про которые известно, что они идут подряд.",
        "Фиолетовая → Голубая и Кольцевая → Вихрь — две последовательности из соседних окон.",
        "Золотая ракета идёт сразу после рейса к Вихрю. Попробуйте сначала определить, где вообще может стоять эта пара."
    ];

    const ROUTE_SOLUTION = {
        violet: { row: 0, destination: "crystal" },
        cyan: { row: 1, destination: "ring" },
        green: { row: 2, destination: "vortex" },
        gold: { row: 3, destination: "binary" }
    };


    const ENERGY_DIRECTIONS = ["N", "E", "S", "W"];
    const ENERGY_DELTAS = {
        N: [-1, 0],
        E: [0, 1],
        S: [1, 0],
        W: [0, -1]
    };
    const ENERGY_OPPOSITE = { N: "S", E: "W", S: "N", W: "E" };

    /*
       Энергоконтур 4×4. Ячейка r2c1 повреждена и не используется.
       baseEdges — правильная ориентация. rotation = 0 означает решение.
       Стартовые повороты получены реальными игровыми вращениями от решения,
       поэтому конфигурация гарантированно достижима даже с парными плитками.
    */
    const ENERGY_TILES = {
        r0c0: { edges: ["E", "S"], rotation: 0 },
        r0c1: { edges: ["S", "W"], rotation: 2, pair: "A" },
        r0c2: { edges: ["E", "S"], rotation: 0, pair: "B" },
        r0c3: { edges: ["E", "S", "W"], rotation: 2 },

        r1c0: { edges: ["N", "E", "S", "W"], rotation: 0 },
        r1c1: { edges: ["N", "E", "W"], rotation: 2 },
        r1c2: { edges: ["N", "S", "W"], rotation: 2, pair: "A" },
        r1c3: { edges: ["N", "E", "S"], rotation: 0 },

        r2c0: { edges: ["N", "S"], rotation: 1, pair: "C" },
        r2c2: { edges: ["N", "E", "S"], rotation: 2 },
        r2c3: { edges: ["N", "S", "W"], rotation: 0, pair: "B" },

        r3c0: { edges: ["N", "E"], rotation: 0 },
        r3c1: { edges: ["E", "W"], rotation: 0 },
        r3c2: { edges: ["N", "E", "W"], rotation: 3, pair: "C" },
        r3c3: { edges: ["N", "E", "W"], rotation: 1 }
    };

    const ENERGY_PAIR_TILES = {
        A: ["r0c1", "r1c2"],
        B: ["r0c2", "r2c3"],
        C: ["r2c0", "r3c2"]
    };

    const ENERGY_BLOCKED = "r2c1";
    const ENERGY_SOURCE = { tileId: "r1c0", side: "W" };
    const ENERGY_OUTPUTS = [
        { tileId: "r0c3", side: "E", key: "engine", label: "ДВИГАТЕЛЬ" },
        { tileId: "r1c3", side: "E", key: "shield", label: "ЩИТ" },
        { tileId: "r3c3", side: "E", key: "navigation", label: "НАВИГАЦИЯ" }
    ];

    const ENERGY_HINTS = [
        "Сначала проверьте край поля: ни одна трасса не должна смотреть наружу, кроме входа слева и трёх выходов справа.",
        "Повреждённый красный узел нельзя использовать. Плитки вокруг него сразу получают жёсткие ограничения по направлению.",
        "Метки A, B и C связывают плитки попарно: одна поворачивается по часовой, вторая — против. Удобнее сначала выставить плитки без меток.",
        "Если импульс стабильно доходит до одной и той же области, не разбирайте уже работающий участок: ищите первый разрыв сразу после него."
    ];

    function createCoreModule(moduleId) {
        const data = CORE_MODULES[moduleId];
        const frequency = CORE_FREQUENCIES[data.frequency];
        const module = document.createElement("button");
        module.type = "button";
        module.className = "core-module core-module-frequency-" + data.frequency;
        module.dataset.moduleId = moduleId;
        module.dataset.rotation = "0";
        module.draggable = true;
        module.style.setProperty("--frequency-color", frequency.color);
        module.setAttribute("aria-label", data.name + ", частота " + frequency.title);

        const leftContact = document.createElement("span");
        leftContact.className = "core-module-contact core-module-contact-left";
        leftContact.innerHTML = "<i></i>";

        const artWrap = document.createElement("span");
        artWrap.className = "core-module-art";
        artWrap.appendChild(
            game.mechanics.createImage(
                data.image,
                "core-module-image",
                data.name
            )
        );

        const frequencyBadge = document.createElement("span");
        frequencyBadge.className = "core-module-frequency";
        frequencyBadge.title = "Частота " + frequency.title;
        frequencyBadge.innerHTML =
            "<b>" + frequency.glyph + "</b>" +
            "<small>" + frequency.title + "</small>";

        const rightContact = document.createElement("span");
        rightContact.className = "core-module-contact core-module-contact-right";
        rightContact.innerHTML = "<i></i>";

        const name = document.createElement("span");
        name.className = "core-module-name";
        name.textContent = data.name;

        module.append(leftContact, artWrap, frequencyBadge, rightContact, name);
        return module;
    }

    function createCoreSlot(index) {
        const frequency = CORE_SLOT_FREQUENCIES[index];
        const slot = document.createElement("div");
        slot.className = "core-slot core-slot-" + (index + 1) + " core-slot-frequency-" + frequency;
        slot.dataset.slotIndex = String(index);
        slot.dataset.frequency = frequency;
        slot.style.setProperty("--frequency-color", CORE_FREQUENCIES[frequency].color);
        slot.innerHTML =
            "<span class=\"core-slot-number\">0" + (index + 1) + "</span>" +
            "<span class=\"core-slot-frequency\" title=\"Частота гнезда: " + CORE_FREQUENCIES[frequency].title + "\"><b>" + CORE_FREQUENCIES[frequency].glyph + "</b><small>" + CORE_FREQUENCIES[frequency].title + "</small></span>" +
            "<div class=\"core-slot-module-host\"></div>";
        return slot;
    }

    function getOrientedEdges(moduleId, rotation) {
        const data = CORE_MODULES[moduleId];
        return rotation === 1
            ? { left: data.right, right: data.left }
            : { left: data.left, right: data.right };
    }

    game.scenes.spaceport_intro = {
        id: "spaceport_intro",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            if (!game.spaceportMusic) {
                game.spaceportMusic = new Audio("assets/audio/spaceport_music.mp3");
                game.spaceportMusic.loop = true;
                game.spaceportMusic.volume = 0.35;
            }

            game.spaceportMusic.play().catch(function () {});

            const screen = document.createElement("section");
            screen.className = "screen spaceport-screen spaceport-intro-screen";

            const content = document.createElement("div");
            content.className = "screen-content spaceport-intro-content";

            const chapterMark = document.createElement("div");
            chapterMark.className = "spaceport-chapter-mark";
            chapterMark.innerHTML =
                "<span>ГЛАВА II</span>" +
                "<strong>Порт Нулевой Орбиты</strong>" +
                "<small>ГЛАВНЫЙ ИГРОК · ТаКу</small>";

            const dialogue = document.createElement("article");
            dialogue.className = "spaceport-dialogue";

            const nextButton = game.mechanics.createButton(
                "К ЯДРУ",
                "gold-button spaceport-dialogue-next"
            );

            dialogue.appendChild(nextButton);

            content.append(chapterMark, dialogue);
            screen.append(
                game.ui.createHud(context, { title: "Порт Нулевой Орбиты", showPlayer: true }),
                content
            );
            root.appendChild(screen);

            let locked = true;

            const INTRO_AUDIO = [
                "assets/audio/spaceport_host_01.mp3",
                "assets/audio/spaceport_taku_01.mp3",
                "assets/audio/spaceport_host_02.mp3",
                "assets/audio/spaceport_system_01.mp3",
                "assets/audio/spaceport_tuko_01.mp3",
                "assets/audio/spaceport_taku_02.mp3"
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

                    if (!game.audio.isUnlocked()) {
                        resolve();
                    }
                });
            }

            async function playIntro() {
                for (const path of INTRO_AUDIO) {
                    await playVoiceAndWait(path);
                }

                locked = false;
                nextButton.disabled = false;
                nextButton.focus();
            }

            context.on(nextButton, "click", function () {
                if (locked) {
                    return;
                }

                locked = true;
                nextButton.disabled = true;
                context.goTo("spaceport_core", {
                    checkpointId: "spaceport_core",
                    save: true,
                    saveReason: "Космопорт: начало восстановления навигационного ядра"
                });
            });

            context.timeout(function () {
                screen.classList.add("spaceport-ready");
                nextButton.disabled = true;
                playIntro();
            }, 80);
        },

        unmount: function () {}
    };

    game.scenes.spaceport_core = {
        id: "spaceport_core",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            const screen = document.createElement("section");
            screen.className = "screen spaceport-screen spaceport-core-screen";

            const successBackdrop = document.createElement("div");
            successBackdrop.className = "spaceport-core-success-backdrop";
            successBackdrop.setAttribute("aria-hidden", "true");

            const content = document.createElement("div");
            content.className = "screen-content spaceport-core-content";

            const header = document.createElement("div");
            header.className = "spaceport-core-header";
            header.innerHTML =
                "<span>ИСПЫТАНИЕ 1 ИЗ 3 · НАВИГАЦИОННОЕ ЯДРО</span>" +
                "<strong>Замкните цепь</strong>" +
                "<small>Частота модуля должна совпасть с гнездом, а соседние контакты — друг с другом. Клик по установленному модулю поворачивает его.</small>";

            const stage = document.createElement("div");
            stage.className = "spaceport-core-stage";

            const ring = document.createElement("div");
            ring.className = "core-ring";

            const center = document.createElement("div");
            center.className = "core-center";
            center.innerHTML =
                "<span class=\"core-center-orbit core-center-orbit-a\"></span>" +
                "<span class=\"core-center-orbit core-center-orbit-b\"></span>" +
                "<strong>ЯДРО</strong>" +
                "<small>ОЖИДАНИЕ</small>";

            const pulse = document.createElement("div");
            pulse.className = "core-pulse";
            pulse.setAttribute("aria-hidden", "true");

            const slots = CORE_SLOT_FREQUENCIES.map(function (_, index) {
                const slot = createCoreSlot(index);
                ring.appendChild(slot);
                return slot;
            });

            ring.append(center, pulse);

            const tray = document.createElement("div");
            tray.className = "core-module-tray";
            tray.setAttribute("aria-label", "Отключённые модули");

            const moduleElements = {};
            const moduleState = {};

            CORE_TRAY_ORDER.forEach(function (moduleId) {
                const module = createCoreModule(moduleId);
                moduleElements[moduleId] = module;
                moduleState[moduleId] = {
                    slotIndex: null,
                    rotation: 0
                };
                tray.appendChild(module);
            });

            const controls = document.createElement("div");
            controls.className = "spaceport-core-controls";

            const status = document.createElement("div");
            status.className = "spaceport-core-statusline";
            status.innerHTML =
                "<strong>0 / 6</strong>" +
                "<span>Установите все модули. Проверка выполняется только после сборки всей цепи.</span>";

            const launchButton = game.mechanics.createButton("ЗАПУСТИТЬ ЯДРО", "gold-button core-launch-button");
            const resetButton = game.mechanics.createButton("СБРОСИТЬ", "ghost-button core-reset-button");
            const continueButton = game.mechanics.createButton("К МАРШРУТУ", "gold-button core-continue-button");
            continueButton.hidden = true;

            controls.append(status, resetButton, launchButton, continueButton);
            stage.append(ring, tray, controls);
            content.append(header, stage);
            screen.append(
                successBackdrop,
                game.ui.createHud(context, { title: "Космопорт · Навигационное ядро", showPlayer: true }),
                content
            );
            root.appendChild(screen);

            let selectedModuleId = null;
            let locked = false;
            let completed = game.state.get().chapterProgress.spaceport >= 1;

            function colorValue(colorName) {
                return CORE_COLORS[colorName] || CORE_COLORS.white;
            }

            function renderModule(moduleId) {
                const module = moduleElements[moduleId];
                const state = moduleState[moduleId];
                const edges = getOrientedEdges(moduleId, state.rotation);
                const left = module.querySelector(".core-module-contact-left");
                const right = module.querySelector(".core-module-contact-right");
                const art = module.querySelector(".core-module-art");

                left.style.setProperty("--contact-color", colorValue(edges.left));
                right.style.setProperty("--contact-color", colorValue(edges.right));
                art.classList.toggle("is-rotated", state.rotation === 1);
                module.classList.toggle("is-selected", selectedModuleId === moduleId);
                module.classList.toggle("is-installed", state.slotIndex !== null);
                module.dataset.rotation = String(state.rotation);
            }

            function placedCount() {
                return Object.keys(moduleState).filter(function (moduleId) {
                    return moduleState[moduleId].slotIndex !== null;
                }).length;
            }

            function clearDiagnostics() {
                screen.classList.remove("core-scan-running", "core-scan-failed", "core-complete");
                slots.forEach(function (slot) {
                    slot.classList.remove("is-scanning", "is-passed", "is-fault", "is-fault-in", "is-fault-out");
                });
            }

            function setStatus(message, countOverride) {
                const count = typeof countOverride === "number" ? countOverride : placedCount();
                status.querySelector("strong").textContent = count + " / 6";
                status.querySelector("span").textContent = message;
            }

            function updateStatus() {
                if (completed) {
                    setStatus("Навигационное ядро синхронизировано. Система маршрута разблокирована.", 6);
                    return;
                }

                const count = placedCount();
                if (count < 6) {
                    setStatus("Установите все модули. Проверка выполняется только после сборки всей цепи.", count);
                } else {
                    setStatus("Все модули установлены. Запустите импульс и проверьте цепь.", 6);
                }
            }

            function setSelected(moduleId) {
                selectedModuleId = moduleId;
                Object.keys(moduleElements).forEach(renderModule);
            }

            function moduleAtSlot(slotIndex) {
                return Object.keys(moduleState).find(function (moduleId) {
                    return moduleState[moduleId].slotIndex === slotIndex;
                }) || null;
            }

            function returnModuleToTray(moduleId) {
                if (!moduleId) {
                    return;
                }

                moduleState[moduleId].slotIndex = null;
                tray.appendChild(moduleElements[moduleId]);
                renderModule(moduleId);
            }

            function placeModule(moduleId, slotIndex) {
                if (locked || completed || !moduleId) {
                    return;
                }

                clearDiagnostics();

                const oldOccupant = moduleAtSlot(slotIndex);
                if (oldOccupant && oldOccupant !== moduleId) {
                    returnModuleToTray(oldOccupant);
                }

                moduleState[moduleId].slotIndex = slotIndex;
                slots[slotIndex].querySelector(".core-slot-module-host").appendChild(moduleElements[moduleId]);
                setSelected(null);
                renderModule(moduleId);
                updateStatus();
            }

            function rotateModule(moduleId) {
                if (locked || completed || moduleState[moduleId].slotIndex === null) {
                    return;
                }

                clearDiagnostics();
                moduleState[moduleId].rotation = moduleState[moduleId].rotation === 0 ? 1 : 0;
                renderModule(moduleId);
                updateStatus();
            }

            function resetPuzzle() {
                if (locked || completed) {
                    return;
                }

                clearDiagnostics();
                selectedModuleId = null;
                CORE_TRAY_ORDER.forEach(function (moduleId) {
                    moduleState[moduleId].slotIndex = null;
                    moduleState[moduleId].rotation = 0;
                    tray.appendChild(moduleElements[moduleId]);
                    renderModule(moduleId);
                });
                updateStatus();
            }

            function checkNode(slotIndex) {
                const currentId = moduleAtSlot(slotIndex);
                const nextIndex = (slotIndex + 1) % slots.length;
                const nextId = moduleAtSlot(nextIndex);

                if (!currentId || !nextId) {
                    return { ok: false, type: "missing", slotIndex: slotIndex };
                }

                const currentModule = CORE_MODULES[currentId];
                if (currentModule.frequency !== CORE_SLOT_FREQUENCIES[slotIndex]) {
                    return { ok: false, type: "frequency", slotIndex: slotIndex };
                }

                const currentEdges = getOrientedEdges(currentId, moduleState[currentId].rotation);
                const nextEdges = getOrientedEdges(nextId, moduleState[nextId].rotation);

                if (currentEdges.right !== nextEdges.left) {
                    return {
                        ok: false,
                        type: "contact",
                        slotIndex: slotIndex,
                        nextIndex: nextIndex
                    };
                }

                return { ok: true };
            }

            function finishSuccess() {
                locked = false;
                completed = true;
                screen.classList.remove("core-scan-running", "core-scan-failed");
                screen.classList.add("core-complete");
                center.querySelector("small").textContent = "СИНХРОНИЗИРОВАНО";
                slots.forEach(function (slot) {
                    slot.classList.remove("is-scanning");
                    slot.classList.add("is-passed");
                });

                const currentProgress = game.state.get().chapterProgress;
                game.state.patch({
                    chapterProgress: {
                        ...currentProgress,
                        spaceport: Math.max(currentProgress.spaceport, 1)
                    }
                });
                game.save.write("Космопорт: навигационное ядро восстановлено");

                launchButton.hidden = true;
                resetButton.hidden = true;
                continueButton.hidden = false;
                setStatus("Навигационное ядро синхронизировано. Система маршрута разблокирована.", 6);
                continueButton.focus();
            }

            function failScan(result) {
                locked = false;
                screen.classList.remove("core-scan-running");
                screen.classList.add("core-scan-failed");

                if (result.type === "frequency") {
                    slots[result.slotIndex].classList.add("is-fault");
                    setStatus("Импульс не прошёл узел 0" + (result.slotIndex + 1) + ": частота модуля не совпадает с гнездом.", 6);
                } else if (result.type === "contact") {
                    slots[result.slotIndex].classList.add("is-fault-out");
                    slots[result.nextIndex].classList.add("is-fault-in");
                    setStatus(
                        "Импульс оборвался между узлами 0" + (result.slotIndex + 1) + " и 0" + (result.nextIndex + 1) + ": спектры контактов не совпали.",
                        6
                    );
                } else {
                    setStatus("Цепь неполна. Один из модулей не подключён.", placedCount());
                }

                launchButton.disabled = false;
            }

            function scanStep(index) {
                if (index >= slots.length) {
                    context.timeout(finishSuccess, 260);
                    return;
                }

                const slot = slots[index];
                slot.classList.add("is-scanning");
                center.querySelector("small").textContent = "СКАНИРОВАНИЕ 0" + (index + 1);

                context.timeout(function () {
                    const result = checkNode(index);
                    slot.classList.remove("is-scanning");

                    if (!result.ok) {
                        failScan(result);
                        return;
                    }

                    slot.classList.add("is-passed");
                    scanStep(index + 1);
                }, 300);
            }

            function launchCore() {
                if (locked || completed) {
                    return;
                }

                if (placedCount() !== 6) {
                    setStatus("Сначала подключите все шесть модулей.");
                    screen.classList.add("core-scan-failed");
                    context.timeout(function () {
                        screen.classList.remove("core-scan-failed");
                    }, 500);
                    return;
                }

                clearDiagnostics();
                locked = true;
                launchButton.disabled = true;
                screen.classList.add("core-scan-running");
                center.querySelector("small").textContent = "ИМПУЛЬС";
                setStatus("Импульс идёт по кольцу. Система ищет первый разрыв.", 6);
                scanStep(0);
            }

            Object.keys(moduleElements).forEach(function (moduleId) {
                const module = moduleElements[moduleId];

                context.on(module, "click", function (event) {
                    event.stopPropagation();

                    if (locked || completed) {
                        return;
                    }

                    if (moduleState[moduleId].slotIndex !== null) {
                        rotateModule(moduleId);
                    } else {
                        setSelected(selectedModuleId === moduleId ? null : moduleId);
                    }
                });

                context.on(module, "dragstart", function (event) {
                    if (locked || completed) {
                        event.preventDefault();
                        return;
                    }
                    selectedModuleId = moduleId;
                    renderModule(moduleId);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", moduleId);
                });
            });

            slots.forEach(function (slot, slotIndex) {
                context.on(slot, "click", function () {
                    if (selectedModuleId) {
                        placeModule(selectedModuleId, slotIndex);
                    }
                });

                context.on(slot, "dragover", function (event) {
                    if (!locked && !completed) {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                    }
                });

                context.on(slot, "drop", function (event) {
                    if (locked || completed) {
                        return;
                    }
                    event.preventDefault();
                    const moduleId = event.dataTransfer.getData("text/plain") || selectedModuleId;
                    if (CORE_MODULES[moduleId]) {
                        placeModule(moduleId, slotIndex);
                    }
                });
            });

            context.on(tray, "dragover", function (event) {
                if (!locked && !completed) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                }
            });

            context.on(tray, "drop", function (event) {
                if (locked || completed) {
                    return;
                }
                event.preventDefault();
                const moduleId = event.dataTransfer.getData("text/plain") || selectedModuleId;
                if (CORE_MODULES[moduleId]) {
                    clearDiagnostics();
                    returnModuleToTray(moduleId);
                    setSelected(null);
                    updateStatus();
                }
            });

            context.on(launchButton, "click", launchCore);
            context.on(resetButton, "click", resetPuzzle);
            context.on(continueButton, "click", function () {
                context.goTo("spaceport_route", {
                    checkpointId: "spaceport_route",
                    save: true,
                    saveReason: "Космопорт: начало расчёта маршрута"
                });
            });

            Object.keys(moduleElements).forEach(renderModule);

            if (completed) {
                finishSuccess();
            } else {
                updateStatus();
            }

            context.timeout(function () {
                screen.classList.add("spaceport-ready");
            }, 70);
        },

        unmount: function () {}
    };

    game.scenes.spaceport_route = {
        id: "spaceport_route",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            const screen = document.createElement("section");
            screen.className = "screen spaceport-screen spaceport-route-screen";

            const content = document.createElement("div");
            content.className = "screen-content spaceport-route-content";

            const header = document.createElement("div");
            header.className = "spaceport-route-header";
            header.innerHTML =
                "<span>ИСПЫТАНИЕ 2 ИЗ 3 · МАРШРУТ</span>" +
                "<strong>Найдите единственную схему вылета</strong>" +
                "<small>Каждая ракета, каждое окно и каждое направление используются ровно один раз.</small>";

            const workspace = document.createElement("div");
            workspace.className = "spaceport-route-workspace";

            const board = document.createElement("section");
            board.className = "route-board";

            const table = document.createElement("div");
            table.className = "route-table";

            // Сетка и четыре направления уже нарисованы на spaceport_route_bg.png.
            // Здесь остаются только 16 прозрачных интерактивных зон поверх клеток.
            const cells = [];
            for (let row = 0; row < 4; row += 1) {
                ROUTE_DESTINATIONS.forEach(function (destination, column) {
                    const cell = document.createElement("button");
                    cell.type = "button";
                    cell.className = "route-cell";
                    cell.dataset.row = String(row);
                    cell.dataset.destination = destination.id;
                    cell.dataset.column = String(column);
                    cell.setAttribute("aria-label", "Окно " + (row + 1) + ", направление " + destination.name);
                    table.appendChild(cell);
                    cells.push(cell);
                });
            }

            const tray = document.createElement("div");
            tray.className = "route-ship-tray";
            tray.innerHTML = "<span class=\"route-tray-label\">РАКЕТЫ</span>";

            const shipElements = {};
            const routeState = {};
            let selectedShipId = null;
            let locked = false;
            let completed = game.state.get().chapterProgress.spaceport >= 2;
            let failedChecks = 0;
            let hintIndex = 0;

            function createShip(shipId) {
                const data = ROUTE_SHIPS[shipId];
                const ship = document.createElement("button");
                ship.type = "button";
                ship.className = "route-ship route-ship-" + shipId;
                ship.dataset.shipId = shipId;
                ship.draggable = true;
                ship.style.setProperty("--ship-color", data.color);
                ship.setAttribute("aria-label", data.name + " ракета");

                const image = game.mechanics.createImage(
                    data.image,
                    "route-ship-image",
                    data.name + " ракета"
                );

                ship.appendChild(image);
                return ship;
            }

            ROUTE_SHIP_ORDER.forEach(function (shipId) {
                shipElements[shipId] = createShip(shipId);
                routeState[shipId] = { row: null, destination: null };
                tray.appendChild(shipElements[shipId]);
            });


            function clueShip(shipId, form) {
                const data = ROUTE_SHIPS[shipId];
                const text = form === "genitive" ? data.genitive : data.name + " ракета";
                return "<strong class=\"route-clue-ship-name route-clue-ship-" + shipId + "\">" + text + "</strong>";
            }

            function clueDestination(destinationId) {
                const destination = ROUTE_DESTINATIONS.find(function (item) {
                    return item.id === destinationId;
                });

                return "<span class=\"route-clue-destination\" title=\"" + destination.name + "\">" +
                    "<img src=\"" + destination.image + "\" alt=\"" + destination.name + "\">" +
                "</span>";
            }

            const clueHtml = [
                clueShip("cyan") + " стартует сразу после " + clueShip("violet", "genitive") + ".",
                "Рейс к " + clueDestination("vortex") + " начинается сразу после рейса к " + clueDestination("ring") + ".",
                clueShip("gold") + " отправляется позже " + clueShip("green", "genitive") + ".",
                "Рейс к " + clueDestination("crystal") + " выполняется раньше рейса к " + clueDestination("ring") + ".",
                clueShip("gold") + " не летит ни к " + clueDestination("ring") + ", ни к " + clueDestination("crystal") + ".",
                clueShip("green") + " не летит ни к " + clueDestination("ring") + ", ни к " + clueDestination("binary") + ".",
                clueShip("gold") + " вылетает сразу после рейса к " + clueDestination("vortex") + ".",
                clueShip("cyan") + " не направляется к " + clueDestination("vortex") + "."
            ];

            const clues = document.createElement("aside");
            clues.className = "route-clues";
            clues.innerHTML =
                "<div class=\"route-clues-title\"><span>ТЕЛЕМЕТРИЯ</span><strong>8 условий</strong></div>" +
                "<ol>" + clueHtml.map(function (clue) {
                    return "<li>" + clue + "</li>";
                }).join("") + "</ol>";

            const hintBox = document.createElement("div");
            hintBox.className = "route-hint-box";
            hintBox.hidden = true;

            const controls = document.createElement("div");
            controls.className = "route-controls";

            const status = document.createElement("div");
            status.className = "route-status";
            status.innerHTML =
                "<strong>0 / 4</strong>" +
                "<span>Разместите четыре ракеты в таблице и проверьте маршрут.</span>";

            const resetButton = game.mechanics.createButton("СБРОСИТЬ", "ghost-button route-reset-button");
            const hintButton = game.mechanics.createButton("ПОДСКАЗКА", "ghost-button route-hint-button");
            hintButton.hidden = true;
            const checkButton = game.mechanics.createButton("РАССЧИТАТЬ МАРШРУТ", "gold-button route-check-button");
            const continueButton = game.mechanics.createButton("К ЭНЕРГОКОНТУРУ", "gold-button route-continue-button");
            continueButton.hidden = true;

            controls.append(status, hintButton, resetButton, checkButton, continueButton);
            board.append(table, tray, controls);
            workspace.append(board, clues, hintBox);
            content.append(header, workspace);
            screen.append(
                game.ui.createHud(context, { title: "Космопорт · Маршрут", showPlayer: true }),
                content
            );
            root.appendChild(screen);

            function placedCount() {
                return Object.keys(routeState).filter(function (shipId) {
                    return routeState[shipId].row !== null;
                }).length;
            }

            function shipAt(row, destinationId) {
                return Object.keys(routeState).find(function (shipId) {
                    return routeState[shipId].row === row && routeState[shipId].destination === destinationId;
                }) || null;
            }

            function renderShip(shipId) {
                const ship = shipElements[shipId];
                const state = routeState[shipId];
                ship.classList.toggle("is-selected", selectedShipId === shipId);
                ship.classList.toggle("is-placed", state.row !== null);
            }

            function renderAllShips() {
                Object.keys(shipElements).forEach(renderShip);
            }

            function setSelected(shipId) {
                selectedShipId = shipId;
                renderAllShips();
            }

            function setStatus(message, countOverride) {
                const count = typeof countOverride === "number" ? countOverride : placedCount();
                status.querySelector("strong").textContent = count + " / 4";
                status.querySelector("span").textContent = message;
            }

            function updateStatus() {
                if (completed) {
                    setStatus("Маршрут подтверждён. Все четыре рейса совместимы с телеметрией.", 4);
                    return;
                }

                const count = placedCount();
                if (count < 4) {
                    setStatus("Разместите четыре ракеты в таблице и проверьте маршрут.", count);
                } else {
                    setStatus("Все ракеты размещены. Теперь проверьте всю схему целиком.", 4);
                }
            }

            function returnShipToTray(shipId) {
                routeState[shipId].row = null;
                routeState[shipId].destination = null;
                tray.appendChild(shipElements[shipId]);
                renderShip(shipId);
            }

            function placeShip(shipId, row, destinationId) {
                if (locked || completed || !shipId) {
                    return;
                }

                screen.classList.remove("route-check-failed");
                const occupant = shipAt(row, destinationId);
                if (occupant && occupant !== shipId) {
                    returnShipToTray(occupant);
                }

                routeState[shipId].row = row;
                routeState[shipId].destination = destinationId;
                const cell = cells.find(function (candidate) {
                    return Number(candidate.dataset.row) === row && candidate.dataset.destination === destinationId;
                });
                cell.appendChild(shipElements[shipId]);
                setSelected(null);
                renderShip(shipId);
                updateStatus();
            }

            function resetRoute() {
                if (locked || completed) {
                    return;
                }

                selectedShipId = null;
                screen.classList.remove("route-check-failed");
                hintBox.hidden = true;
                ROUTE_SHIP_ORDER.forEach(function (shipId) {
                    routeState[shipId].row = null;
                    routeState[shipId].destination = null;
                    tray.appendChild(shipElements[shipId]);
                });
                renderAllShips();
                updateStatus();
            }

            function routeTime(shipId) {
                return routeState[shipId].row === null ? null : routeState[shipId].row + 1;
            }

            function routeDestination(shipId) {
                return routeState[shipId].destination;
            }

            function timeForDestination(destinationId) {
                const shipId = Object.keys(routeState).find(function (candidate) {
                    return routeState[candidate].destination === destinationId;
                });
                return shipId ? routeTime(shipId) : null;
            }

            function hasUniqueRowsAndDestinations() {
                const rows = Object.keys(routeState).map(function (shipId) { return routeState[shipId].row; });
                const destinations = Object.keys(routeState).map(function (shipId) { return routeState[shipId].destination; });
                return new Set(rows).size === 4 && new Set(destinations).size === 4;
            }

            function evaluateConditions() {
                const conditions = [
                    routeTime("cyan") === routeTime("violet") + 1,
                    timeForDestination("vortex") === timeForDestination("ring") + 1,
                    routeTime("gold") > routeTime("green"),
                    timeForDestination("crystal") < timeForDestination("ring"),
                    routeDestination("gold") !== "ring" && routeDestination("gold") !== "crystal",
                    routeDestination("green") !== "ring" && routeDestination("green") !== "binary",
                    routeTime("gold") === timeForDestination("vortex") + 1,
                    routeDestination("cyan") !== "vortex"
                ];
                return conditions.filter(Boolean).length;
            }

            function fillSolution() {
                ROUTE_SHIP_ORDER.forEach(function (shipId) {
                    const target = ROUTE_SOLUTION[shipId];
                    routeState[shipId].row = target.row;
                    routeState[shipId].destination = target.destination;
                    const cell = cells.find(function (candidate) {
                        return Number(candidate.dataset.row) === target.row && candidate.dataset.destination === target.destination;
                    });
                    cell.appendChild(shipElements[shipId]);
                    renderShip(shipId);
                });
            }

            function finishRoute() {
                completed = true;
                locked = false;
                screen.classList.remove("route-checking", "route-check-failed");
                screen.classList.add("route-complete");
                cells.forEach(function (cell) { cell.classList.add("is-confirmed"); });
                checkButton.hidden = true;
                resetButton.hidden = true;
                hintButton.hidden = true;
                hintBox.hidden = true;
                continueButton.hidden = false;
                setStatus("Маршрут подтверждён. Все четыре рейса совместимы с телеметрией.", 4);

                const currentProgress = game.state.get().chapterProgress;
                if (currentProgress.spaceport < 2) {
                    game.state.patch({
                        chapterProgress: {
                            ...currentProgress,
                            spaceport: 2
                        }
                    });
                    game.save.write("Космопорт: маршрут рассчитан");
                }

                continueButton.focus();
            }

            function checkRoute() {
                if (locked || completed) {
                    return;
                }

                if (placedCount() !== 4) {
                    setStatus("Сначала разместите все четыре ракеты.");
                    return;
                }

                locked = true;
                checkButton.disabled = true;
                screen.classList.remove("route-check-failed");
                screen.classList.add("route-checking");
                setStatus("Система сравнивает таблицу с восемью условиями телеметрии…", 4);

                context.timeout(function () {
                    const unique = hasUniqueRowsAndDestinations();
                    const passed = unique ? evaluateConditions() : 0;

                    if (unique && passed === clueHtml.length) {
                        finishRoute();
                        return;
                    }

                    locked = false;
                    failedChecks += 1;
                    game.hints.recordError("spaceport_route");
                    screen.classList.remove("route-checking");
                    screen.classList.add("route-check-failed");
                    checkButton.disabled = false;
                    hintButton.hidden = false;

                    if (!unique) {
                        setStatus("Схема противоречива: каждое окно и каждое направление должны использоваться ровно один раз.", 4);
                    } else {
                        setStatus("Совместимы " + passed + " из " + clueHtml.length + " условий. Где-то в таблице осталось противоречие.", 4);
                    }
                }, 650);
            }

            function showHint() {
                if (completed) {
                    return;
                }
                const availableIndex = Math.min(Math.max(failedChecks - 1, hintIndex), ROUTE_HINTS.length - 1);
                hintBox.hidden = false;
                hintBox.textContent = ROUTE_HINTS[availableIndex];
                hintIndex = Math.min(availableIndex + 1, ROUTE_HINTS.length - 1);
            }

            Object.keys(shipElements).forEach(function (shipId) {
                const ship = shipElements[shipId];

                context.on(ship, "click", function (event) {
                    event.stopPropagation();
                    if (locked || completed) {
                        return;
                    }
                    setSelected(selectedShipId === shipId ? null : shipId);
                });

                context.on(ship, "dragstart", function (event) {
                    if (locked || completed) {
                        event.preventDefault();
                        return;
                    }
                    selectedShipId = shipId;
                    renderShip(shipId);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", shipId);
                });
            });

            cells.forEach(function (cell) {
                const row = Number(cell.dataset.row);
                const destinationId = cell.dataset.destination;

                context.on(cell, "click", function () {
                    if (selectedShipId) {
                        placeShip(selectedShipId, row, destinationId);
                    }
                });

                context.on(cell, "dragover", function (event) {
                    if (!locked && !completed) {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                    }
                });

                context.on(cell, "drop", function (event) {
                    if (locked || completed) {
                        return;
                    }
                    event.preventDefault();
                    const shipId = event.dataTransfer.getData("text/plain") || selectedShipId;
                    if (ROUTE_SHIPS[shipId]) {
                        placeShip(shipId, row, destinationId);
                    }
                });
            });

            context.on(tray, "dragover", function (event) {
                if (!locked && !completed) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                }
            });

            context.on(tray, "drop", function (event) {
                if (locked || completed) {
                    return;
                }
                event.preventDefault();
                const shipId = event.dataTransfer.getData("text/plain") || selectedShipId;
                if (ROUTE_SHIPS[shipId]) {
                    returnShipToTray(shipId);
                    setSelected(null);
                    updateStatus();
                }
            });

            context.on(resetButton, "click", resetRoute);
            context.on(checkButton, "click", checkRoute);
            context.on(hintButton, "click", showHint);
            context.on(continueButton, "click", function () {
                context.goTo("spaceport_energy", {
                    checkpointId: "spaceport_energy",
                    save: true,
                    saveReason: "Космопорт: начало восстановления энергоконтура"
                });
            });

            if (completed) {
                fillSolution();
                finishRoute();
            } else {
                updateStatus();
            }

            context.timeout(function () {
                screen.classList.add("spaceport-ready");
            }, 70);
        },

        unmount: function () {}
    };

    game.scenes.spaceport_energy = {
        id: "spaceport_energy",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            const completed = game.state.get().chapterProgress.spaceport >= 3;
            const screen = document.createElement("section");
            screen.className = "screen spaceport-screen spaceport-energy-screen";
            if (completed) {
                screen.classList.add("energy-complete");
            }

            const content = document.createElement("div");
            content.className = "screen-content spaceport-energy-content";

            const header = document.createElement("div");
            header.className = "spaceport-energy-header";
            header.innerHTML =
                "<span>ИСПЫТАНИЕ 3 ИЗ 3 · ЭНЕРГОКОНТУР</span>" +
                "<strong>Запустите все три системы</strong>" +
                "<small>Поверните трассы. Красный узел повреждён. Плитки с одинаковой меткой связаны.</small>";

            const stage = document.createElement("div");
            stage.className = "energy-stage";

            const grid = document.createElement("div");
            grid.className = "energy-grid";

            const tileElements = {};
            const rotations = {};
            let checking = false;
            let solved = completed;
            let failedChecks = 0;
            let hintIndex = 0;

            function tileIdAt(row, column) {
                return "r" + row + "c" + column;
            }

            function parseTileId(tileId) {
                const match = /^r(\d)c(\d)$/.exec(tileId);
                return match ? { row: Number(match[1]), column: Number(match[2]) } : null;
            }

            function rotateDirection(direction, rotation) {
                const index = ENERGY_DIRECTIONS.indexOf(direction);
                return ENERGY_DIRECTIONS[(index + rotation + 4) % 4];
            }

            function getEdges(tileId) {
                const data = ENERGY_TILES[tileId];
                return data.edges.map(function (edge) {
                    return rotateDirection(edge, rotations[tileId]);
                });
            }

            function createPipeRotor(data) {
                const rotor = document.createElement("div");
                rotor.className = "energy-tile-rotor";

                data.edges.forEach(function (edge) {
                    const arm = document.createElement("span");
                    arm.className = "energy-pipe-arm energy-pipe-" + edge.toLowerCase();
                    rotor.appendChild(arm);
                });

                const hub = document.createElement("span");
                hub.className = "energy-pipe-hub";
                rotor.appendChild(hub);
                return rotor;
            }

            function renderTile(tileId) {
                const tile = tileElements[tileId];
                if (!tile) {
                    return;
                }
                tile.style.setProperty("--tile-rotation", (rotations[tileId] * 90) + "deg");
                tile.setAttribute("aria-label", "Плитка " + tileId + ", поворот " + (rotations[tileId] * 90) + " градусов");
            }

            function clearTrace() {
                screen.classList.remove("energy-check-failed");
                Object.keys(tileElements).forEach(function (tileId) {
                    tileElements[tileId].classList.remove("is-reached", "is-break", "is-hinted");
                });
            }

            function rotateTile(tileId, delta, fromPair) {
                if (checking || solved || !ENERGY_TILES[tileId]) {
                    return;
                }

                clearTrace();
                rotations[tileId] = (rotations[tileId] + delta + 4) % 4;
                renderTile(tileId);

                const pairKey = ENERGY_TILES[tileId].pair;
                if (pairKey && !fromPair) {
                    const partnerId = ENERGY_PAIR_TILES[pairKey].find(function (candidate) {
                        return candidate !== tileId;
                    });
                    rotations[partnerId] = (rotations[partnerId] - delta + 4) % 4;
                    renderTile(partnerId);
                    tileElements[partnerId].classList.add("is-pair-reacting");
                    context.timeout(function () {
                        if (tileElements[partnerId]) {
                            tileElements[partnerId].classList.remove("is-pair-reacting");
                        }
                    }, 280);
                }
            }

            for (let row = 0; row < 4; row += 1) {
                for (let column = 0; column < 4; column += 1) {
                    const tileId = tileIdAt(row, column);

                    if (tileId === ENERGY_BLOCKED) {
                        const blocked = document.createElement("div");
                        blocked.className = "energy-blocked-tile";
                        blocked.innerHTML = "<span>×</span><small>ПОВРЕЖДЕНО</small>";
                        grid.appendChild(blocked);
                        continue;
                    }

                    const data = ENERGY_TILES[tileId];
                    rotations[tileId] = completed ? 0 : data.rotation;

                    const tile = document.createElement("button");
                    tile.type = "button";
                    tile.className = "energy-tile";
                    tile.dataset.tileId = tileId;
                    tile.appendChild(createPipeRotor(data));

                    if (data.pair) {
                        const pair = document.createElement("span");
                        pair.className = "energy-pair-badge energy-pair-" + data.pair.toLowerCase();
                        pair.textContent = data.pair;
                        pair.title = "Связанная пара " + data.pair;
                        tile.appendChild(pair);
                    }

                    context.on(tile, "click", function () {
                        rotateTile(tileId, 1, false);
                    });

                    tileElements[tileId] = tile;
                    grid.appendChild(tile);
                    renderTile(tileId);
                }
            }

            const source = document.createElement("div");
            source.className = "energy-source-terminal";
            source.innerHTML = "<span></span><strong>ИСТОЧНИК</strong>";

            const outputs = document.createElement("div");
            outputs.className = "energy-output-statuses";
            ENERGY_OUTPUTS.forEach(function (output) {
                const item = document.createElement("div");
                item.className = "energy-output-status energy-output-" + output.key;
                item.dataset.output = output.key;
                item.innerHTML = "<span></span><strong>" + output.label + "</strong>";
                outputs.appendChild(item);
            });

            const controls = document.createElement("div");
            controls.className = "energy-controls";

            const status = document.createElement("div");
            status.className = "energy-status";
            status.innerHTML =
                "<strong>КОНТУР НЕ ПРОВЕРЕН</strong>" +
                "<span>Клик по плитке поворачивает её на 90°. Связанные пары двигаются вместе.</span>";

            const buttonRow = document.createElement("div");
            buttonRow.className = "energy-button-row";
            const hintButton = game.mechanics.createButton("ПОДСКАЗКА", "ghost-button energy-hint-button");
            hintButton.hidden = true;
            const resetButton = game.mechanics.createButton("СБРОСИТЬ", "ghost-button energy-reset-button");
            const checkButton = game.mechanics.createButton("ЗАПУСТИТЬ КОНТУР", "gold-button energy-check-button");
            const logButton = game.mechanics.createButton("ОТКРЫТЬ ЖУРНАЛ", "gold-button energy-log-button");
            logButton.hidden = !completed;
            buttonRow.append(hintButton, resetButton, checkButton, logButton);

            const hintBox = document.createElement("div");
            hintBox.className = "energy-hint-box";
            hintBox.hidden = true;

            controls.append(status, hintBox, buttonRow);
            stage.append(source, grid, outputs, controls);
            content.append(header, stage);
            screen.append(
                game.ui.createHud(context, { title: "Космопорт · Энергоконтур", showPlayer: true }),
                content
            );
            root.appendChild(screen);

            function getExternalRule(tileId, side) {
                if (tileId === ENERGY_SOURCE.tileId && side === ENERGY_SOURCE.side) {
                    return "source";
                }
                const output = ENERGY_OUTPUTS.find(function (candidate) {
                    return candidate.tileId === tileId && candidate.side === side;
                });
                return output ? output.key : null;
            }

            function neighborFor(tileId, side) {
                const pos = parseTileId(tileId);
                const delta = ENERGY_DELTAS[side];
                const row = pos.row + delta[0];
                const column = pos.column + delta[1];
                if (row < 0 || row > 3 || column < 0 || column > 3) {
                    return null;
                }
                return tileIdAt(row, column);
            }

            function analyzeCircuit() {
                const mismatches = [];

                Object.keys(ENERGY_TILES).forEach(function (tileId) {
                    const edges = getEdges(tileId);
                    ENERGY_DIRECTIONS.forEach(function (side) {
                        const neighborId = neighborFor(tileId, side);
                        const hasEdge = edges.indexOf(side) !== -1;

                        if (!neighborId) {
                            const rule = getExternalRule(tileId, side);
                            if (hasEdge !== Boolean(rule)) {
                                mismatches.push({ tileId: tileId, side: side, type: rule ? "missing-terminal" : "open-border" });
                            }
                            return;
                        }

                        if (neighborId === ENERGY_BLOCKED) {
                            if (hasEdge) {
                                mismatches.push({ tileId: tileId, side: side, type: "damaged" });
                            }
                            return;
                        }

                        const neighborEdges = getEdges(neighborId);
                        const neighborHas = neighborEdges.indexOf(ENERGY_OPPOSITE[side]) !== -1;
                        if (hasEdge !== neighborHas) {
                            mismatches.push({ tileId: tileId, side: side, neighborId: neighborId, type: "mismatch" });
                        }
                    });
                });

                const reached = new Set();
                const queue = [];
                if (getEdges(ENERGY_SOURCE.tileId).indexOf(ENERGY_SOURCE.side) !== -1) {
                    reached.add(ENERGY_SOURCE.tileId);
                    queue.push(ENERGY_SOURCE.tileId);
                }

                while (queue.length) {
                    const tileId = queue.shift();
                    const edges = getEdges(tileId);
                    edges.forEach(function (side) {
                        const neighborId = neighborFor(tileId, side);
                        if (!neighborId || neighborId === ENERGY_BLOCKED || !ENERGY_TILES[neighborId]) {
                            return;
                        }
                        const neighborEdges = getEdges(neighborId);
                        if (neighborEdges.indexOf(ENERGY_OPPOSITE[side]) === -1) {
                            return;
                        }
                        if (!reached.has(neighborId)) {
                            reached.add(neighborId);
                            queue.push(neighborId);
                        }
                    });
                }

                const poweredOutputs = {};
                ENERGY_OUTPUTS.forEach(function (output) {
                    poweredOutputs[output.key] = reached.has(output.tileId) && getEdges(output.tileId).indexOf(output.side) !== -1;
                });

                const allOutputs = ENERGY_OUTPUTS.every(function (output) {
                    return poweredOutputs[output.key];
                });
                const success = mismatches.length === 0 && reached.size === Object.keys(ENERGY_TILES).length && allOutputs;

                return {
                    success: success,
                    reached: reached,
                    mismatches: mismatches,
                    poweredOutputs: poweredOutputs
                };
            }

            function updateOutputStatus(poweredOutputs) {
                ENERGY_OUTPUTS.forEach(function (output) {
                    const element = outputs.querySelector('[data-output="' + output.key + '"]');
                    element.classList.toggle("is-powered", Boolean(poweredOutputs && poweredOutputs[output.key]));
                });
            }

            function setStatus(title, message) {
                status.querySelector("strong").textContent = title;
                status.querySelector("span").textContent = message;
            }

            function firstReachedBreak(result) {
                return result.mismatches.find(function (issue) {
                    return result.reached.has(issue.tileId);
                }) || result.mismatches[0] || null;
            }

            function describeBreak(issue) {
                if (!issue) {
                    return "Импульс не смог построить непрерывный путь от источника.";
                }
                if (issue.type === "damaged") {
                    return "Импульс упёрся в повреждённый красный узел.";
                }
                if (issue.type === "open-border") {
                    return "Одна из трасс уходит за пределы энергополя.";
                }
                if (issue.type === "missing-terminal") {
                    return "Один из внешних разъёмов не подключён к трассе.";
                }
                return "Импульс оборвался на стыке двух соседних плиток.";
            }

            function resetPuzzle() {
                if (checking || solved) {
                    return;
                }
                Object.keys(ENERGY_TILES).forEach(function (tileId) {
                    rotations[tileId] = ENERGY_TILES[tileId].rotation;
                    renderTile(tileId);
                });
                clearTrace();
                updateOutputStatus(null);
                hintBox.hidden = true;
                setStatus("КОНТУР СБРОШЕН", "Плитки возвращены в исходное положение.");
            }

            function finishEnergy() {
                solved = true;
                checking = false;
                screen.classList.remove("energy-checking", "energy-check-failed");
                screen.classList.add("energy-complete");
                Object.keys(tileElements).forEach(function (tileId) {
                    rotations[tileId] = 0;
                    renderTile(tileId);
                    tileElements[tileId].classList.add("is-reached");
                    tileElements[tileId].disabled = true;
                });
                updateOutputStatus({ engine: true, shield: true, navigation: true });
                setStatus("ЭНЕРГОКОНТУР ЗАПУЩЕН", "Двигатель, щит и навигация получают питание. Корабль выходит из зоны разлома.");
                checkButton.hidden = true;
                resetButton.hidden = true;
                hintButton.hidden = true;
                hintBox.hidden = true;
                logButton.hidden = false;

                const currentProgress = game.state.get().chapterProgress;
                if (currentProgress.spaceport < 3) {
                    game.state.patch({
                        chapterProgress: {
                            ...currentProgress,
                            spaceport: 3
                        }
                    });
                    game.save.write("Космопорт: энергоконтур восстановлен");
                }

                context.timeout(function () {
                    screen.classList.add("energy-reveal-art");
                }, 700);
                context.timeout(function () {
                    logButton.focus();
                }, 1350);
            }

            function checkCircuit() {
                if (checking || solved) {
                    return;
                }
                checking = true;
                clearTrace();
                screen.classList.add("energy-checking");
                checkButton.disabled = true;
                setStatus("ПУСК ИМПУЛЬСА…", "Система проверяет путь от источника к трём узлам.");

                context.timeout(function () {
                    const result = analyzeCircuit();
                    result.reached.forEach(function (tileId) {
                        if (tileElements[tileId]) {
                            tileElements[tileId].classList.add("is-reached");
                        }
                    });
                    updateOutputStatus(result.poweredOutputs);

                    if (result.success) {
                        finishEnergy();
                        return;
                    }

                    checking = false;
                    failedChecks += 1;
                    game.hints.recordError("spaceport_energy");
                    screen.classList.remove("energy-checking");
                    screen.classList.add("energy-check-failed");
                    checkButton.disabled = false;
                    hintButton.hidden = false;

                    const issue = firstReachedBreak(result);
                    if (issue && tileElements[issue.tileId]) {
                        tileElements[issue.tileId].classList.add("is-break");
                    }
                    setStatus(
                        "ИМПУЛЬС: " + result.reached.size + " / " + Object.keys(ENERGY_TILES).length,
                        describeBreak(issue)
                    );
                }, 720);
            }

            function showHint() {
                if (solved) {
                    return;
                }
                const available = Math.min(Math.max(failedChecks - 1, hintIndex), ENERGY_HINTS.length - 1);
                hintBox.hidden = false;
                hintBox.textContent = ENERGY_HINTS[available];
                hintIndex = Math.min(available + 1, ENERGY_HINTS.length - 1);

                if (available >= 1) {
                    ["r2c0", "r1c1", "r2c2", "r3c1"].forEach(function (tileId) {
                        if (tileElements[tileId]) {
                            tileElements[tileId].classList.add("is-hinted");
                        }
                    });
                }
            }

            context.on(resetButton, "click", resetPuzzle);
            context.on(checkButton, "click", checkCircuit);
            context.on(hintButton, "click", showHint);
            context.on(logButton, "click", function () {
                context.goTo("spaceport_clue", {
                    checkpointId: "spaceport_clue",
                    save: true,
                    saveReason: "Космопорт: обнаружен системный журнал кости"
                });
            });

            if (completed) {
                Object.keys(tileElements).forEach(function (tileId) {
                    rotations[tileId] = 0;
                    renderTile(tileId);
                    tileElements[tileId].disabled = true;
                });
                updateOutputStatus({ engine: true, shield: true, navigation: true });
                setStatus("ЭНЕРГОКОНТУР ЗАПУЩЕН", "Все три системы получают питание.");
                checkButton.hidden = true;
                resetButton.hidden = true;
                hintButton.hidden = true;
                logButton.hidden = false;
                screen.classList.add("energy-reveal-art");
            }

            context.timeout(function () {
                screen.classList.add("spaceport-ready");
            }, 70);
        },

        unmount: function () {}
    };

    game.scenes.spaceport_clue = {
        id: "spaceport_clue",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            let copied = false;
            let voiceBusy = false;

            const screen = document.createElement("section");
            screen.className = "screen spaceport-screen spaceport-clue-screen";

            const content = document.createElement("div");
            content.className = "screen-content spaceport-clue-content";

            const intro = document.createElement("div");
            intro.className = "spaceport-clue-intro";
            intro.innerHTML =
                "<span>СИСТЕМА ПОРТА</span>" +
                "<strong>Навигация восстановлена.</strong>" +
                "<small>Обнаружен служебный журнал Кости перехода.</small>";

            const windowCard = document.createElement("article");
            windowCard.className = "spaceport-log-window";
            windowCard.hidden = true;
            windowCard.innerHTML =
                "<div class=\"spaceport-log-head\"><span>СИСТЕМНЫЙ ЖУРНАЛ · КОСТЬ ПЕРЕХОДА</span><b>ДОСТУП НЕ РАЗРЕШЁН</b></div>" +
                "<div class=\"spaceport-log-lines\">" +
                    "<p class=\"is-next\"><i>СЛЕДУЮЩИЙ БРОСОК</i><strong>3</strong><small>записан до активации</small></p>" +
                    "<p><i>БРОСОК +1</i><strong>2</strong><small>результат закреплён</small></p>" +
                    "<p><i>БРОСОК +2</i><strong>4</strong><small>результат закреплён</small></p>" +
                    "<p><i>БРОСОК +3</i><strong>1</strong><small>результат закреплён</small></p>" +
                "</div>" +
                "<p class=\"spaceport-log-warning\">Результаты существуют раньше самих бросков.</p>";

            const reaction = document.createElement("div");
            reaction.className = "spaceport-clue-reaction";
            reaction.innerHTML =
                "<span class=\"speaker-taku\">ТаКу</span>" +
                "<p>Так. А вот это уже не вероятность.</p>";

            const intrusion = document.createElement("div");
            intrusion.className = "spaceport-clue-intrusion";
            intrusion.hidden = true;
            intrusion.innerHTML =
                "<span>ВЕДУЩИЙ</span>" +
                "<strong>Служебное окно. Закрыть.</strong>";

            const result = document.createElement("div");
            result.className = "spaceport-log-result";
            result.hidden = true;
            result.innerHTML =
                "<strong>ФРАГМЕНТ СОХРАНЁН</strong>" +
                "<span>ТаКу успела спрятать копию внутри своей сетки.</span>";

            const actionButton = game.mechanics.createButton(
                "СОХРАНИТЬ ФРАГМЕНТ",
                "gold-button spaceport-log-save"
            );
            actionButton.hidden = true;

            content.append(
                intro,
                windowCard,
                reaction,
                intrusion,
                result,
                actionButton
            );

            screen.append(
                game.ui.createHud(context, {
                    title: "Космопорт · Системный журнал",
                    showPlayer: true
                }),
                content
            );

            root.appendChild(screen);

            function playVoice(src) {
                return new Promise(function (resolve) {
                    const audio = new Audio("assets/audio/" + src);

                    let finished = false;
                    let timer = null;

                    function done() {
                        if (finished) return;
                        finished = true;

                        if (timer) {
                            clearTimeout(timer);
                        }

                        audio.onended = null;
                        audio.onerror = null;
                        audio.onloadedmetadata = null;

                        resolve();
                    }

                    audio.onended = done;
                    audio.onerror = done;

                    audio.onloadedmetadata = function () {
                        // Запасной выход: если ended по какой-то причине
                        // не придёт, Promise всё равно завершится.
                        timer = setTimeout(done, (audio.duration * 1000) + 300);
                    };

                    audio.play().catch(done);
                });
            }

            function pause(ms) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                });
            }

            async function playIntroVoices() {
                if (voiceBusy) return;
                voiceBusy = true;

                await pause(450);
                await playVoice("spaceport_system_02.mp3");

                await pause(650);
                await playVoice("spaceport_system_03.mp3");

                // После system_03 появляется журнал
                windowCard.hidden = false;

                await pause(1100);
                await playVoice("spaceport_taku_03.mp3");

                // После taku_03 исчезает реплика ТаКу
                reaction.hidden = true;

                // После taku_03 появляется кнопка
                actionButton.hidden = false;

                await pause(500);

                voiceBusy = false;
            }

            async function playCopyVoices() {
                if (voiceBusy) return;
                voiceBusy = true;

                await pause(700);
                await playVoice("spaceport_taku_04.mp3");

                // После taku_04 исчезает сообщение о сохранении
                result.hidden = true;

                await pause(900);

                // Голос Ведущего начинается без визуального блока
                await playVoice("spaceport_host_03.mp3");

                await pause(850);

                // Ведущий появляется одновременно с host_04
                intrusion.hidden = false;
                screen.classList.add("spaceport-host-interrupt");

                await playVoice("spaceport_host_04.mp3");

                await pause(500);

                screen.classList.add("spaceport-log-closed");

                actionButton.disabled = false;
                actionButton.textContent = "ДАЛЬШЕ";
                voiceBusy = false;
                actionButton.focus();
            }

            context.on(actionButton, "click", function () {
              
                if (copied) {
                    if (voiceBusy) return;

                    context.goTo("spaceport_outro", {
                        checkpointId: "spaceport_outro",
                        save: true,
                        saveReason: "Космопорт: журнал кости сохранён"
                    });

                    return;
                }
                copied = true;
                actionButton.disabled = true;

                screen.classList.add("spaceport-log-copied");
                result.hidden = false;

                playCopyVoices();
            });

            context.timeout(function () {
                screen.classList.add("spaceport-ready");
                playIntroVoices();
            }, 700);
        },

        unmount: function () {}
    };

    game.scenes.spaceport_outro = {
        id: "spaceport_outro",

        mount: function (root, context) {
            game.state.patch({ activePlayer: "taku" });

            const currentSeals = game.state.get().seals;
            const currentProgress = game.state.get().chapterProgress;

            if (!currentSeals.logic || currentProgress.spaceport < 3) {
                game.state.patch({
                    seals: {
                        ...currentSeals,
                        logic: true
                    },
                    chapterProgress: {
                        ...currentProgress,
                        spaceport: 3
                    }
                });
                game.save.write("Космопорт пройден: Печать Навигации получена");
            }

            const lines = [
                {
                    speaker: "СИСТЕМА ПОРТА",
                    tone: "system",
                    text: "Маршрут восстановлен. Система порта функционирует в штатном режиме. За восстановление навигационного контура объекту «Таблица Ку» присваивается Печать Навигации."
                }
            ];

            let lineIndex = 0;

            const screen = document.createElement("section");
            screen.className = "screen spaceport-screen spaceport-outro-screen";

            const content = document.createElement("div");
            content.className = "screen-content spaceport-outro-content";

            const seal = document.createElement("div");
            seal.className = "spaceport-logic-seal";
            seal.innerHTML =
                "<span class=\"logic-seal-ring ring-a\"></span>" +
                "<span class=\"logic-seal-ring ring-b\"></span>" +
                "<img src=\"assets/images/spaceport_logic_seal.png\" alt=\"Печать Логики\">";

            const dialogue = document.createElement("article");
            dialogue.className = "spaceport-outro-dialogue";
            dialogue.innerHTML =
                "<span class=\"spaceport-outro-speaker\"></span>" +
                "<p class=\"spaceport-outro-line\"></p>";

            const nextButton = game.mechanics.createButton("ДАЛЬШЕ", "gold-button spaceport-outro-next");
            nextButton.disabled = true;
            content.append(seal, dialogue, nextButton);
            screen.append(
                game.ui.createHud(context, { title: "Космопорт · Печать Навигации", showPlayer: true }),
                content
            );
            root.appendChild(screen);

            function playVoice(src) {
                return new Promise(function (resolve) {
                    const audio = new Audio("assets/audio/" + src);

                    let finished = false;
                    let timer = null;

                    function done() {
                        if (finished) return;
                        finished = true;

                        if (timer) {
                            clearTimeout(timer);
                        }

                        audio.onended = null;
                        audio.onerror = null;
                        audio.onloadedmetadata = null;

                        resolve();
                    }

                    audio.onended = done;
                    audio.onerror = done;

                    audio.onloadedmetadata = function () {
                        timer = setTimeout(done, (audio.duration * 1000) + 300);
                    };

                    audio.play().catch(done);
                });
            }
            function pause(ms) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                });
            }

            function renderLine() {
                const line = lines[lineIndex];
                const speaker = dialogue.querySelector(".spaceport-outro-speaker");
                const text = dialogue.querySelector(".spaceport-outro-line");

                dialogue.dataset.tone = line.tone;
                speaker.textContent = line.speaker;
                text.textContent = line.text;

                dialogue.classList.remove("line-flash");
                void dialogue.offsetWidth;
                dialogue.classList.add("line-flash");

                if (lineIndex === lines.length - 1) {
                    nextButton.textContent = "ВЕРНУТЬСЯ НА ПОЛЕ";
                }
            }

            context.on(nextButton, "click", function () {
                if (lineIndex < lines.length - 1) {
                    lineIndex += 1;
                    renderLine();
                    return;
                }

                if (game.spaceportMusic) {
                    game.spaceportMusic.pause();
                    game.spaceportMusic.currentTime = 0;
                    game.spaceportMusic = null;
                }

                context.goTo("board_after_spaceport", {
                    checkpointId: "board_after_spaceport",
                    save: true,
                    saveReason: "возвращение на поле после Космопорта"
                });
            });

            renderLine();

            context.timeout(async function () {
                screen.classList.add("spaceport-ready", "spaceport-seal-ready");

                await playVoice("spaceport_system_04.mp3");
                seal.classList.add("navigation-pulse");
                await pause(650);
                await playVoice("spaceport_taku_05.mp3");
                await pause(650);
                await playVoice("spaceport_host_05.mp3");
                await pause(650);
                await playVoice("spaceport_taku_06.mp3");
                await pause(650);
                await playVoice("spaceport_tuko_02.mp3");

                nextButton.textContent = "ВЕРНУТЬСЯ НА ПОЛЕ";
                nextButton.disabled = false;
                nextButton.focus();
            }, 80);
        },

        unmount: function () {}
    };

})(window);
