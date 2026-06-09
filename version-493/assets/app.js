(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-nav]');

        if (menuButton && nav) {
            menuButton.addEventListener('click', function () {
                nav.classList.toggle('is-open');
            });
        }

        var hero = document.querySelector('[data-hero]');

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
            var index = 0;
            var timer = null;

            function show(next) {
                if (!slides.length) {
                    return;
                }
                slides[index].classList.remove('is-active');
                if (dots[index]) {
                    dots[index].classList.remove('is-active');
                }
                index = (next + slides.length) % slides.length;
                slides[index].classList.add('is-active');
                if (dots[index]) {
                    dots[index].classList.add('is-active');
                }
            }

            function start() {
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener('click', function () {
                    window.clearInterval(timer);
                    show(dotIndex);
                    start();
                });
            });

            start();
        }

        var searchPageInput = document.querySelector('[data-search-input]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
        var emptyState = document.querySelector('[data-empty-state]');
        var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));
        var currentFilter = 'all';

        function normalize(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function updateList() {
            if (!cards.length) {
                return;
            }
            var query = normalize(searchPageInput ? searchPageInput.value : '');
            var shown = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search-card'));
                var tags = normalize(card.getAttribute('data-tags'));
                var queryMatch = !query || text.indexOf(query) !== -1;
                var filterMatch = currentFilter === 'all' || tags.indexOf(currentFilter) !== -1 || text.indexOf(currentFilter) !== -1;
                var visible = queryMatch && filterMatch;

                card.classList.toggle('hidden-card', !visible);

                if (visible) {
                    shown += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', shown === 0);
            }
        }

        if (searchPageInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var initial = params.get('q');

            if (initial) {
                searchPageInput.value = initial;
            }

            searchPageInput.addEventListener('input', updateList);
            updateList();
        }

        if (chips.length) {
            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    chips.forEach(function (item) {
                        item.classList.remove('is-active');
                    });
                    chip.classList.add('is-active');
                    currentFilter = normalize(chip.getAttribute('data-filter-chip'));
                    updateList();
                });
            });
        }
    });
})();
