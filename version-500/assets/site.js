(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var active = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === active);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === active);
    });
  }

  function startHero() {
    if (timer) {
      window.clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startHero();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(active - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(active + 1);
        startHero();
      });
    }

    startHero();
  }

  var controls = document.querySelector('[data-listing-controls]');

  if (controls) {
    var input = controls.querySelector('[data-filter-text]');
    var typeSelect = controls.querySelector('[data-filter-type]');
    var yearSelect = controls.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('[data-empty-state]');

    function filterCards() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-type') || ''
        ].join(' ').toLowerCase();
        var cardType = card.getAttribute('data-type') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (type && cardType.indexOf(type) === -1) {
          matched = false;
        }

        if (year && cardYear !== year) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-hidden', visible !== 0);
      }
    }

    [input, typeSelect, yearSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', filterCards);
        element.addEventListener('change', filterCards);
      }
    });
  }

  var searchPage = document.querySelector('[data-search-page]');

  if (searchPage && window.siteMovies) {
    var form = searchPage.querySelector('[data-search-form]');
    var field = searchPage.querySelector('[data-search-input]');
    var results = searchPage.querySelector('[data-search-results]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    if (field) {
      field.value = initial;
    }

    function resultCard(movie) {
      var tags = movie.tags.slice(0, 4).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return '<article class="movie-card">' +
        '<a class="poster-link" href="./' + movie.file + '" aria-label="' + escapeHtml(movie.title) + '">' +
        '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
        '<span class="poster-shade"></span><span class="play-dot">▶</span></a>' +
        '<div class="movie-card-body"><div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + movie.year + '</span></div>' +
        '<h3><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>' +
        '<p>' + escapeHtml(movie.oneLine) + '</p><div class="tag-row">' + tags + '</div></div></article>';
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[character];
      });
    }

    function runSearch(keyword) {
      var query = keyword.trim().toLowerCase();

      if (!query) {
        results.innerHTML = '<div class="empty-state">输入片名、类型、地区或标签即可搜索。</div>';
        return;
      }

      var found = window.siteMovies.filter(function (movie) {
        return [movie.title, movie.region, movie.type, movie.genre, movie.tags.join(' '), movie.oneLine]
          .join(' ')
          .toLowerCase()
          .indexOf(query) !== -1;
      }).slice(0, 120);

      if (!found.length) {
        results.innerHTML = '<div class="empty-state">未找到匹配内容。</div>';
        return;
      }

      results.innerHTML = found.map(resultCard).join('');
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        runSearch(field.value || '');
        var nextUrl = './search.html?q=' + encodeURIComponent(field.value || '');
        window.history.replaceState(null, '', nextUrl);
      });
    }

    runSearch(initial);
  }
})();
