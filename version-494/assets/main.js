(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function getRootPath() {
    return document.body.getAttribute('data-root') || './';
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  ready(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (navToggle && nav) {
      navToggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input');
        var query = input ? input.value.trim() : '';
        var target = form.getAttribute('data-search-target') || (getRootPath() + 'search.html');
        var glue = target.indexOf('?') === -1 ? '?' : '&';
        window.location.href = target + glue + 'q=' + encodeURIComponent(query);
      });
    });

    var hero = document.querySelector('[data-hero-carousel]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var current = 0;
      var show = function (index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === current);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
      if (slides.length > 1) {
        window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }
    }

    var filterInput = document.querySelector('[data-local-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');
    function runFilter() {
      if (!filterInput || !cards.length) {
        return;
      }
      var q = normalize(filterInput.value);
      var visible = 0;
      cards.forEach(function (card) {
        var keys = normalize(card.getAttribute('data-keywords'));
        var showCard = !q || keys.indexOf(q) !== -1;
        card.style.display = showCard ? '' : 'none';
        if (showCard) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }
    if (filterInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        filterInput.value = q;
      }
      filterInput.addEventListener('input', runFilter);
      runFilter();
    }

    document.querySelectorAll('[data-filter-chip]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (!filterInput) {
          return;
        }
        document.querySelectorAll('[data-filter-chip]').forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        filterInput.value = button.getAttribute('data-filter-chip') || '';
        runFilter();
      });
    });
  });
})();
