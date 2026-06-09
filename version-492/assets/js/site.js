(function () {
  var navButton = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target.tagName === 'IMG') {
      target.classList.add('image-missing');
    }
  }, true);

  var hero = document.querySelector('.hero-carousel');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function run() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide')) || 0);
        run();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        run();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        run();
      });
    }

    show(0);
    run();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilter(form) {
    var scope = form.closest('main') || document;
    var input = form.querySelector('.js-filter-input');
    var query = normalize(input ? input.value : '');
    var selects = Array.prototype.slice.call(form.querySelectorAll('.js-filter-select'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-list] .searchable-card'));

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var visible = !query || text.indexOf(query) !== -1;

      selects.forEach(function (select) {
        var key = select.getAttribute('data-filter');
        var value = normalize(select.value);
        if (value && normalize(card.getAttribute('data-' + key)) !== value) {
          visible = false;
        }
      });

      card.classList.toggle('is-hidden', !visible);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.js-filter-form')).forEach(function (form) {
    var input = form.querySelector('.js-filter-input');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (input && query) {
      input.value = query;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter(form);
    });

    form.addEventListener('input', function () {
      applyFilter(form);
    });

    form.addEventListener('change', function () {
      applyFilter(form);
    });

    applyFilter(form);
  });
})();
