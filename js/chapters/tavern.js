(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    game.scenes = game.scenes || {};
    game.chapters = game.chapters || {};
    game.chapters.tavern = { id: "tavern", status: "in-progress" };

    const images = {
        entrance: "assets/images/tavern_entrance_bg.png",
        constellationStar: "assets/images/constellation_star.png",
        sealBalance: "assets/images/balance_seal.png",
        bartender: "assets/images/tavern_bartender.png",
        guests: "assets/images/tavern_guests.png",
        goblet: "assets/images/tavern_goblet.png",
        smoke: "assets/images/tavern_constellation_bg.png",
        constellationUrsa: "assets/images/constellation_ursa.png",
        constellationLibra: "assets/images/constellation_libra.png",
        constellationOrion: "assets/images/constellation_orion.png",
        balance: "assets/images/tavern_task3_balance_bg.png",
        tray: "assets/images/tavern_task3_tray.png",
        stitch: "assets/images/stitch_idle.png"
    };

    const tavernAmbience = "assets/audio/tavern_ambience.ogg";

    const ingredients = [
        { id: "moon", label: "Луна", icon: "🌙", color: "#aa7cff", image: "assets/images/tavern_bottle_moon.png" },
        { id: "flame", label: "Пламя", icon: "🔥", color: "#ff7847", image: "assets/images/tavern_bottle_flame.png" },
        { id: "wave", label: "Волна", icon: "🌊", color: "#54d8ff", image: "assets/images/tavern_bottle_wave.png" },
        { id: "root", label: "Корень", icon: "🌿", color: "#76dc69", image: "assets/images/tavern_bottle_root.png" },
        { id: "star", label: "Звезда", icon: "⭐", color: "#ffd86a", image: "assets/images/tavern_bottle_star.png" },
        { id: "dew", label: "Роса", icon: "💧", color: "#71f4e8", image: "assets/images/tavern_bottle_dew.png" }
    ];

    const guests = [
        {
            id: "mermaid",
            label: "Русалка",
            recipe: ["wave", "moon"],
            color: "#5ad9ff"
        },
        {
            id: "orc",
            label: "Орк",
            recipe: ["flame", "root"],
            color: "#ff8c55"
        },
        {
            id: "elf",
            label: "Эльф",
            recipe: ["dew", "star"],
            color: "#a6ef77"
        }
    ];

    const errorEffects = [
        "Пена добралась до потолка. Грош делает вид, что так и было задумано.",
        "Над бокалом собралась маленькая гроза и очень лично на вас обиделась.",
        "Бокал сообщил результат задом наперёд. Понимать его необязательно."
    ];

    function ingredientById(id) {
        return ingredients.find(function (ingredient) {
            return ingredient.id === id;
        });
    }

    function sameRecipe(actual, expected) {
        if (actual.length !== expected.length) {
            return false;
        }

        return expected.every(function (ingredient) {
            return actual.includes(ingredient);
        });
    }

    function playTavernAmbience() {
        game.audio.playLoop("ambience", tavernAmbience);
    }

    game.scenes.tavern_arrival = {
        id: "tavern_arrival",

        mount: function (root, context) {
            const screen = document.createElement("section");
            screen.className = "screen tavern-arrival-screen";

            const view = document.createElement("div");
            view.className = "tavern-arrival-view";

            

            const callButton = document.createElement("button");
            callButton.type = "button";
            callButton.className = "tavern-grosh-call";
            callButton.setAttribute("aria-label", "Грош зовёт ТуКо к стойке");
            callButton.innerHTML =
                "<span class=\"grosh-call-wave\" aria-hidden=\"true\">☝</span>" +
                "<span class=\"grosh-call-copy\"><strong>ГРОШ</strong><b>ТуКо! Сюда.</b><small>ПОДОЙТИ К СТОЙКЕ</small></span>";

            context.on(callButton, "click", function () {
                if (screen.classList.contains("tavern-arrival-leaving")) {
                    return;
                }

                screen.classList.add("tavern-arrival-leaving");
                callButton.disabled = true;
                game.ui.showSubtitle("Грош подзывает ТуКо к стойке. Кажется, у него уже есть для неё работа.");

                context.timeout(function () {
                    context.goTo("tavern_intro", {
                        checkpointId: "tavern_intro",
                        save: true,
                        saveReason: "разговор с Грошем"
                    });
                }, 900);
            });

            view.append(callButton);
            screen.append(view);
            root.appendChild(screen);

            playTavernAmbience();

            context.timeout(function () {
                screen.classList.add("tavern-arrival-visible");
            }, 60);

            context.timeout(function () {
                screen.classList.add("tavern-arrival-called");
                game.ui.showSubtitle("Сквозь гул голосов, звон стекла и треск порталов слышится знакомое: «ТуКо! Сюда».");
                callButton.focus();
            }, 500);
        },

        unmount: function () {}
    };

    game.scenes.tavern_intro = {
        id: "tavern_intro",

        mount: function (root, context) {
            const screen = document.createElement("section");
            screen.className = "screen tavern-screen tavern-intro-screen";

            const content = document.createElement("div");
            content.className = "tavern-intro-content";

            const card = document.createElement("article");
            card.className = "tavern-intro-card panel";
            card.innerHTML =
                "<p>Все порталы сегодня ведут не туда, напитки заказывают без слов, а посетители уже начинают терять терпение.</p>" +
                "<blockquote>«Три заказа. Шесть бутылок. Ни одной причины испортить мою стойку».</blockquote>";

            const startButton = game.mechanics.createButton("ПРИНЯТЬ СМЕНУ", "gold-button");
            context.on(startButton, "click", function () {
                context.goTo("tavern_orders", {
                    checkpointId: "tavern_orders",
                    save: true,
                    saveReason: "Таверна: заказы без слов"
                });
            });
            card.appendChild(startButton);

            const bartender = game.mechanics.createImage(
                images.bartender,
                "tavern-intro-bartender",
                "Грош — хозяин Таверны между мирами"
            );
            const stitch = game.mechanics.createImage(
                images.stitch,
                "tavern-intro-stitch",
                "Стич"
            );

            const nameplate = document.createElement("div");
            nameplate.className = "tavern-nameplate";
            nameplate.innerHTML = "<strong>ГРОШ</strong><span>ХОЗЯИН · БАРМЕН · СУДЬЯ ВАШИХ РЕШЕНИЙ</span>";

            content.append(card, bartender, stitch, nameplate);
            screen.append(content);
            root.appendChild(screen);

            playTavernAmbience();

            context.timeout(function () {
                screen.classList.add("tavern-intro-ready");
            }, 70);

            game.ui.showSubtitle("Добро пожаловать в Таверну между мирами. Я Грош. И теперь вы работаете на меня.");
            startButton.focus();
        },

        unmount: function () {}
    };

    game.scenes.tavern_orders = {
        id: "tavern_orders",

        mount: function (root, context) {
            const screen = document.createElement("section");
            screen.className = "screen tavern-screen tavern-orders-screen";
            const alreadyComplete = game.state.get().chapterProgress.tavern >= 1;
            let selectedIngredient = null;
            let completedCount = 0;
            let resolving = false;

            const glasses = {};
            const bottleElements = {};
            const guestElements = {};

            const stage = document.createElement("div");
            stage.className = "orders-stage";

            const header = document.createElement("article");
            header.className = "orders-header panel";
            header.innerHTML =
                "<p class=\"eyebrow\">ЗАДАНИЕ 1 ИЗ 3</p>" +
                "<h1>Заказы без слов</h1>" +
                "<p>Перетащите по два ингредиента в каждый бокал. Желания гостей показаны символами.</p>";

            const rune = document.createElement("div");
            rune.className = "orders-rune";
            rune.setAttribute("aria-label", "Части портальной руны");
            const runeSegments = guests.map(function () {
                const segment = document.createElement("span");
                rune.appendChild(segment);
                return segment;
            });

            const guestGroup = game.mechanics.createImage(
                images.guests,
                "orders-guests-image",
                "Русалка, орк и эльф ожидают напитки"
            );


            const guestLayer = document.createElement("div");
            guestLayer.className = "orders-guests-layer";

            guests.forEach(function (guest) {
                const guestSlot = document.createElement("div");
                guestSlot.className = "order-guest order-guest-" + guest.id;
                guestSlot.dataset.guest = guest.id;

                const wish = document.createElement("div");
                wish.className = "order-wish";
                wish.setAttribute("aria-label", "Заказ: " + guest.recipe.map(function (id) {
                    return ingredientById(id).label;
                }).join(" и "));
                wish.innerHTML = guest.recipe.map(function (id) {
                    const ingredient = ingredientById(id);
                    return "<span style=\"--wish-color:" + ingredient.color + "\">" + ingredient.icon + "</span>";
                }).join("<i>+</i>");

                const name = document.createElement("strong");
                name.textContent = guest.label;

                const served = document.createElement("span");
                served.className = "guest-served-mark";
                served.textContent = "✓";

                guestSlot.append(wish, name, served);
                guestLayer.appendChild(guestSlot);
                guestElements[guest.id] = guestSlot;
            });

            const glassLayer = document.createElement("div");
            glassLayer.className = "orders-glasses";

            guests.forEach(function (guest) {
                const wrap = document.createElement("div");
                wrap.className = "order-glass-wrap order-glass-" + guest.id;

                const dropzone = document.createElement("button");
                dropzone.type = "button";
                dropzone.className = "order-glass-dropzone";
                dropzone.dataset.guest = guest.id;
                dropzone.setAttribute("aria-label", "Бокал для гостя: " + guest.label);
                dropzone.innerHTML =
                    "<span class=\"glass-art-wrap\">" +
                    "<i class=\"glass-liquid\"></i>" +
                    "<img class=\"glass-art\" src=\"" + images.goblet + "\" alt=\"\">" +
                    "<b class=\"glass-slots\"></b>" +
                    "</span>";

                const resetButton = game.mechanics.createButton("УБРАТЬ", "glass-reset-button");
                resetButton.hidden = true;

                const glassState = {
                    guest: guest,
                    ingredients: [],
                    complete: false,
                    wrap: wrap,
                    dropzone: dropzone,
                    slots: dropzone.querySelector(".glass-slots"),
                    liquid: dropzone.querySelector(".glass-liquid"),
                    resetButton: resetButton
                };
                glasses[guest.id] = glassState;

                wrap.append(dropzone, resetButton);
                glassLayer.appendChild(wrap);
            });

            const bottleRack = document.createElement("div");
            bottleRack.className = "orders-bottle-rack";

            ingredients.forEach(function (ingredient) {
                const bottle = document.createElement("button");
                bottle.type = "button";
                bottle.className = "magic-bottle bottle-" + ingredient.id;
                bottle.draggable = true;
                bottle.dataset.ingredient = ingredient.id;
                bottle.style.setProperty("--bottle-color", ingredient.color);
                bottle.setAttribute("aria-label", "Ингредиент: " + ingredient.label);
                bottle.innerHTML =
                    "<img class=\"magic-bottle-art\" src=\"" + ingredient.image + "\" alt=\"\">" +
                    "<strong>" + ingredient.label + "</strong>";
                bottleRack.appendChild(bottle);
                bottleElements[ingredient.id] = bottle;
            });

            const stitch = game.mechanics.createImage(
                images.stitch,
                "orders-stitch",
                "Стич подсказывает"
            );

            const feedback = document.createElement("div");
            feedback.className = "orders-feedback";
            feedback.setAttribute("role", "status");
            feedback.textContent = "Выберите бутылку или перетащите её в бокал.";

            const completeCard = document.createElement("article");
            completeCard.className = "orders-complete-card panel";
            completeCard.innerHTML =
                "<p class=\"eyebrow\">ПЕРВАЯ ЧАСТЬ РУНЫ ЗАЖЖЕНА</p>" +
                "<h2>Все заказы готовы</h2>" +
                "<p>Русалка довольна, орк всё ещё выглядит недовольным, но это его обычное лицо, а эльф мысленно поставила вам четыре звезды из пяти.</p>";

            const nextButton = game.mechanics.createButton("ДАЛЬШЕ", "gold-button");
            context.on(nextButton, "click", function (event) {
                event.preventDefault();

                if (nextButton.disabled) {
                    return;
                }

                nextButton.disabled = true;
                nextButton.textContent = "ОТКРЫВАЕМ ДЫМОВУЮ ВЯЗЬ…";
                context.goTo("tavern_smoke", {
                    checkpointId: "tavern_smoke",
                    save: true,
                    saveReason: "Таверна: Звёздная вязь"
                });
            });
            completeCard.appendChild(nextButton);

            const completeVeil = document.createElement("div");
            completeVeil.className = "orders-complete-veil";
            completeVeil.setAttribute("aria-hidden", "true");

            function updateBottles() {
                ingredients.forEach(function (ingredient) {
                    const bottle = bottleElements[ingredient.id];
                    bottle.classList.toggle("is-selected", selectedIngredient === ingredient.id);
                    bottle.classList.remove("is-unavailable", "is-used");
                });
            }

            function renderGlass(glass) {
                glass.slots.innerHTML = "";

                glass.resetButton.hidden = glass.ingredients.length === 0 || glass.complete;
                glass.wrap.classList.toggle("has-one", glass.ingredients.length === 1);
                glass.wrap.classList.toggle("has-two", glass.ingredients.length === 2);
                glass.wrap.classList.toggle("is-complete", glass.complete);

                if (glass.complete) {
                    glass.liquid.style.setProperty("--drink-color", glass.guest.color);
                } else {
                    glass.liquid.style.removeProperty("--drink-color");
                }
            }

            function clearHints() {
                Object.keys(bottleElements).forEach(function (id) {
                    bottleElements[id].classList.remove("is-hinted");
                });
                screen.classList.remove("orders-stitch-hinting");
            }

            function showHint(glass, level) {
                clearHints();
                const needed = glass.guest.recipe.filter(function (ingredientId) {
                    return !glass.ingredients.includes(ingredientId);
                });
                const shown = level >= 3 ? needed : needed.slice(0, 1);

                shown.forEach(function (ingredientId) {
                    bottleElements[ingredientId].classList.add("is-hinted");
                });
                screen.classList.add("orders-stitch-hinting");
                feedback.textContent = level >= 3
                    ? "Стич уже даже не намекает: обе нужные бутылки светятся."
                    : "Стич принюхивается к одной из нужных бутылок.";
            }

            function resetGlass(glass) {
                if (resolving || glass.complete) {
                    return;
                }

                glass.ingredients = [];
                selectedIngredient = null;
                renderGlass(glass);
                clearHints();
                updateBottles();
                feedback.textContent = "Ингредиенты возвращены на полку.";
            }

            function completeTask(fromSave) {
                screen.classList.add("orders-complete");
                feedback.textContent = "Все три заказа собраны. Портальная руна отвечает.";

                if (!fromSave) {
                    const currentProgress = game.state.get().chapterProgress;
                    const currentSteps = game.state.get().pathSteps;
                    game.state.patch({
                        chapterProgress: {
                            ...currentProgress,
                            tavern: 1
                        },
                        pathSteps: {
                            ...currentSteps,
                            tuko: Math.max(currentSteps.tuko, 1)
                        }
                    });
                    game.save.write("Таверна: заказы без слов выполнены");
                    game.ui.showSubtitle("Первое очко пути получено. Первая часть портальной руны зажжена.");
                }

                context.timeout(function () {
                    nextButton.focus();
                }, 440);
            }

            function acceptCorrect(glass) {
                glass.complete = true;
                completedCount += 1;
                selectedIngredient = null;
                renderGlass(glass);
                updateBottles();
                guestElements[glass.guest.id].classList.add("is-served");
                runeSegments[completedCount - 1].classList.add("is-lit");
                feedback.textContent = glass.guest.label + " принимает напиток. Всё правильно.";
                glass.wrap.classList.add("mix-success");

                context.timeout(function () {
                    glass.wrap.classList.remove("mix-success");
                }, 700);

                if (completedCount === guests.length) {
                    completeTask(false);
                }
            }

            function rejectMixture(glass) {
                resolving = true;
                const level = game.hints.recordError("tavern_orders");
                const effectIndex = (level - 1) % errorEffects.length;
                feedback.textContent = errorEffects[effectIndex];
                glass.wrap.classList.add("mix-error", "error-effect-" + effectIndex);
                screen.classList.add("orders-error-flash");
                selectedIngredient = null;

                context.timeout(function () {
                    glass.ingredients = [];
                    resolving = false;
                    glass.wrap.classList.remove(
                        "mix-error",
                        "error-effect-0",
                        "error-effect-1",
                        "error-effect-2"
                    );
                    screen.classList.remove("orders-error-flash");
                    renderGlass(glass);
                    updateBottles();

                    if (level >= 2) {
                        showHint(glass, level);
                    } else {
                        feedback.textContent = "Неверная смесь исчезла. Попробуйте ещё раз.";
                    }
                }, 950);
            }

            function addIngredient(ingredientId, guestId) {
                const glass = glasses[guestId];
                const bottle = bottleElements[ingredientId];

                if (
                    resolving ||
                    glass.complete ||
                    glass.ingredients.length >= 2
                ) {
                    return;
                }

                clearHints();
                glass.ingredients.push(ingredientId);
                selectedIngredient = null;
                renderGlass(glass);
                updateBottles();

                if (glass.ingredients.length === 1) {
                    feedback.textContent = "Первый ингредиент добавлен. Нужен ещё один.";
                    return;
                }

                if (sameRecipe(glass.ingredients, glass.guest.recipe)) {
                    acceptCorrect(glass);
                } else {
                    rejectMixture(glass);
                }
            }

            ingredients.forEach(function (ingredient) {
                const bottle = bottleElements[ingredient.id];

                context.on(bottle, "click", function () {

                    selectedIngredient = selectedIngredient === ingredient.id ? null : ingredient.id;
                    updateBottles();
                    feedback.textContent = selectedIngredient
                        ? "Выбрано: " + ingredient.label + ". Теперь нажмите на нужный бокал."
                        : "Выбор отменён.";
                });

                context.on(bottle, "dragstart", function (event) {

                    selectedIngredient = ingredient.id;
                    updateBottles();
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", ingredient.id);
                });

                context.on(bottle, "dragend", function () {
                    selectedIngredient = null;
                    updateBottles();
                });
            });

            guests.forEach(function (guest) {
                const glass = glasses[guest.id];

                context.on(glass.dropzone, "click", function () {
                    if (selectedIngredient) {
                        addIngredient(selectedIngredient, guest.id);
                    } else if (!glass.complete) {
                        feedback.textContent = "Сначала выберите одну из шести бутылок.";
                    }
                });

                context.on(glass.dropzone, "dragover", function (event) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    glass.wrap.classList.add("is-drag-over");
                });

                context.on(glass.dropzone, "dragleave", function () {
                    glass.wrap.classList.remove("is-drag-over");
                });

                context.on(glass.dropzone, "drop", function (event) {
                    event.preventDefault();
                    glass.wrap.classList.remove("is-drag-over");
                    const ingredientId = event.dataTransfer.getData("text/plain") || selectedIngredient;

                    if (ingredientId) {
                        addIngredient(ingredientId, guest.id);
                    }
                });

                context.on(glass.resetButton, "click", function () {
                    resetGlass(glass);
                });
            });

            stage.append(
                header,
                rune,
                guestGroup,
                guestLayer,
                glassLayer,
                bottleRack,
                stitch,
                feedback,
                completeVeil,
                completeCard
            );
            screen.append(stage);
            root.appendChild(screen);

            playTavernAmbience();

            if (alreadyComplete) {
                guests.forEach(function (guest, index) {
                    const glass = glasses[guest.id];
                    glass.ingredients = guest.recipe.slice();
                    glass.complete = true;
                    completedCount += 1;
                    renderGlass(glass);
                    guestElements[guest.id].classList.add("is-served");
                    runeSegments[index].classList.add("is-lit");
                });
                updateBottles();
                completeTask(true);
                game.ui.showSubtitle("Заказы уже выполнены. Можно переходить к следующему испытанию.");
            } else {
                Object.keys(glasses).forEach(function (guestId) {
                    renderGlass(glasses[guestId]);
                });
                updateBottles();
                game.ui.showSubtitle("ТуКо, приготовьте три напитка. В каждом должно быть ровно два ингредиента.");
            }

            context.timeout(function () {
                screen.classList.add("orders-ready");
            }, 70);
        },

        unmount: function () {}
    };

    const smokeConstellations = [
        {
            id: "ursa",
            label: "Большая и Малая Медведицы",
            shortMark: "✦✦",
            reveal: images.constellationUrsa,
            revealSegments: [
                {
                    nodes: [
                        [260, 520], [430, 470], [610, 485], [770, 460],
                        [830, 610], [1050, 650], [1080, 470]
                    ],
                    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
                },
                {
                    nodes: [
                        [230, 230], [360, 195], [500, 210], [630, 165],
                        [810, 180], [885, 285], [690, 300]
                    ],
                    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
                }
            ],
            segments: [
                {
                    label: "Большая Медведица",
                    nodes: [
                        [520, 310], [665, 265], [805, 285], [940, 260],
                        [990, 420], [1155, 460], [1195, 275]
                    ],
                    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
                },
                {
                    label: "Малая Медведица",
                    nodes: [
                        [700, 600], [815, 540], [915, 580], [1015, 500],
                        [1215, 510], [1290, 650], [1060, 670]
                    ],
                    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
                }
            ]
        },
        {
            id: "libra",
            label: "Созвездие Весов",
            shortMark: "⚖",
            reveal: images.constellationLibra,
            revealSegments: [{
                nodes: [[450, 500], [835, 160], [1220, 500], [835, 780]],
                links: [[0, 1], [1, 2], [2, 3], [3, 0]]
            }],
            segments: [{
                label: "Весы",
                nodes: [
                    [820, 210], [1190, 370], [760, 680], [590, 420]
                ],
                links: [[0, 1], [1, 2], [2, 3], [3, 0]]
            }]
        },
        {
            id: "orion",
            label: "Созвездие Ориона",
            shortMark: "🏹",
            reveal: images.constellationOrion,
            revealSegments: [{
                nodes: [
                    [835, 170], [650, 300], [720, 455], [835, 450],
                    [950, 445], [1030, 300], [1040, 790], [650, 790]
                ],
                links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [0, 5], [2, 7]]
            }],
            segments: [{
                label: "Орион",
                nodes: [
                    [835, 145], [620, 300], [700, 450], [835, 440],
                    [970, 425], [1060, 290], [1040, 710], [650, 700]
                ],
                links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [0, 5], [2, 7]]
            }]
        }
    ];

    function distanceBetween(first, second) {
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function distanceToSegment(point, start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const lengthSquared = dx * dx + dy * dy;

        if (!lengthSquared) {
            return distanceBetween(point, start);
        }

        const ratio = Math.max(0, Math.min(1,
            ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared
        ));
        return distanceBetween(point, {
            x: start.x + ratio * dx,
            y: start.y + ratio * dy
        });
    }

    function toPoint(pair) {
        return { x: pair[0], y: pair[1] };
    }

    function smoothPath(nodePairs) {
        const points = nodePairs.map(toPoint);

        if (points.length < 2) {
            return "";
        }

        let data = "M " + points[0].x + " " + points[0].y;

        for (let index = 0; index < points.length - 1; index += 1) {
            const previous = points[index - 1] || points[index];
            const current = points[index];
            const next = points[index + 1];
            const afterNext = points[index + 2] || next;
            const firstControl = {
                x: current.x + (next.x - previous.x) / 6,
                y: current.y + (next.y - previous.y) / 6
            };
            const secondControl = {
                x: next.x - (afterNext.x - current.x) / 6,
                y: next.y - (afterNext.y - current.y) / 6
            };

            data += " C " + firstControl.x + " " + firstControl.y +
                ", " + secondControl.x + " " + secondControl.y +
                ", " + next.x + " " + next.y;
        }

        return data;
    }

    function linkedPath(nodePairs, links) {
        const connections = links || nodePairs.slice(1).map(function (_pair, index) {
            return [index, index + 1];
        });

        return connections.map(function (connection) {
            const start = nodePairs[connection[0]];
            const end = nodePairs[connection[1]];
            return "M " + start[0] + " " + start[1] + " L " + end[0] + " " + end[1];
        }).join(" ");
    }

    function starPath(x, y, radius) {
        const inner = radius * 0.28;
        return "M " + x + " " + (y - radius) +
            " L " + (x + inner) + " " + (y - inner) +
            " L " + (x + radius) + " " + y +
            " L " + (x + inner) + " " + (y + inner) +
            " L " + x + " " + (y + radius) +
            " L " + (x - inner) + " " + (y + inner) +
            " L " + (x - radius) + " " + y +
            " L " + (x - inner) + " " + (y - inner) + " Z";
    }

    game.scenes.tavern_smoke = {
        id: "tavern_smoke",

        mount: function (root, context) {
            const svgNamespace = "http://www.w3.org/2000/svg";
            const alreadyComplete = game.state.get().chapterProgress.tavern >= 2;
            let currentConstellationIndex = 0;
            let currentSegmentIndex = 0;
            let currentSegmentErrors = 0;
            let visitedIndex = 0;
            let drawing = false;
            let resolving = false;
            let pointerId = null;
            let lastPointerPoint = null;
            let tracePoints = [];
            let nodeElements = [];

            const screen = document.createElement("section");
            screen.className = "screen tavern-smoke-screen";

            const backgroundImage = game.mechanics.createImage(
                images.smoke,
                "smoke-background-image",
                "Окно Таверны между мирами с видом на звёздное небо"
            );

            const stage = document.createElement("div");
            stage.className = "smoke-stage";

            const cloudMask = document.createElement("div");
            cloudMask.className = "smoke-cloud-mask";
            cloudMask.setAttribute("aria-hidden", "true");

            const header = document.createElement("article");
            header.className = "smoke-header panel";
            header.innerHTML =
                "<p class=\"eyebrow\">ЗАДАНИЕ 2 ИЗ 3 · ОКНО НА КРАЮ МИРОВ</p>" +
                "<h1>Звёздная вязь</h1>" +
                "<p>Таверна парит между мирами. Дым кальяна проявляет знакомые звёзды - соедините их и попробуйте определить, где вы оказались ТуКо.</p>";

            const progress = document.createElement("div");
            progress.className = "smoke-progress";
            progress.setAttribute("aria-label", "Найденные созвездия");

            const progressMarks = smokeConstellations.map(function (constellation) {
                const mark = document.createElement("span");
                mark.innerHTML = "<b>" + constellation.shortMark + "</b><small>НЕ НАЙДЕНО</small>";
                progress.appendChild(mark);
                return mark;
            });

            const runeName = document.createElement("div");
            runeName.className = "smoke-rune-name";

            const feedback = document.createElement("div");
            feedback.className = "smoke-feedback";
            feedback.setAttribute("role", "status");

            const drawingSvg = document.createElementNS(svgNamespace, "svg");
            drawingSvg.classList.add("smoke-drawing-svg");
            drawingSvg.setAttribute("viewBox", "0 0 1672 941");
            drawingSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
            drawingSvg.setAttribute("aria-label", "Область поиска созвездий в звёздном небе");
            drawingSvg.innerHTML =
                "<defs>" +
                    "<filter id=\"smoke-glow\" x=\"-80%\" y=\"-80%\" width=\"260%\" height=\"260%\">" +
                        "<feGaussianBlur stdDeviation=\"6\" result=\"blur\"></feGaussianBlur>" +
                        "<feMerge><feMergeNode in=\"blur\"></feMergeNode><feMergeNode in=\"SourceGraphic\"></feMergeNode></feMerge>" +
                    "</filter>" +
                    "<filter id=\"smoke-gold-glow\" x=\"-80%\" y=\"-80%\" width=\"260%\" height=\"260%\">" +
                        "<feGaussianBlur stdDeviation=\"9\" result=\"blur\"></feGaussianBlur>" +
                        "<feMerge><feMergeNode in=\"blur\"></feMergeNode><feMergeNode in=\"SourceGraphic\"></feMergeNode></feMerge>" +
                    "</filter>" +
                "</defs>";

            const completedLayer = document.createElementNS(svgNamespace, "g");
            completedLayer.classList.add("smoke-completed-layer");
            const routeGuide = document.createElementNS(svgNamespace, "path");
            routeGuide.classList.add("smoke-route-guide");
            const trace = document.createElementNS(svgNamespace, "polyline");
            trace.classList.add("smoke-trace");
            const nodesLayer = document.createElementNS(svgNamespace, "g");
            nodesLayer.classList.add("smoke-nodes-layer");
            const spark = document.createElementNS(svgNamespace, "circle");
            spark.classList.add("smoke-spark");
            spark.setAttribute("r", "11");
            drawingSvg.append(completedLayer, routeGuide, trace, nodesLayer, spark);

            const constellationReveal = document.createElement("div");
            constellationReveal.className = "constellation-reveal";
            constellationReveal.setAttribute("aria-live", "polite");
            const revealImage = document.createElement("img");
            revealImage.className = "constellation-reveal-image";
            revealImage.draggable = false;
            const revealMap = document.createElementNS(svgNamespace, "svg");
            revealMap.classList.add("constellation-reveal-map");
            revealMap.setAttribute("viewBox", "0 0 1672 941");
            revealMap.setAttribute("preserveAspectRatio", "xMidYMid meet");
            revealMap.setAttribute("aria-hidden", "true");
            const revealTitle = document.createElement("strong");
            constellationReveal.append(revealImage, revealMap, revealTitle);

            const completeCard = document.createElement("article");
            completeCard.className = "smoke-complete-card panel";
            completeCard.innerHTML =
                "<p class=\"eyebrow\">ВТОРОЕ ОЧКО ПУТИ</p>" +
                "<h2>Три созвездия найдены</h2>" +
                "<p>Обе Медведицы, Весы и Орион вспыхнули над краем миров. Карта не сказала, где находится таверна, зато показала дорогу дальше.</p>";

            const nextButton = game.mechanics.createButton("ДАЛЬШЕ", "gold-button");
            context.on(nextButton, "click", function () {
                context.goTo("tavern_balance", {
                    checkpointId: "tavern_balance",
                    save: true,
                    saveReason: "Таверна: Баланс миров"
                });
            });
            completeCard.appendChild(nextButton);

            const completeVeil = document.createElement("div");
            completeVeil.className = "smoke-complete-veil";
            completeVeil.setAttribute("aria-hidden", "true");

            function svgElement(name, className) {
                const element = document.createElementNS(svgNamespace, name);
                if (className) {
                    element.setAttribute("class", className);
                }
                return element;
            }

            function pointerPosition(event) {
                const point = drawingSvg.createSVGPoint();
                point.x = event.clientX;
                point.y = event.clientY;
                return point.matrixTransform(drawingSvg.getScreenCTM().inverse());
            }

            function updateTrace() {
                trace.setAttribute("points", tracePoints.map(function (point) {
                    return point.x + "," + point.y;
                }).join(" "));
            }

            function moveSpark(point) {
                spark.setAttribute("cx", point.x);
                spark.setAttribute("cy", point.y);
            }

            function hideSpark() {
                spark.removeAttribute("cx");
                spark.removeAttribute("cy");
            }

            function markVisitedNodes() {
                const targetIndex = drawing ? visitedIndex + 1 : 0;
                nodeElements.forEach(function (node, index) {
                    node.classList.toggle("is-visited", drawing && index <= visitedIndex);
                    node.classList.toggle("is-next", index === targetIndex);
                });
            }

            function currentConstellation() {
                return smokeConstellations[currentConstellationIndex];
            }

            function currentSegment() {
                const constellation = currentConstellation();
                return constellation && constellation.segments[currentSegmentIndex];
            }

            function applyRuneHint() {
                screen.classList.toggle("smoke-stitch-hinting", currentSegmentErrors >= 2);
                routeGuide.classList.toggle("is-visible", currentSegmentErrors >= 3);

                nodeElements.forEach(function (node, index) {
                    node.classList.toggle(
                        "is-sniffed",
                        currentSegmentErrors >= 2 && index === (drawing ? visitedIndex + 1 : 0)
                    );
                });
            }

            function renderRune() {
                const constellation = currentConstellation();
                const segment = currentSegment();
                nodesLayer.innerHTML = "";
                nodeElements = [];
                tracePoints = [];
                lastPointerPoint = null;
                visitedIndex = 0;
                trace.removeAttribute("points");
                trace.classList.remove("is-error", "is-success");
                hideSpark();
                routeGuide.setAttribute("d", linkedPath(segment.nodes, segment.links));
                runeName.innerHTML =
                    "<span>СОЗВЕЗДИЕ " + (currentConstellationIndex + 1) + " ИЗ " + smokeConstellations.length +
                        (constellation.segments.length > 1 ? " · ЧАСТЬ " + (currentSegmentIndex + 1) + " ИЗ " + constellation.segments.length : "") +
                    "</span>" +
                    "<strong>" + segment.label + "</strong>";

                segment.nodes.forEach(function (pair, index) {
                    const group = svgElement("g", "smoke-node" + (index === 0 ? " is-start" : ""));
                    const aura = svgElement("path", "smoke-node-aura");
                    const core = document.createElementNS("http://www.w3.org/2000/svg", "image");
                        core.classList.add("smoke-node-core");
                        core.setAttribute("href", images.constellationStar);
                        core.setAttribute("preserveAspectRatio", "xMidYMid meet");
                    const starRadius = index === 0 ? 34 : 26;
                    aura.setAttribute("d", starPath(pair[0], pair[1], starRadius + 10));
                    aura.setAttribute("fill", index === 0 ? "#ffd866" : "#69eaff");
                    aura.setAttribute("fill-opacity", "0.28");
                    core.setAttribute("x", pair[0] - starRadius);
                    core.setAttribute("y", pair[1] - starRadius);
                    core.setAttribute("width", starRadius * 2);
                    core.setAttribute("height", starRadius * 2);
                    group.append(aura, core);
                    nodesLayer.appendChild(group);
                    nodeElements.push(group);
                });

                markVisitedNodes();
                applyRuneHint();
                feedback.textContent = "Зажмите мышь на большой золотой звезде и ведите искру к следующей вспыхнувшей звезде.";
            }

            function addCompletedSegment(segment) {
                const path = svgElement("path", "smoke-completed-segment");
                path.setAttribute("d", linkedPath(segment.nodes, segment.links));
                completedLayer.appendChild(path);
            }

            function renderRevealMap(constellation) {
                revealMap.innerHTML = "";

                constellation.revealSegments.forEach(function (segment) {
                    const line = svgElement("path", "constellation-reveal-line");
                    line.setAttribute("d", linkedPath(segment.nodes, segment.links));
                    revealMap.appendChild(line);

                    segment.nodes.forEach(function (pair) {
                        const star = document.createElementNS(svgNamespace, "image");
                        star.classList.add("constellation-reveal-star");
                        star.setAttribute("href", images.constellationStar);
                        star.setAttribute("x", pair[0] - 15);
                        star.setAttribute("y", pair[1] - 15);
                        star.setAttribute("width", "30");
                        star.setAttribute("height", "30");
                        star.setAttribute("preserveAspectRatio", "xMidYMid meet");
                        revealMap.appendChild(star);
                    });
                }); 
            }

            function markConstellation(constellation, fromSave) {
                const mark = progressMarks[smokeConstellations.indexOf(constellation)];
                mark.classList.add("is-lit");
                mark.querySelector("small").textContent = "НАЙДЕНО";

                if (!fromSave) {
                    mark.classList.add("just-lit");
                    context.timeout(function () {
                        mark.classList.remove("just-lit");
                    }, 850);
                }
            }

            function completeTask(fromSave) {
                drawing = false;
                resolving = true;
                screen.classList.add("smoke-complete");
                feedback.textContent = "Все три созвездия найдены. Звёздная карта указывает путь дальше.";

                if (!fromSave) {
                    const currentProgress = game.state.get().chapterProgress;
                    const currentSteps = game.state.get().pathSteps;
                    game.state.patch({
                        chapterProgress: {
                            ...currentProgress,
                            tavern: 2
                        },
                        pathSteps: {
                            ...currentSteps,
                            tuko: Math.max(currentSteps.tuko, 2)
                        }
                    });
                    game.save.write("Таверна: Звёздная вязь выполнена");
                    game.ui.showSubtitle("Второе очко пути получено. Три знакомых созвездия зажглись над краем миров.");
                }

                context.timeout(function () {
                    nextButton.focus();
                }, 500);
            }

            function revealConstellation(constellation) {
                markConstellation(constellation, false);
                revealImage.src = constellation.reveal;
                revealImage.alt = "Образ созвездия «" + constellation.label + "»";
                renderRevealMap(constellation);
                revealTitle.textContent = constellation.label;
                screen.classList.add("smoke-rune-success", "smoke-constellation-reveal");
                feedback.textContent = constellation.label + " проявляется в дыме.";

                context.timeout(function () {
                    screen.classList.remove("smoke-rune-success", "smoke-constellation-reveal", "smoke-stitch-hinting");
                    completedLayer.innerHTML = "";
                    currentConstellationIndex += 1;
                    currentSegmentIndex = 0;
                    currentSegmentErrors = 0;

                    if (currentConstellationIndex >= smokeConstellations.length) {
                        completeTask(false);
                        return;
                    }

                    resolving = false;
                    renderRune();
                }, 2300);
            }

            function acceptRune() {
                if (resolving) {
                    return;
                }

                const constellation = currentConstellation();
                const segment = currentSegment();
                resolving = true;
                drawing = false;
                trace.classList.add("is-success");
                nodeElements.forEach(function (node) {
                    node.classList.add("is-visited");
                });
                addCompletedSegment(segment);
                screen.classList.add("smoke-rune-success");
                feedback.textContent = segment.label + " найдена.";

                context.timeout(function () {
                    if (currentSegmentIndex < constellation.segments.length - 1) {
                        currentSegmentIndex += 1;
                        currentSegmentErrors = 0;
                        resolving = false;
                        screen.classList.remove("smoke-rune-success", "smoke-stitch-hinting");
                        renderRune();
                        feedback.textContent = segment.label + " найдена. Теперь отыщите " + currentSegment().label + ".";
                        return;
                    }

                    revealConstellation(constellation);
                }, 850);
            }

            function rejectRune(message) {
                if (!drawing || resolving) {
                    return;
                }

                drawing = false;
                resolving = true;
                currentSegmentErrors += 1;
                game.hints.recordError("tavern_smoke");
                trace.classList.add("is-error");
                screen.classList.add("smoke-sneeze");
                feedback.textContent = message;

                context.timeout(function () {
                    resolving = false;
                    screen.classList.remove("smoke-sneeze");
                    renderRune();

                    if (currentSegmentErrors >= 3) {
                        feedback.textContent = "Дым больше не скрывает маршрут: между звёздами появился пунктир.";
                    } else if (currentSegmentErrors >= 2) {
                        feedback.textContent = "Струйка дыма тянется к следующей звезде.";
                    } else {
                        feedback.textContent = "Дым рассеялся. Начните текущее созвездие заново.";
                    }
                }, 760);
            }

            function startDrawing(event) {
                if (resolving || alreadyComplete || currentConstellationIndex >= smokeConstellations.length) {
                    return;
                }

                const point = pointerPosition(event);
                const firstNode = toPoint(currentSegment().nodes[0]);

                if (distanceBetween(point, firstNode) > 62) {
                    feedback.textContent = "Сначала нажмите на большую пульсирующую золотую звезду.";
                    screen.classList.add("smoke-wrong-start");
                    context.timeout(function () {
                        screen.classList.remove("smoke-wrong-start");
                    }, 450);
                    return;
                }

                event.preventDefault();
                drawing = true;
                pointerId = event.pointerId;
                visitedIndex = 0;
                tracePoints = [firstNode];
                lastPointerPoint = firstNode;
                updateTrace();
                moveSpark(firstNode);
                trace.classList.remove("is-error", "is-success");
                drawingSvg.setPointerCapture(pointerId);
                screen.classList.add("smoke-drawing");
                markVisitedNodes();
                applyRuneHint();
                feedback.textContent = "Не отпускайте мышь. Следуйте к следующей вспыхнувшей звезде.";
            }

            function continueDrawing(event) {
                if (!drawing || resolving || event.pointerId !== pointerId) {
                    return;
                }

                event.preventDefault();
                const point = pointerPosition(event);
                const runeNodes = currentSegment().nodes.map(toPoint);
                const currentNode = runeNodes[visitedIndex];
                const nextNode = runeNodes[visitedIndex + 1];

                if (!nextNode) {
                    return;
                }

                if (
                    distanceBetween(point, nextNode) <= 43 ||
                    (lastPointerPoint && distanceToSegment(nextNode, lastPointerPoint, point) <= 43)
                ) {
                    visitedIndex += 1;
                    tracePoints.push(nextNode);
                    lastPointerPoint = nextNode;
                    updateTrace();
                    moveSpark(nextNode);
                    markVisitedNodes();
                    applyRuneHint();

                    if (visitedIndex === runeNodes.length - 1) {
                        screen.classList.remove("smoke-drawing");
                        acceptRune();
                    } else {
                        feedback.textContent = "Верно. Следующая звезда уже вспыхнула.";
                    }
                    return;
                }

                if (distanceToSegment(point, currentNode, nextNode) > 82) {
                    screen.classList.remove("smoke-drawing");
                    rejectRune("Дым чихнул — искра слишком далеко ушла от маршрута.");
                    return;
                }

                const lastPoint = tracePoints[tracePoints.length - 1];
                if (distanceBetween(point, lastPoint) >= 7) {
                    tracePoints.push(point);
                    updateTrace();
                    moveSpark(point);
                }
                lastPointerPoint = point;
            }

            function stopDrawing(event) {
                if (!drawing || event.pointerId !== pointerId) {
                    return;
                }

                screen.classList.remove("smoke-drawing");
                rejectRune("Искра погасла: кнопку мыши отпустили раньше последней звезды.");
            }

            context.on(drawingSvg, "pointerdown", startDrawing);
            context.on(drawingSvg, "pointermove", continueDrawing);
            context.on(drawingSvg, "pointerup", stopDrawing);
            context.on(drawingSvg, "pointercancel", stopDrawing);

            stage.append(
                cloudMask,
                drawingSvg,
                constellationReveal,
                header,
                progress,
                runeName,
                feedback,
                completeVeil,
                completeCard
            );
            screen.append(
                backgroundImage,
                stage
            );
            root.appendChild(screen);

            playTavernAmbience();

            if (alreadyComplete) {
                smokeConstellations.forEach(function (constellation) {
                    markConstellation(constellation, true);
                });
                completeTask(true);
                game.ui.showSubtitle("Звёздная вязь уже собрана. Можно переходить к Балансу миров.");
            } else {
                renderRune();
                game.ui.showSubtitle("Зажмите мышь на первой звезде и проведите дымовую искру через всё созвездие, не отпуская.");
            }

            context.timeout(function () {
                screen.classList.add("smoke-ready");
            }, 70);
        },

        unmount: function () {}
    };

    game.scenes.tavern_balance = {
        id: "tavern_balance",

        mount: function (root, context) {
            const challengeDuration = 12;
            const alreadyComplete = game.state.get().chapterProgress.tavern >= 3;
            let phase = alreadyComplete ? "complete" : "ready";
            let attemptNumber = 0;
            let elapsed = 0;
            let previousTimestamp = null;
            let animationId = null;
            let mouseControl = 0;
            let tilt = 0;
            let dangerTime = 0;
            let safeLimit = 0.52;
            let narrowed = false;
            let wasInDanger = false;
            let lastHintDirection = "";

            const screen = document.createElement("section");
            screen.className = "screen tavern-balance-screen";
            screen.style.setProperty("--balance-background", "url('" + images.balance + "')");
            screen.style.setProperty("--balance-position", "50%");
            screen.style.setProperty("--balance-progress", "0");
            screen.style.setProperty("--balance-progress-angle", "0deg");
            screen.style.setProperty("--balance-safe-width", "46%");
            screen.style.setProperty("--balance-tilt", "0");
            screen.style.setProperty("--balance-tilt-angle", "0deg");
            screen.style.setProperty("--balance-counter-angle", "0deg");
            screen.style.setProperty("--balance-glass-slide", "0px");

            const stage = document.createElement("div");
            stage.className = "balance-stage";

            const header = document.createElement("article");
            header.className = "balance-header panel";
            header.innerHTML =
                "<p class=\"eyebrow\">ЗАДАНИЕ 3 ИЗ 3</p>" +
                "<h1>Баланс миров</h1>" +
                "<p>Ведите мышь влево и вправо, удерживая золотой маркер внутри зелёной зоны, пока кольцо не замкнётся.</p>";

            const timer = document.createElement("div");
            timer.className = "balance-timer";
            timer.setAttribute("aria-label", "Время удержания равновесия");
            timer.innerHTML = "<span><b>ДЕРЖИ</b><small>РАВНОВЕСИЕ</small></span>";

            const meter = document.createElement("div");
            meter.className = "balance-meter";
            meter.setAttribute("aria-label", "Шкала равновесия");
            meter.innerHTML =
                "<span class=\"balance-meter-edge balance-meter-edge-left\">−</span>" +
                "<i class=\"balance-safe-zone\"></i>" +
                "<em class=\"balance-meter-center\"></em>" +
                "<b class=\"balance-marker\"></b>" +
                "<span class=\"balance-meter-edge balance-meter-edge-right\">+</span>";

            const feedback = document.createElement("div");
            feedback.className = "balance-feedback";
            feedback.setAttribute("role", "status");
            feedback.textContent = "Возьмите поднос, когда будете готовы.";

            const controlHint = document.createElement("div");
            controlHint.className = "balance-control-hint";
            controlHint.innerHTML = "<span>←</span><strong>ВЕДИТЕ МЫШЬ</strong><span>→</span>";

            const stitchHint = document.createElement("div");
            stitchHint.className = "balance-stitch-hint";
            stitchHint.innerHTML = "<span>🐾</span><strong>СТИЧ ПОДСКАЗЫВАЕТ</strong><b>ДЕРЖИ ЦЕНТР</b>";

            const motionGlow = document.createElement("div");
            motionGlow.className = "balance-motion-glow";
            motionGlow.setAttribute("aria-hidden", "true");

            const trayRig = document.createElement("div");
            trayRig.className = "balance-tray-rig";
            trayRig.setAttribute("aria-label", "Магический поднос с тремя бокалами");
            trayRig.innerHTML =
                "<img class=\"balance-tray-art\" src=\"" + images.tray + "\" alt=\"\">" +
                "<div class=\"balance-tray-glass balance-tray-glass-left\">" +
                    "<span class=\"balance-tray-liquid balance-tray-liquid-blue\"></span>" +
                    "<img src=\"" + images.goblet + "\" alt=\"\">" +
                "</div>" +
                "<div class=\"balance-tray-glass balance-tray-glass-center\">" +
                    "<span class=\"balance-tray-liquid balance-tray-liquid-violet\"></span>" +
                    "<img src=\"" + images.goblet + "\" alt=\"\">" +
                "</div>" +
                "<div class=\"balance-tray-glass balance-tray-glass-right\">" +
                    "<span class=\"balance-tray-liquid balance-tray-liquid-gold\"></span>" +
                    "<img src=\"" + images.goblet + "\" alt=\"\">" +
                "</div>";

            const startCard = document.createElement("article");
            startCard.className = "balance-start-card panel";
            startCard.innerHTML =
                "<p class=\"eyebrow\">ПОСЛЕДНЕЕ ИСПЫТАНИЕ ТАВЕРНЫ</p>" +
                "<h2>Три бокала. Один поднос.</h2>" +
                "<p>Не гонитесь за маркером резко. Двигайте мышь в противоположную сторону от наклона и возвращайте его к центру.</p>";

            const startButton = game.mechanics.createButton("ВЗЯТЬ ПОДНОС", "gold-button");
            startCard.appendChild(startButton);

            const failureCard = document.createElement("article");
            failureCard.className = "balance-failure-card panel";
            failureCard.innerHTML =
                "<p class=\"eyebrow\">БОКАЛЫ НЕ РАЗБИЛИСЬ</p>" +
                "<h2>Грош успел поймать</h2>";
            const failureCopy = document.createElement("p");
            failureCopy.className = "balance-failure-copy";
            const retryButton = game.mechanics.createButton("ЕЩЁ ОДНА ПОПЫТКА", "gold-button");
            failureCard.append(failureCopy, retryButton);

            const completeVeil = document.createElement("div");
            completeVeil.className = "balance-complete-veil";
            completeVeil.setAttribute("aria-hidden", "true");

            const completeCard = document.createElement("article");
            completeCard.className = "balance-complete-card panel";
            completeCard.innerHTML =
                "<p class=\"eyebrow\">ПЕЧАТЬ РАВНОВЕСИЯ ПОЛУЧЕНА</p>" +
                "<div class=\"balance-seal\" aria-hidden=\"true\"><img src=\"" + images.sealBalance + "\" alt=\"Печать Равновесия\"></div>" +
                "<h2>Портал открыт</h2>" +
                "<blockquote>«Работа выполнена… в целом. Где-то хорошо, где-то - будем считать, что так и было задумано. Но раз уж таверна всё ещё стоит - зарплату вы заслужили.»</blockquote>" +
                "<p>Грош выплачивает ТуКо честно заработанные за вечер деньги. А заметив, как она засматривается на звёзды, вдруг достаёт из старого ящика давно завалявшуюся печать.</p>"+
                "<blockquote>«А это… кажется, тоже тебе пригодится. Всё равно у меня без дела валяется.»</blockquote>" +
                "<p>ТуКо получает Печать Равновесия.</p>";

            const finishButton = game.mechanics.createButton("ВЕРНУТЬСЯ НА ПОЛЕ", "gold-button");
            context.on(finishButton, "click", function () {
                game.audio.stop("ambience");
                context.goTo("board_after_tavern", {
                    checkpointId: "board_after_tavern",
                    save: true,
                    saveReason: "Таверна завершена: возврат на Центральный стол"
                });
            });
            completeCard.appendChild(finishButton);

            function clamp(value, minimum, maximum) {
                return Math.max(minimum, Math.min(maximum, value));
            }

            function cancelLoop() {
                if (animationId !== null) {
                    global.cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }

            function setSafeLimit(value) {
                safeLimit = value;
                screen.style.setProperty("--balance-safe-width", (safeLimit * 88) + "%");
            }

            function updateStitchHint() {
                if (attemptNumber < 2 || phase !== "running") {
                    screen.classList.remove(
                        "balance-stitch-help",
                        "balance-hint-left",
                        "balance-hint-right",
                        "balance-hint-center"
                    );
                    return;
                }

                screen.classList.add("balance-stitch-help");
                let direction = "center";

                if (tilt > 0.08) {
                    direction = "left";
                } else if (tilt < -0.08) {
                    direction = "right";
                }

                if (direction === lastHintDirection) {
                    return;
                }

                lastHintDirection = direction;
                screen.classList.toggle("balance-hint-left", direction === "left");
                screen.classList.toggle("balance-hint-right", direction === "right");
                screen.classList.toggle("balance-hint-center", direction === "center");

                const hintCopy = stitchHint.querySelector("b");
                if (direction === "left") {
                    hintCopy.textContent = "ВЕДИ МЫШЬ ВЛЕВО ←";
                } else if (direction === "right") {
                    hintCopy.textContent = "ВЕДИ МЫШЬ ВПРАВО →";
                } else {
                    hintCopy.textContent = "ДЕРЖИ ЦЕНТР";
                }
            }

            function updateVisuals() {
                const visualTilt = clamp(tilt, -1, 1);
                const markerPosition = clamp(50 + tilt * 43, 4, 96);

                screen.style.setProperty("--balance-position", markerPosition + "%");
                screen.style.setProperty("--balance-progress", String(clamp(elapsed / challengeDuration, 0, 1)));
                screen.style.setProperty(
                    "--balance-progress-angle",
                    (clamp(elapsed / challengeDuration, 0, 1) * 360) + "deg"
                );
                screen.style.setProperty("--balance-tilt", String(visualTilt));
                screen.style.setProperty("--balance-tilt-angle", (visualTilt * 10) + "deg");
                screen.style.setProperty("--balance-counter-angle", (visualTilt * -8) + "deg");
                screen.style.setProperty("--balance-glass-slide", (visualTilt * 24) + "px");

                screen.classList.toggle("balance-danger", Math.abs(tilt) > safeLimit);
                updateStitchHint();
            }

            function completeTask(fromSave) {
                cancelLoop();
                phase = "complete";
                elapsed = challengeDuration;
                tilt = 0;
                screen.classList.remove("balance-running", "balance-danger", "balance-failed");
                screen.classList.add("balance-complete");
                updateVisuals();
                feedback.textContent = "Портал набрал силу. Все три бокала удержаны.";

                if (!fromSave) {
                    const currentProgress = game.state.get().chapterProgress;
                    const currentSteps = game.state.get().pathSteps;
                    const currentSeals = game.state.get().seals;
                    game.state.patch({
                        chapterProgress: {
                            ...currentProgress,
                            tavern: 3
                        },
                        pathSteps: {
                            ...currentSteps,
                            tuko: Math.max(currentSteps.tuko, 3)
                        },
                        seals: {
                            ...currentSeals,
                            balance: true
                        }
                    });
                    game.save.write("Таверна пройдена: Печать Равновесия получена");
                    game.ui.showSubtitle("Печать Равновесия получена. ТуКо завершает главу с тремя очками пути.");
                }

                context.timeout(function () {
                    finishButton.focus();
                }, 520);
            }

            function failAttempt() {
                if (phase !== "running") {
                    return;
                }

                cancelLoop();
                phase = "failed";
                screen.classList.remove("balance-running", "balance-danger", "balance-stitch-help");
                screen.classList.add("balance-failed");
                failureCopy.textContent = attemptNumber === 1
                    ? "Слишком сильный наклон — но длинные пальцы Гроша спасли напитки. Следующая попытка будет немного легче."
                    : "Грош снова поймал бокалы и выразительно посмотрел на поднос. Без слов. Так даже страшнее.";
                feedback.textContent = "Попытка окончена. Уже пройденные задания таверны сохранены.";
                game.ui.showSubtitle("Грош ловит все три бокала. Ничего не потеряно — попробуйте ещё раз.");

                context.timeout(function () {
                    retryButton.focus();
                }, 360);
            }

            function runFrame(timestamp) {
                if (phase !== "running") {
                    return;
                }

                if (previousTimestamp === null) {
                    previousTimestamp = timestamp;
                }

                const delta = Math.min((timestamp - previousTimestamp) / 1000, 0.045);
                previousTimestamp = timestamp;
                elapsed += delta;

                if (!narrowed && elapsed >= challengeDuration / 2) {
                    narrowed = true;
                    setSafeLimit(Math.max(0.34, safeLimit - 0.16));
                    screen.classList.add("balance-narrowed");
                    feedback.textContent = "Портал усиливается — безопасная зона стала уже.";
                }

                const disturbance =
                    Math.sin(elapsed * 0.96 + 0.45) * 0.62 +
                    Math.sin(elapsed * 2.08 + 1.15) * 0.28 +
                    Math.sin(elapsed * 0.34 - 0.7) * 0.14;
                const targetTilt = clamp(disturbance + mouseControl * 1.12, -1.22, 1.22);
                tilt += (targetTilt - tilt) * Math.min(1, delta * 1.75);

                const inDanger = Math.abs(tilt) > safeLimit;
                if (inDanger) {
                    dangerTime += delta;
                } else {
                    dangerTime = Math.max(0, dangerTime - delta * 1.8);
                }

                if (inDanger !== wasInDanger) {
                    wasInDanger = inDanger;
                    feedback.textContent = inDanger
                        ? "Осторожно! Ведите мышь в противоположную сторону от наклона."
                        : "Равновесие восстановлено. Удерживайте маркер в зелёной зоне.";
                }

                updateVisuals();

                if (dangerTime >= 1.15 || Math.abs(tilt) >= 1.08) {
                    failAttempt();
                    return;
                }

                if (elapsed >= challengeDuration) {
                    completeTask(false);
                    return;
                }

                animationId = global.requestAnimationFrame(runFrame);
            }

            function startAttempt() {
                cancelLoop();
                attemptNumber += 1;
                phase = "running";
                elapsed = 0;
                previousTimestamp = null;
                mouseControl = 0;
                tilt = 0;
                dangerTime = 0;
                narrowed = false;
                wasInDanger = false;
                lastHintDirection = "";
                setSafeLimit(Math.min(0.68, 0.52 + (attemptNumber - 1) * 0.08));
                screen.classList.remove(
                    "balance-failed",
                    "balance-narrowed",
                    "balance-danger",
                    "balance-hint-left",
                    "balance-hint-right",
                    "balance-hint-center"
                );
                screen.classList.add("balance-running");
                feedback.textContent = attemptNumber === 1
                    ? "Поднос ожил. Удерживайте золотой маркер внутри зелёной зоны."
                    : "Зона стала шире. Стич будет показывать сторону для компенсации.";
                game.ui.showSubtitle("Ведите мышь влево и вправо. Если поднос наклоняется вправо — уводите мышь влево, и наоборот.");
                context.timeout(function () {
                    if (phase === "running") {
                        game.ui.hideSubtitle();
                    }
                }, 3200);
                updateVisuals();
                animationId = global.requestAnimationFrame(runFrame);
            }

            function updateMouseControl(event) {
                if (phase !== "running") {
                    return;
                }

                const bounds = stage.getBoundingClientRect();
                mouseControl = clamp(
                    ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
                    -1,
                    1
                );
            }

            context.on(startButton, "click", startAttempt);
            context.on(retryButton, "click", startAttempt);
            context.on(stage, "pointermove", updateMouseControl);
            context.registerCleanup(cancelLoop);

            stage.append(
                motionGlow,
                trayRig,
                timer,
                meter,
                header,
                feedback,
                controlHint,
                stitchHint,
                startCard,
                failureCard,
                completeVeil,
                completeCard
            );
            screen.append(stage);
            root.appendChild(screen);

            playTavernAmbience();

            if (alreadyComplete) {
                completeTask(true);
                game.ui.showSubtitle("Печать Равновесия уже получена. Глава таверны завершена.");
            } else {
                game.ui.showSubtitle("Последнее испытание таверны: удержите три бокала, пока кольцо времени не замкнётся.");
                context.timeout(function () {
                    startButton.focus();
                }, 420);
            }

            context.timeout(function () {
                screen.classList.add("balance-ready");
            }, 70);
        },

        unmount: function () {}
    };
})(window);
