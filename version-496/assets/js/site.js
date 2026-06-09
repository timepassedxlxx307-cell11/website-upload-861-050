(function () {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let current = 0;

        const activate = function (index) {
            current = index % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                activate(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                activate(current + 1);
            }, 5200);
        }
    }

    const filterInput = document.querySelector('[data-filter-input]');
    const cardList = document.querySelector('[data-card-list]');

    if (filterInput && cardList) {
        const cards = Array.from(cardList.querySelectorAll('.movie-card'));
        filterInput.addEventListener('input', function () {
            const query = filterInput.value.trim().toLowerCase();
            cards.forEach(function (card) {
                const text = [
                    card.dataset.title,
                    card.dataset.category,
                    card.dataset.year,
                    card.dataset.keywords
                ].join(' ').toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
})();
