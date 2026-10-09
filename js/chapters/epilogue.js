(function (global) {
    "use strict";

    const game = global.TUKO_TAKU;
    game.scenes = game.scenes || {};
    game.chapters = game.chapters || {};

    const IMG = {
        congratulation: "assets/images/epilogue_congratulation_bg.png",
        results: "assets/images/epilogue_results_bg.png",
        menu: "assets/images/epilogue_menu.png",
        nastya: "assets/images/nastya_real.png",
        rita: "assets/images/rita_real.png"
    };

    function image(src, className, alt) {
        return game.mechanics.createImage(src, className || "", alt || "");
    }

    function base(context, sceneClass, src, title) {
        const screen = document.createElement("section");
        screen.className = "screen epilogue-screen " + sceneClass;

        const stage = document.createElement("div");
        stage.className = "epilogue-stage";

        const bg = image(src, "epilogue-background", title);
        stage.appendChild(bg);

        const veil = document.createElement("div");
        veil.className = "epilogue-veil";
        stage.appendChild(veil);

        screen.append(
            game.ui.createHud(context, {
                title: title,
                showPlayer: false
            }),
            stage
        );

        return { screen, stage };
    }

    function nextButton(context, label, sceneId, checkpointId) {
        const button = game.mechanics.createButton(label, "gold-button epilogue-next");
        context.on(button, "click", function () {
            context.goTo(sceneId, {
                checkpointId: checkpointId || sceneId,
                save: true,
                saveReason: "эпилог: " + sceneId
            });
        });
        return button;
    }

    game.scenes.epilogue_congratulation = {
        id: "epilogue_congratulation",

        mount: function (root, context) {
            const baseScene = base(
                context,
                "epilogue-congratulation-screen",
                IMG.congratulation,
                "Поздравление"
            );

            const nastya = image(IMG.nastya, "epilogue-person epilogue-nastya", "Настя");
            const rita = image(IMG.rita, "epilogue-person epilogue-rita", "Рита");

            const card = document.createElement("article");
            card.className = "epilogue-card panel";
            card.innerHTML =
                "<p class=\"eyebrow\">ПАРТИЯ ЗАВЕРШЕНА</p>" +
                "<h1>Вы обе победили.</h1>" +
                "<p>Игра больше не требует выбрать одну из вас.</p>" +
                "<strong>Настя и Рита — вместе.</strong>";

            const button = nextButton(context, "ПОСМОТРЕТЬ РЕЗУЛЬТАТЫ", "epilogue_results");
            card.appendChild(button);

            baseScene.stage.append(nastya, rita, card);
            root.appendChild(baseScene.screen);
            context.timeout(function () {
                baseScene.screen.classList.add("epilogue-ready");
                button.focus();
            }, 80);
        },

        unmount: function () {}
    };

    game.scenes.epilogue_results = {
        id: "epilogue_results",

        mount: function (root, context) {
            const baseScene = base(
                context,
                "epilogue-results-screen",
                IMG.results,
                "Результаты"
            );

            const card = document.createElement("article");
            card.className = "epilogue-card epilogue-results-card panel";
            card.innerHTML =
                "<p class=\"eyebrow\">РЕЗУЛЬТАТ ПАРТИИ</p>" +
                "<h1>Все четыре печати собраны.</h1>" +
                "<div class=\"epilogue-seal-results\">" +
                    "<span>Равновесие</span>" +
                    "<span>Логика</span>" +
                    "<span>Смелость</span>" +
                    "<span>Хитрость</span>" +
                "</div>" +
                "<p>Главное правило оказалось самым простым: никто не должен проигрывать ради того, чтобы другой победил.</p>";

            const button = nextButton(context, "ЗАВЕРШИТЬ ИГРУ", "epilogue_menu");
            card.appendChild(button);

            baseScene.stage.appendChild(card);
            root.appendChild(baseScene.screen);
            context.timeout(function () {
                baseScene.screen.classList.add("epilogue-ready");
                button.focus();
            }, 80);
        },

        unmount: function () {}
    };

    game.scenes.epilogue_menu = {
        id: "epilogue_menu",

        mount: function (root, context) {
            const baseScene = base(
                context,
                "epilogue-menu-screen",
                IMG.menu,
                "Конец игры"
            );

            const card = document.createElement("article");
            card.className = "epilogue-card epilogue-menu-card panel";
            card.innerHTML =
                "<p class=\"eyebrow\">ТУКо И ТАКУ</p>" +
                "<h1>До следующей партии.</h1>" +
                "<p>Доска замолчала. Но некоторые игры заканчиваются только затем, чтобы однажды начаться снова.</p>";

            const button = game.mechanics.createButton("В ГЛАВНОЕ МЕНЮ", "gold-button epilogue-next");
            context.on(button, "click", function () {
                context.goTo("menu", { updateState: false, save: false });
            });
            card.appendChild(button);

            baseScene.stage.appendChild(card);
            root.appendChild(baseScene.screen);
            context.timeout(function () {
                baseScene.screen.classList.add("epilogue-ready");
                button.focus();
            }, 80);
        },

        unmount: function () {}
    };

    game.chapters.epilogue = {
        id: "epilogue",
        status: "playable"
    };
})(window);
