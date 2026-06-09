(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
  var activeIndex = 0;

  function setSlide(nextIndex) {
    if (!slides.length) {
      return;
    }

    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, index) {
      slide.classList.toggle("is-active", index === activeIndex);
    });
    dots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      setSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      setSlide(activeIndex + 1);
    }, 5200);
  }

  var cardSearch = document.querySelector("[data-card-search]");
  var regionSelect = document.querySelector("[data-region-filter]");
  var yearSelect = document.querySelector("[data-year-filter]");
  var genreSelect = document.querySelector("[data-genre-filter]");
  var typeSelect = document.querySelector("[data-type-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var emptyState = document.querySelector("[data-empty-state]");

  function normalized(value) {
    return String(value || "").trim().toLowerCase();
  }

  function matchesText(card, query) {
    if (!query) {
      return true;
    }

    var haystack = [
      card.getAttribute("data-title"),
      card.getAttribute("data-region"),
      card.getAttribute("data-year"),
      card.getAttribute("data-genre"),
      card.getAttribute("data-type"),
      card.getAttribute("data-category")
    ].join(" ").toLowerCase();

    return haystack.indexOf(query) !== -1;
  }

  function matchesSelect(card, select, name) {
    if (!select || !select.value) {
      return true;
    }

    return normalized(card.getAttribute(name)).indexOf(normalized(select.value)) !== -1;
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var query = normalized(cardSearch && cardSearch.value);
    var visible = 0;

    cards.forEach(function (card) {
      var ok = matchesText(card, query)
        && matchesSelect(card, regionSelect, "data-region")
        && matchesSelect(card, yearSelect, "data-year")
        && matchesSelect(card, genreSelect, "data-genre")
        && matchesSelect(card, typeSelect, "data-type");

      card.style.display = ok ? "" : "none";
      if (ok) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
    }
  }

  [cardSearch, regionSelect, yearSelect, genreSelect, typeSelect].forEach(function (control) {
    if (control) {
      control.addEventListener("input", filterCards);
      control.addEventListener("change", filterCards);
    }
  });

  var params = new URLSearchParams(window.location.search);
  var queryValue = params.get("q");
  if (queryValue && cardSearch) {
    cardSearch.value = queryValue;
  }

  filterCards();
})();
