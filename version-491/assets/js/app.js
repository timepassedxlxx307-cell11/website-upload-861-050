(function () {
    function select(selector, root) {
        return (root || document).querySelector(selector);
    }

    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = select('.menu-toggle');
        var menu = select('.mobile-nav');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            var opened = menu.hasAttribute('hidden');
            if (opened) {
                menu.removeAttribute('hidden');
            } else {
                menu.setAttribute('hidden', '');
            }
            button.setAttribute('aria-expanded', String(opened));
        });
    }

    function setupHero() {
        var slider = select('.hero-slider');
        if (!slider) {
            return;
        }
        var slides = selectAll('.hero-slide', slider);
        var dots = selectAll('.hero-dot', slider);
        var prev = select('.hero-prev', slider);
        var next = select('.hero-next', slider);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }
        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }
        restart();
    }

    function queryFromUrl() {
        try {
            return new URLSearchParams(window.location.search).get('q') || '';
        } catch (error) {
            return '';
        }
    }

    function normalize(text) {
        return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function applyFilter(value, root) {
        var scope = root || document;
        var keyword = normalize(value);
        var cards = selectAll('[data-search]', scope);
        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute('data-search') || card.textContent);
            card.classList.toggle('is-hidden', keyword && haystack.indexOf(keyword) === -1);
        });
    }

    function setupSearch() {
        var q = queryFromUrl();
        var input = select('[data-search-input]');
        if (input) {
            input.value = q;
            applyFilter(q);
            input.addEventListener('input', function () {
                applyFilter(input.value);
            });
        }
        selectAll('.inline-filter-form').forEach(function (form) {
            var localInput = select('[data-local-filter="true"]', form);
            var scope = select('.filter-scope');
            if (!localInput || !scope) {
                return;
            }
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilter(localInput.value, scope);
            });
            localInput.addEventListener('input', function () {
                applyFilter(localInput.value, scope);
            });
        });
    }

    function setupPlayer() {
        selectAll('.video-frame').forEach(function (frame) {
            var video = select('video', frame);
            var cover = select('.player-cover', frame);
            var source = frame.getAttribute('data-play');
            var hlsInstance = null;
            var prepared = false;
            function prepare() {
                if (prepared || !video || !source) {
                    return;
                }
                prepared = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = source;
                }
            }
            function play() {
                prepare();
                frame.classList.add('playing');
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        frame.classList.remove('playing');
                    });
                }
            }
            if (cover) {
                cover.addEventListener('click', play);
            }
            if (video) {
                video.addEventListener('play', function () {
                    frame.classList.add('playing');
                });
                video.addEventListener('pause', function () {
                    if (!video.ended) {
                        frame.classList.remove('playing');
                    }
                });
                video.addEventListener('ended', function () {
                    frame.classList.remove('playing');
                });
            }
            window.addEventListener('pagehide', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupSearch();
        setupPlayer();
    });
})();
