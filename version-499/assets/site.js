(function () {
  var mobileButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showHero(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restartHero() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showHero(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showHero(index - 1);
        restartHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showHero(index + 1);
        restartHero();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
        restartHero();
      });
    });

    restartHero();
  }

  var globalSearch = document.querySelector('[data-global-search]');
  var globalResults = document.querySelector('[data-search-results]');
  var clearSearch = document.querySelector('[data-clear-search]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function resultTemplate(movie) {
    return [
      '<a class="search-result-card" href="' + escapeHTML(movie.url) + '">',
      '<img src="' + escapeHTML(movie.cover) + '" alt="' + escapeHTML(movie.title) + '">',
      '<span>',
      '<strong>' + escapeHTML(movie.title) + '</strong>',
      '<small>' + escapeHTML(movie.region) + ' · ' + escapeHTML(movie.year) + ' · ' + escapeHTML(movie.type) + '</small>',
      '</span>',
      '</a>'
    ].join('');
  }

  function runGlobalSearch() {
    if (!globalSearch || !globalResults || !window.SEARCH_MOVIES) {
      return;
    }

    var query = normalize(globalSearch.value);

    if (!query) {
      globalResults.classList.remove('is-visible');
      globalResults.innerHTML = '';
      return;
    }

    var words = query.split(/\s+/).filter(Boolean);
    var matches = window.SEARCH_MOVIES.filter(function (movie) {
      var haystack = normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.tags,
        movie.category
      ].join(' '));

      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).slice(0, 24);

    globalResults.innerHTML = matches.map(resultTemplate).join('');
    globalResults.classList.toggle('is-visible', matches.length > 0);
  }

  if (globalSearch) {
    globalSearch.addEventListener('input', runGlobalSearch);
  }

  if (clearSearch && globalSearch) {
    clearSearch.addEventListener('click', function () {
      globalSearch.value = '';
      runGlobalSearch();
      globalSearch.focus();
    });
  }

  var localFilter = document.querySelector('[data-card-filter]');
  var clearLocal = document.querySelector('[data-clear-local-filter]');
  var localChips = Array.prototype.slice.call(document.querySelectorAll('[data-local-chip]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function applyLocalFilter(value) {
    var query = normalize(value);
    var words = query.split(/\s+/).filter(Boolean);

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.getAttribute('data-tags')
      ].join(' '));
      var visible = words.length === 0 || words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
      card.classList.toggle('is-hidden', !visible);
    });
  }

  if (localFilter) {
    localFilter.addEventListener('input', function () {
      applyLocalFilter(localFilter.value);
    });
  }

  if (clearLocal && localFilter) {
    clearLocal.addEventListener('click', function () {
      localFilter.value = '';
      applyLocalFilter('');
      localFilter.focus();
    });
  }

  localChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (!localFilter) {
        return;
      }

      localFilter.value = chip.getAttribute('data-local-chip') || '';
      applyLocalFilter(localFilter.value);
      localFilter.focus();
    });
  });
}());
