(function (global) {
    "use strict";

    const game = global.TUKO_TAKU = global.TUKO_TAKU || {};

    function worldState(finaleProgress) {
        return {
            activePlayer: "both",
            seals: {
                balance: true,
                navigation: true,
                cunning: true,
                courage: true
            },
            pathSteps: {
                tuko: 6,
                taku: 6
            },
            chapterProgress: {
                tavern: 3,
                spaceport: 3,
                casino: 3,
                arena: 3,
                finale: finaleProgress || 0
            }
        };
    }

    game.config = {
        title: "ТуКо и ТаКу",
        build: "финал 0.8.0",
        saveVersion: 1,
        saveKey: "tuko_taku_save_v1",
        settingsKey: "tuko_taku_settings_v1",

        ui: {
            overlayMessages: false,
            toastMessages: false
        },

        debug: {
            enabled: true,
            startScene: null,
            queryParameter: "scene",
            presetParameter: "preset",

            presets: {
                fresh: {
                    activePlayer: "tuko",
                    seals: { balance: false, navigation: false, cunning: false, courage: false },
                    pathSteps: { tuko: 0, taku: 0 },
                    chapterProgress: { tavern: 0, spaceport: 0, casino: 0, arena: 0, finale: 0 },
                    hintUsage: {}
                },

                after_tuko_roll: {
                    activePlayer: "tuko",
                    pathSteps: { tuko: 3, taku: 0 },
                    chapterProgress: { tavern: 0 }
                },

                tavern_task1_done: {
                    activePlayer: "tuko",
                    pathSteps: { tuko: 3, taku: 0 },
                    chapterProgress: { tavern: 1 }
                },

                tavern_task2_done: {
                    activePlayer: "tuko",
                    pathSteps: { tuko: 3, taku: 0 },
                    chapterProgress: { tavern: 2 }
                },

                tavern_done: {
                    activePlayer: "tuko",
                    seals: { balance: true },
                    pathSteps: { tuko: 3, taku: 0 },
                    chapterProgress: { tavern: 3 }
                },

                spaceport_open: {
                    activePlayer: "taku",
                    seals: { balance: true },
                    pathSteps: { tuko: 3, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 0 }
                },

                spaceport_core_done: {
                    activePlayer: "taku",
                    seals: { balance: true },
                    pathSteps: { tuko: 3, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 1 }
                },

                spaceport_route_done: {
                    activePlayer: "taku",
                    seals: { balance: true },
                    pathSteps: { tuko: 3, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 2 }
                },

                spaceport_done: {
                    activePlayer: "taku",
                    seals: { balance: true, navigation: true },
                    pathSteps: { tuko: 3, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 3 }
                },

                after_spaceport: {
                    activePlayer: "tuko",
                    seals: { balance: true, navigation: true },
                    pathSteps: { tuko: 3, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 0 }
                },

                arena_open: {
                    activePlayer: "tuko",
                    seals: { balance: true, navigation: true },
                    pathSteps: { tuko: 6, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 0 }
                },

                arena_read_done: {
                    activePlayer: "tuko",
                    seals: { balance: true, navigation: true },
                    pathSteps: { tuko: 6, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 1 }
                },

                arena_dance_done: {
                    activePlayer: "tuko",
                    seals: { balance: true, navigation: true },
                    pathSteps: { tuko: 6, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 2 }
                },

                arena_done: {
                    activePlayer: "tuko",
                    seals: { balance: true, navigation: true, courage: true },
                    pathSteps: { tuko: 6, taku: 3 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 3 }
                },

                casino_open: {
                    activePlayer: "taku",
                    seals: { balance: true, navigation: true, courage: true },
                    pathSteps: { tuko: 6, taku: 6 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 3, casino: 0 }
                },

                casino_plan_done: {
                    activePlayer: "taku",
                    seals: { balance: true, navigation: true, courage: true },
                    pathSteps: { tuko: 6, taku: 6 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 3, casino: 1 }
                },

                casino_pattern_done: {
                    activePlayer: "taku",
                    seals: { balance: true, navigation: true, courage: true },
                    pathSteps: { tuko: 6, taku: 6 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 3, casino: 2 }
                },

                casino_done: {
                    activePlayer: "taku",
                    seals: { balance: true, navigation: true, courage: true, cunning: true },
                    pathSteps: { tuko: 6, taku: 6 },
                    chapterProgress: { tavern: 3, spaceport: 3, arena: 3, casino: 3, finale: 0 }
                },

                finale_open: worldState(0),
                finale_rule_broken: worldState(1),
                finale_bridge_done: worldState(2),
                finale_rotate_done: worldState(3),
                finale_die_done: worldState(4),
                finale_confirm_done: worldState(5),
                finale_done: worldState(6)
            }
        },

        players: {
            tuko: {
                shortName: "ТуКо",
                fullName: "Туфля Ко",
                color: "#6aff81",
                image: "assets/images/piece_tuko.png"
            },
            taku: {
                shortName: "ТаКу",
                fullName: "Таблица Ку",
                color: "#bb78ff",
                image: "assets/images/piece_taku.png"
            }
        },

        images: {
            stitch: "assets/images/stitch_idle.png",
            host: "assets/images/host_full.png",
            pixie: "assets/images/pixie.png",
            prologueTitle: "assets/images/prologue_title_bg.png",
            prologueScan: "assets/images/prologue_scan_bg.png",
            prologueStorage: "assets/images/prologue_storage_bg.png",
            centralTable: "assets/images/central_table_bg.png"
        },

        chapterOrder: [
            { id: "tavern", title: "Таверна между мирами", player: "tuko" },
            { id: "spaceport", title: "Порт Нулевой Орбиты", player: "taku" },
            { id: "arena", title: "Древняя арена", player: "tuko" },
            { id: "casino", title: "Магическое казино", player: "taku" },
            { id: "finale", title: "Центр игры", player: "both" }
        ],

        sceneTitles: {
            menu: "Главное меню",
            prologue_title: "Пролог",
            prologue_scan: "Проверка игроков",
            prologue_storage: "Найден ещё один участник",
            board_intro: "Центральный стол",
            handover_tuko_1: "Передача хода",
            board_roll_tavern: "Первый бросок",
            tavern_arrival: "Таверна между мирами",
            tavern_intro: "Разговор с Грошем",
            tavern_orders: "Заказы без слов",
            tavern_smoke: "Звёздная вязь",
            tavern_balance: "Баланс миров",
            board_after_tavern: "Событие поля",
            handover_taku_1: "Передача хода ТаКу",
            board_roll_spaceport: "Бросок в Космопорт",
            spaceport_intro: "Порт Нулевой Орбиты",
            spaceport_core: "Навигационное ядро",
            spaceport_route: "Маршрут",
            spaceport_energy: "Энергоконтур",
            spaceport_clue: "Журнал Кости перехода",
            spaceport_outro: "Печать Логики",
            board_after_spaceport: "Пересчёт",
            handover_tuko_2: "Передача второго хода ТуКо",
            board_roll_arena: "Бросок в Древнюю арену",
            arena_intro: "Древняя арена",
            arena_read: "Читай движение",
            arena_dance: "Танец на краю",
            arena_freedom_seal: "Печать освобождения",
            arena_outro: "Финал Древней арены",
            board_after_arena: "ТуКо у центра",
            handover_taku_2: "Передача последнего хода ТаКу",
            board_roll_casino: "Бросок в Магическое казино",
            casino_intro: "Магическое казино",
            casino_plan: "Собрать план",
            casino_pattern: "Поймать закономерность",
            casino_security: "Охранная сеть",
            casino_outro: "Печать Хитрости",
            board_after_casino: "Обе у центра",
            finale_reveal: "Финал · Последнее правило",
            finale_false_choice: "Финал · Ложный выбор",
            finale_controls: "Финал · Два игрока",
            finale_bridge: "Финал · Плита и мост",
            finale_rotate: "Финал · Поворот пути",
            finale_die: "Финал · Кость против Ведущего",
            finale_confirm: "Финал · Активировать вместе",
            finale_restore: "Финал · Имена восстановлены",
            epilogue_congratulation: "Поздравление",
            epilogue_results: "Результаты",
            epilogue_menu: "Конец игры"
        },

        preloader: {
            shared: [
                "assets/images/piece_tuko.png",
                "assets/images/piece_taku.png",
                "assets/images/stitch_idle.png",
                "assets/images/host_full.png",
                "assets/images/pixie.png"
            ],

            prologue: [
                "assets/images/prologue_title_bg.png",
                "assets/images/prologue_scan_bg.png",
                "assets/images/prologue_storage_bg.png",
                "assets/images/central_table_bg.png"
            ],

            tavern: [
                "assets/images/tavern_entrance_bg.png",
                "assets/images/tavern_bartender.png",
                "assets/images/tavern_guests.png",
                "assets/images/tavern_goblet.png",
                "assets/images/tavern_mermaid_basin.png",
                "assets/images/tavern_constellation_bg.png",
                "assets/images/constellation_ursa.png",
                "assets/images/constellation_libra.png",
                "assets/images/constellation_orion.png",
                "assets/images/tavern_task3_balance_bg.png",
                "assets/images/tavern_task3_tray.png",
                "assets/images/tavern_bottle_moon.png",
                "assets/images/tavern_bottle_flame.png",
                "assets/images/tavern_bottle_wave.png",
                "assets/images/tavern_bottle_root.png",
                "assets/images/tavern_bottle_star.png",
                "assets/images/tavern_bottle_dew.png"
            ],

            spaceport: [
                "assets/images/spaceport_module_pyramid.png",
                "assets/images/spaceport_module_ring.png",
                "assets/images/spaceport_module_diamond.png",
                "assets/images/spaceport_module_sphere.png",
                "assets/images/spaceport_module_star.png",
                "assets/images/spaceport_module_crescent.png",
                "assets/images/spaceport_route_bg.png",
                "assets/images/spaceport_planet_rings.png",
                "assets/images/spaceport_planet_crystal.png",
                "assets/images/spaceport_planet_vortex.png",
                "assets/images/spaceport_planet_twinstar.png",
                "assets/images/spaceport_ship_violet.png",
                "assets/images/spaceport_ship_blue.png",
                "assets/images/spaceport_ship_green.png",
                "assets/images/spaceport_ship_gold.png"
            ],

            arena: [
                "assets/images/arena_bg.png",
                "assets/images/arena_dragon_idle.png",
                "assets/images/arena_dragon_inhale.png",
                "assets/images/arena_dragon_tail.png",
                "assets/images/arena_dragon_fire.png",
                "assets/images/arena_beast_idle.png",
                "assets/images/arena_beast_paw.png"
            ],

            casino: [
                "assets/images/casino_bg.png",
                "assets/images/casino_roulette_bg.png",
                "assets/images/casino_security_bg.png",
                "assets/images/lady_chance_idle.png",
                "assets/images/lady_chance_talk.png",
                "assets/images/casino_chip_empty.png",
                "assets/images/mirror_lens.png",
                "assets/images/service_key.png",
                "assets/images/casino_golem_sleep.png",
                "assets/images/casino_golem_awake.png",
                "assets/images/living_card.png",
                "assets/images/casino_symbol_crown.png",
                "assets/images/casino_symbol_moon.png",
                "assets/images/casino_symbol_star.png",
                "assets/images/casino_symbol_center.png",
                "assets/images/roulette_hidden_mechanism.png",
                "assets/images/security_mirror.png",
                "assets/images/alarm_crystal.png",
                "assets/images/seal_vault_closed.png",
                "assets/images/seal_vault_open.png",
                "assets/images/seal_cunning.png"
            ],

            finale: [
                "assets/images/final_table_bg.png",
                "assets/images/central_table_bg.png",
                "assets/images/final_green_path.png",
                "assets/images/final_violet_path.png",
                "assets/images/pressure_plate.png",
                "assets/images/temporary_bridge.png",
                "assets/images/rotating_bridge_01.png",
                "assets/images/rotating_bridge_02.png",
                "assets/images/rotating_bridge_03.png",
                "assets/images/central_lock_closed.png",
                "assets/images/central_lock_half.png",
                "assets/images/central_lock_open.png",
                "assets/images/final_false_choice_bg.png",
                "assets/images/rigged_die.png",
                "assets/images/host_mask_cracked.png",
                "assets/images/final_star_space.png",
                "assets/images/casino_symbol_crown.png",
                "assets/images/casino_symbol_moon.png",
                "assets/images/casino_symbol_star.png",
                "assets/images/casino_symbol_center.png"
            ],

            epilogue: [
                "assets/images/epilogue_congratulation_bg.png",
                "assets/images/epilogue_results_bg.png",
                "assets/images/epilogue_menu.png",
                "assets/images/nastya_real.png",
                "assets/images/rita_real.png"
            ]
        }
    };
})(window);
