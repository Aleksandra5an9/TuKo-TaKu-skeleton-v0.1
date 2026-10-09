
(function (global) {
    "use strict";

    const game = global.TUKO_TAKU =
        global.TUKO_TAKU || {};

    const MAX_PARALLEL = 4;

    const loaded = new Set();
    const loading = new Map();
    const failed = new Map();

    const imageCache = new Map();
    const audioCache = new Map();
    const videoCache = new Map();
    const sourceCache = new Map();
    const manifestCache = new Map();

    const queue = [];
    const progressListeners = new Set();

    let activeLoads = 0;
    let initialPromise = null;
    let loaderElement = null;
    let loaderHideTimer = null;

    const EXTENSIONS = {
        image: /\.(png|jpe?g|jfif|webp|gif|svg|avif)$/i,
        audio: /\.(mp3|wav|ogg|m4a|aac|flac)$/i,
        video: /\.(mp4|webm|mov|m4v)$/i,
        font: /\.(woff2?|ttf|otf)$/i
    };

    const GROUPS = {
        shared: {
            scripts: [
                "js/app.js"
            ],
            styles: [
                "css/main.css",
                "css/scenes.css"
            ]
        },

        prologue: {
            scripts: [
                "js/chapters/prologue.js"
            ],
            styles: []
        },

        board: {
            scripts: [
                "js/board.js"
            ],
            styles: [
                "css/board.css"
            ]
        },

        tavern: {
            scripts: [
                "js/chapters/tavern.js"
            ],
            styles: [
                "css/chapters/tavern.css"
            ]
        },

        spaceport: {
            scripts: [
                "js/chapters/spaceport.js"
            ],
            styles: [
                "css/chapters/spaceport.css"
            ]
        },

        arena: {
            scripts: [
                "js/chapters/arena.js"
            ],
            styles: [
                "css/chapters/arena.css"
            ]
        },

        casino: {
            scripts: [
                "js/chapters/casino.js"
            ],
            styles: [
                "css/chapters/casino.css"
            ]
        },

        finale: {
            scripts: [
                "js/chapters/finale.js"
            ],
            styles: [
                "css/chapters/finale.css"
            ]
        },

        epilogue: {
            scripts: [
                "js/chapters/epilogue.js"
            ],
            styles: [
                "css/chapters/epilogue.css"
            ]
        }
    };

    function normalizeUrl(src) {
        if (!src || typeof src !== "string") {
            return null;
        }

        try {
            return new URL(src, document.baseURI).href;
        } catch (error) {
            return null;
        }
    }

    function getExtension(url) {
        try {
            return new URL(url).pathname;
        } catch (error) {
            return url || "";
        }
    }

    function resourceType(url) {
        const path = getExtension(url);

        if (EXTENSIONS.image.test(path)) return "image";
        if (EXTENSIONS.audio.test(path)) return "audio";
        if (EXTENSIONS.video.test(path)) return "video";
        if (EXTENSIONS.font.test(path)) return "font";

        return null;
    }

    function notifyProgress(data) {
        progressListeners.forEach(function (callback) {
            try {
                callback(data);
            } catch (error) {
                console.warn("PRELOADER: ошибка обработчика прогресса", error);
            }
        });
    }

    function finishLoad(url, result, resolve) {
        if (result.ok) {
            loaded.add(url);
            failed.delete(url);
        } else {
            failed.set(url, result.error || "Ошибка загрузки");

            console.warn(
                "PRELOADER: не удалось загрузить",
                url,
                result.error || ""
            );
        }

        loading.delete(url);

        notifyProgress({
            url: url,
            ok: result.ok,
            loaded: loaded.size,
            failed: failed.size
        });

        resolve(result);
    }

    function performLoad(url) {
        const type = resourceType(url);

        if (!type) {
            return Promise.resolve({
                ok: true,
                skipped: true
            });
        }

        if (type === "image") {
            return loadImageResource(url);
        }

        if (type === "audio") {
            return loadAudioResource(url);
        }

        if (type === "video") {
            return loadVideoResource(url);
        }

        return loadFontResource(url);
    }

    function loadImageResource(url) {
        return new Promise(function (resolve) {
            const img = new Image();
            let finished = false;

            imageCache.set(url, img);
            img.decoding = "async";

            function finish(ok) {
                if (finished) return;
                finished = true;

                clearTimeout(timeout);

                img.onload = null;
                img.onerror = null;

                resolve({
                    ok: ok,
                    resource: img
                });
            }

            const timeout = setTimeout(function () {
                finish(false);
            }, 20000);

            img.onload = function () {
                if (typeof img.decode === "function") {
                    img.decode()
                        .catch(function () {})
                        .finally(function () {
                            finish(true);
                        });
                } else {
                    finish(true);
                }
            };

            img.onerror = function () {
                finish(false);
            };

            img.src = url;

            if (img.complete && img.naturalWidth > 0) {
                finish(true);
            }
        });
    }

    function loadAudioResource(url) {
        return new Promise(function (resolve) {
            const audio = new Audio();
            let finished = false;

            audio.preload = "auto";
            audio.muted = true;

            audioCache.set(url, audio);

            function finish(ok) {
                if (finished) return;
                finished = true;

                clearTimeout(timeout);

                audio.removeEventListener("canplay", onReady);
                audio.removeEventListener("canplaythrough", onReady);
                audio.removeEventListener("loadeddata", onReady);
                audio.removeEventListener("error", onError);

                resolve({
                    ok: ok,
                    resource: audio
                });
            }

            function onReady() {
                finish(true);
            }

            function onError() {
                finish(false);
            }

            const timeout = setTimeout(function () {
                finish(audio.readyState >= 2);
            }, 12000);

            audio.addEventListener("canplay", onReady, { once: true });
            audio.addEventListener("canplaythrough", onReady, { once: true });
            audio.addEventListener("loadeddata", onReady, { once: true });
            audio.addEventListener("error", onError, { once: true });

            audio.src = url;
            audio.load();

            if (audio.readyState >= 2) {
                finish(true);
            }
        });
    }

    function loadVideoResource(url) {
        return new Promise(function (resolve) {
            const video = document.createElement("video");
            let finished = false;

            video.preload = "auto";
            video.muted = true;
            video.playsInline = true;

            video.setAttribute("muted", "");
            video.setAttribute("playsinline", "");
            video.setAttribute("webkit-playsinline", "");

            videoCache.set(url, video);

            function finish(ok) {
                if (finished) return;
                finished = true;

                clearTimeout(timeout);

                video.removeEventListener("loadeddata", onReady);
                video.removeEventListener("canplay", onReady);
                video.removeEventListener("error", onError);

                resolve({
                    ok: ok,
                    resource: video
                });
            }

            function onReady() {
                finish(true);
            }

            function onError() {
                finish(false);
            }

            const timeout = setTimeout(function () {
                finish(video.readyState >= 2);
            }, 20000);

            video.addEventListener("loadeddata", onReady, { once: true });
            video.addEventListener("canplay", onReady, { once: true });
            video.addEventListener("error", onError, { once: true });

            video.src = url;
            video.load();

            if (video.readyState >= 2) {
                finish(true);
            }
        });
    }

    function loadFontResource(url) {
        return fetch(url, {
            cache: "force-cache"
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            return response.arrayBuffer();
        }).then(function (data) {
            return {
                ok: data.byteLength > 0,
                resource: data
            };
        }).catch(function (error) {
            return {
                ok: false,
                error: error.message
            };
        });
    }

    function pumpQueue() {
        while (activeLoads < MAX_PARALLEL && queue.length) {
            const task = queue.shift();

            activeLoads++;

            performLoad(task.url)
                .catch(function (error) {
                    return {
                        ok: false,
                        error: error.message
                    };
                })
                .then(function (result) {
                    finishLoad(task.url, result, task.resolve);
                })
                .finally(function () {
                    activeLoads--;
                    pumpQueue();
                });
        }
    }

    function loadAsset(src) {
        const url = normalizeUrl(src);

        if (!url) {
            return Promise.resolve({
                ok: false,
                error: "Некорректный путь"
            });
        }

        if (loaded.has(url)) {
            return Promise.resolve({
                ok: true,
                cached: true
            });
        }

        if (loading.has(url)) {
            return loading.get(url);
        }

        if (!resourceType(url)) {
            return Promise.resolve({
                ok: true,
                skipped: true
            });
        }

        let resolveTask;

        const promise = new Promise(function (resolve) {
            resolveTask = resolve;
        });

        loading.set(url, promise);

        queue.push({
            url: url,
            resolve: resolveTask
        });

        pumpQueue();

        return promise;
    }

    function loadImage(src) {
        return loadAsset(src);
    }

    function uniqueUrls(list) {
        const result = new Set();

        if (!Array.isArray(list)) {
            return [];
        }

        list.forEach(function (src) {
            const url = normalizeUrl(src);

            if (url && resourceType(url)) {
                result.add(url);
            }
        });

        return Array.from(result);
    }

    function loadList(list, options) {
        options = options || {};

        const urls = uniqueUrls(list);
        const total = urls.length;

        let done = 0;
        let errorCount = 0;

        function report() {
            if (typeof options.onProgress !== "function") return;

            options.onProgress({
                total: total,
                done: done,
                failed: errorCount,
                percent: total ? Math.round(done / total * 100) : 100
            });
        }

        report();

        return Promise.all(
            urls.map(function (url) {
                return loadAsset(url).then(function (result) {
                    done++;

                    if (!result.ok) {
                        errorCount++;
                    }

                    report();

                    return result;
                });
            })
        ).then(function () {
            return {
                total: total,
                done: done,
                failed: errorCount,
                percent: 100
            };
        });
    }

    function collectConfigPaths(value, output, depth) {
        output = output || [];
        depth = depth || 0;

        if (depth > 8 || value == null) {
            return output;
        }

        if (typeof value === "string") {
            if (/assets\//i.test(value) && resourceType(value)) {
                output.push(value);
            }

            return output;
        }

        if (Array.isArray(value)) {
            value.forEach(function (item) {
                collectConfigPaths(item, output, depth + 1);
            });

            return output;
        }

        if (typeof value === "object") {
            Object.keys(value).forEach(function (key) {
                collectConfigPaths(value[key], output, depth + 1);
            });
        }

        return output;
    }

    function normalizeChapter(id) {
        id = String(id || "shared")
            .toLowerCase()
            .replace(/\.js$/, "");

        if (GROUPS[id]) return id;

        if (id === "menu") return "shared";

        const prefixes = [
            ["prologue_", "prologue"],
            ["board_", "board"],
            ["handover_", "board"],
            ["tavern_", "tavern"],
            ["spaceport_", "spaceport"],
            ["arena_", "arena"],
            ["casino_", "casino"],
            ["finale_", "finale"],
            ["epilogue_", "epilogue"]
        ];

        for (const entry of prefixes) {
            if (id.indexOf(entry[0]) === 0) {
                return entry[1];
            }
        }

        return "shared";
    }

    function findSourceUrl(relativePath, selector, attribute) {
        const elements = document.querySelectorAll(selector);

        for (const element of elements) {
            const raw = element.getAttribute(attribute);

            if (!raw) continue;

            const url = normalizeUrl(raw);

            if (url && new URL(url).pathname.endsWith("/" + relativePath)) {
                return url;
            }
        }

        return normalizeUrl(relativePath);
    }

    function getSourceText(url) {
        if (sourceCache.has(url)) {
            return sourceCache.get(url);
        }

        const promise = (async function () {
            if (!/^https?:/i.test(url)) {
                return "";
            }

            try {
                const response = await fetch(url, {
                    cache: "force-cache"
                });

                if (!response.ok) return "";

                return await response.text();
            } catch (error) {
                console.warn(
                    "PRELOADER: не удалось прочитать список ресурсов",
                    url
                );

                return "";
            }
        })();

        sourceCache.set(url, promise);

        return promise;
    }

    function folderForBareFilename(path) {
        if (EXTENSIONS.audio.test(path)) return "audio";
        if (EXTENSIONS.video.test(path)) return "video";
        if (EXTENSIONS.font.test(path)) return "fonts";

        return "images";
    }

    function extractAssetUrls(text, sourceUrl) {
        const result = new Set();

        if (!text) return [];

        const cleanText = text
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*\/\/.*$/gm, "");

        function addPath(raw) {
            raw = String(raw || "").trim();

            if (!raw || /^(data:|blob:|javascript:)/i.test(raw)) {
                return;
            }

            if (!resourceType(raw)) {
                return;
            }

            try {
                let url;

                if (/^https?:\/\//i.test(raw)) {
                    url = new URL(raw);

                    if (url.origin !== location.origin) return;
                } else if (/^assets\//i.test(raw)) {
                    url = new URL(raw, document.baseURI);
                } else if (/^\.\/assets\//i.test(raw)) {
                    url = new URL(raw.slice(2), document.baseURI);
                } else if (/^\/assets\//i.test(raw)) {
                    url = new URL(raw, location.origin);
                } else if (/assets\//i.test(raw)) {
                    url = new URL(raw, sourceUrl);
                } else if (!raw.includes("/")) {
                    url = new URL(
                        "assets/" + folderForBareFilename(raw) + "/" + raw,
                        document.baseURI
                    );
                } else {
                    return;
                }

                result.add(url.href);
            } catch (error) {}
        }

        const stringPattern = /(["'`])([^"'`\r\n]{1,300})\1/g;
        let match;

        while ((match = stringPattern.exec(cleanText)) !== null) {
            addPath(match[2]);
        }

        const cssUrlPattern =
            /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/gi;

        while ((match = cssUrlPattern.exec(cleanText)) !== null) {
            addPath(match[2]);
        }

        return Array.from(result);
    }

    async function scanSourceGroup(groupId) {
        const group = GROUPS[groupId];

        if (!group) return [];

        const result = new Set();

        const tasks = [];

        group.scripts.forEach(function (path) {
            tasks.push({
                path: path,
                selector: "script[src]",
                attribute: "src"
            });
        });

        group.styles.forEach(function (path) {
            tasks.push({
                path: path,
                selector: 'link[rel="stylesheet"][href]',
                attribute: "href"
            });
        });

        for (const task of tasks) {
            const url = findSourceUrl(
                task.path,
                task.selector,
                task.attribute
            );

            if (!url) continue;

            const text = await getSourceText(url);
            const assets = extractAssetUrls(text, url);

            assets.forEach(function (asset) {
                result.add(asset);
            });
        }

        return Array.from(result);
    }

    function getGroupAssets(groupId) {
        if (manifestCache.has(groupId)) {
            return manifestCache.get(groupId);
        }

        const promise = (async function () {
            const configPreloader =
                game.config && game.config.preloader
                    ? game.config.preloader
                    : {};

            const configured = Array.isArray(configPreloader[groupId])
                ? configPreloader[groupId]
                : [];

            let sharedConfigPaths = [];

            if (groupId === "shared" && game.config) {
                sharedConfigPaths = []
                    .concat(collectConfigPaths(game.config.players))
                    .concat(collectConfigPaths(game.config.images));
            }

            const scanned = await scanSourceGroup(groupId);

            return uniqueUrls(
                configured
                    .concat(sharedConfigPaths)
                    .concat(scanned)
            );
        })();

        manifestCache.set(groupId, promise);

        return promise;
    }

    async function getChapterAssets(chapterId) {
        const normalized = normalizeChapter(chapterId);

        const sharedAssets = await getGroupAssets("shared");

        if (normalized === "shared") {
            return sharedAssets;
        }

        const chapterAssets = await getGroupAssets(normalized);

        return uniqueUrls(
            sharedAssets.concat(chapterAssets)
        );
    }

    function createLoader() {
        if (loaderElement) return loaderElement;

        const overlay = document.createElement("div");

        overlay.id = "game-preloader-overlay";

        overlay.innerHTML = `
            <div class="game-preloader-panel">
                <div class="game-preloader-kicker">
                    ТУКО И ТАКУ
                </div>

                <div class="game-preloader-title">
                    ПОДГОТОВКА МИРА
                </div>

                <div class="game-preloader-track">
                    <div class="game-preloader-bar"></div>
                </div>

                <div class="game-preloader-status">
                    Подготавливаем магию...
                </div>

                <div class="game-preloader-percent">
                    0%
                </div>
            </div>
        `;

        const style = document.createElement("style");

        style.textContent = `
            #game-preloader-overlay {
                position: fixed;
                inset: 0;
                z-index: 2147483000;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #090713;
                color: #fff9e9;
                opacity: 0;
                visibility: hidden;
                transition: opacity .25s ease;
                font-family: "Segoe UI", Arial, sans-serif;
            }

            #game-preloader-overlay.is-visible {
                opacity: 1;
                visibility: visible;
            }

            .game-preloader-panel {
                width: min(440px, 84vw);
                text-align: center;
            }

            .game-preloader-kicker {
                margin-bottom: 16px;
                color: #f5c75d;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: .3em;
            }

            .game-preloader-title {
                margin-bottom: 28px;
                font-family: Georgia, serif;
                font-size: clamp(23px, 4vw, 36px);
                letter-spacing: .04em;
            }

            .game-preloader-track {
                height: 8px;
                overflow: hidden;
                border: 1px solid rgba(245,199,93,.35);
                border-radius: 20px;
                background: rgba(255,255,255,.08);
            }

            .game-preloader-bar {
                width: 0;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    #9b762e,
                    #f5c75d,
                    #fff1bd
                );
                box-shadow: 0 0 20px rgba(245,199,93,.4);
                transition: width .18s ease;
            }

            .game-preloader-status {
                margin-top: 16px;
                color: #c6bfd3;
                font-size: 13px;
            }

            .game-preloader-percent {
                margin-top: 8px;
                color: #f5c75d;
                font-size: 12px;
                font-variant-numeric: tabular-nums;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        loaderElement = overlay;

        return overlay;
    }

    function showLoader() {
        if (loaderHideTimer) {
            clearTimeout(loaderHideTimer);
            loaderHideTimer = null;
        }

        const overlay = createLoader();

        overlay.classList.add("is-visible");
    }

    function updateLoader(progress, label) {
        if (!loaderElement) return;

        const bar = loaderElement.querySelector(".game-preloader-bar");
        const status = loaderElement.querySelector(".game-preloader-status");
        const percent = loaderElement.querySelector(".game-preloader-percent");

        if (bar) {
            bar.style.width = (progress.percent || 0) + "%";
        }

        if (status) {
            status.textContent =
                label ||
                ("Подготовлено: " + progress.done + " из " + progress.total);
        }

        if (percent) {
            percent.textContent = (progress.percent || 0) + "%";
        }
    }

    function hideLoader() {
        if (!loaderElement) return;

        loaderElement.classList.remove("is-visible");
    }

    function loadInitial() {
        if (initialPromise) return initialPromise;

        initialPromise = (async function () {
            showLoader();

            const startedAt = Date.now();

            try {
                const queryScene =
                    new URLSearchParams(location.search).get("scene");

                const firstGroup = queryScene
                    ? normalizeChapter(queryScene)
                    : "prologue";

                const shared = await getGroupAssets("shared");
                const first = await getGroupAssets(firstGroup);

                const result = await loadList(
                    uniqueUrls(shared.concat(first)),
                    {
                        onProgress: function (progress) {
                            updateLoader(
                                progress,
                                "Подготавливаем ресурсы..."
                            );
                        }
                    }
                );

                updateLoader(
                    result,
                    result.failed
                        ? "Некоторые ресурсы не загрузились. Игра продолжится."
                        : "Мир готов."
                );

                const minimumVisible = 450;
                const remaining = minimumVisible - (Date.now() - startedAt);

                if (remaining > 0) {
                    await new Promise(function (resolve) {
                        setTimeout(resolve, remaining);
                    });
                }

                return result;
            } catch (error) {
                console.error("PRELOADER: ошибка стартовой загрузки", error);

                return {
                    total: 0,
                    done: 0,
                    failed: 1
                };
            } finally {
                hideLoader();
            }
        })();

        return initialPromise;
    }

    function loadChapter(chapterId) {
        return getChapterAssets(chapterId).then(function (assets) {
            return loadList(assets);
        });
    }

    async function ensureChapterLoaded(chapterId) {
        const assets = await getChapterAssets(chapterId);

        const missing = assets.some(function (src) {
            const url = normalizeUrl(src);
            return url && !loaded.has(url);
        });

        if (!missing) {
            return {
                total: assets.length,
                done: assets.length,
                failed: 0,
                percent: 100
            };
        }

        showLoader();

        try {
            const result = await loadList(assets, {
                onProgress: function (progress) {
                    updateLoader(
                        progress,
                        "Подготавливаем следующую сцену..."
                    );
                }
            });

            return result;
        } finally {
            hideLoader();
        }
    }

    function loadAudio(src) {
        return loadAsset(src);
    }

    function loadVideo(src) {
        return loadAsset(src);
    }

    function getVideo(src) {
        const url = normalizeUrl(src);
        return url ? videoCache.get(url) || null : null;
    }

    function isLoaded(src) {
        const url = normalizeUrl(src);
        return !!url && loaded.has(url);
    }

    function onProgress(callback) {
        if (typeof callback !== "function") {
            return function () {};
        }

        progressListeners.add(callback);

        return function () {
            progressListeners.delete(callback);
        };
    }

    game.preloader = {
        loadImage: loadImage,
        loadAudio: loadAudio,
        loadVideo: loadVideo,
        loadList: loadList,
        loadChapter: loadChapter,
        loadInitial: loadInitial,
        ensureChapterLoaded: ensureChapterLoaded,
        getVideo: getVideo,
        isLoaded: isLoaded,
        onProgress: onProgress,
        ready: null
    };

    // Начинаем загрузку меню и первого этапа заранее.
    game.preloader.ready = loadInitial();

})(window);
