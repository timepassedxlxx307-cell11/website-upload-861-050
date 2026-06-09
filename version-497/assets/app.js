(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector(".mobile-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("menu-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function autoplay() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (slides.length) {
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
          autoplay();
        });
      });
      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(current - 1);
          autoplay();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          showSlide(current + 1);
          autoplay();
        });
      }
      autoplay();
    }

    var scopes = Array.prototype.slice.call(document.querySelectorAll(".filter-scope"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector(".movie-filter-input");
      var selects = Array.prototype.slice.call(scope.querySelectorAll(".filter-select"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q && input) {
        input.value = q;
      }

      function matchYear(card, value) {
        if (!value) {
          return true;
        }
        var year = normalize(card.getAttribute("data-year"));
        if (value === "2022") {
          var yearNumber = parseInt(year, 10);
          return !isNaN(yearNumber) && yearNumber <= 2022;
        }
        return year.indexOf(value) !== -1;
      }

      function applyFilter() {
        var term = normalize(input ? input.value : "");
        var values = {};
        selects.forEach(function (select) {
          values[select.getAttribute("data-filter")] = normalize(select.value);
        });
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-meta"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type")
          ].join(" "));
          var okTerm = !term || haystack.indexOf(term) !== -1;
          var okYear = matchYear(card, values.year || "");
          var okType = !values.type || normalize(card.getAttribute("data-type")).indexOf(values.type) !== -1;
          var okRegion = !values.region || normalize(card.getAttribute("data-region")).indexOf(values.region) !== -1;
          card.classList.toggle("is-hidden", !(okTerm && okYear && okType && okRegion));
        });
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", applyFilter);
      });
      applyFilter();
    });
  });

  window.startVideoPlayer = function (src) {
    ready(function () {
      var frame = document.querySelector(".player-frame");
      var video = document.querySelector(".player-video");
      var start = document.querySelector(".player-start");
      var loaded = false;
      var hls = null;

      function begin() {
        if (!video || !src) {
          return;
        }
        if (!loaded) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true });
            hls.loadSource(src);
            hls.attachMedia(video);
          } else {
            video.src = src;
          }
          video.controls = true;
          loaded = true;
        }
        if (frame) {
          frame.classList.add("is-playing");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      if (frame) {
        frame.addEventListener("click", begin);
      }
      if (start) {
        start.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          begin();
        });
      }
      if (video) {
        video.addEventListener("play", function () {
          if (frame) {
            frame.classList.add("is-playing");
          }
        });
      }
      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  };
})();
