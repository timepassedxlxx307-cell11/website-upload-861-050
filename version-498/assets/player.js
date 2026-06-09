(function () {
  window.startStreamPlayer = function (options) {
    var video = document.getElementById("movie-player");
    var cover = document.getElementById("movie-play-cover");
    var button = document.getElementById("movie-play-button");
    var stream = options && options.stream;
    var ready = false;

    if (!video || !stream) {
      return;
    }

    function playNow() {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function attachStream() {
      hideCover();

      if (ready) {
        playNow();
        return;
      }

      ready = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        playNow();
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playNow();
        });
        video._hls = hls;
      } else {
        video.src = stream;
        playNow();
      }
    }

    if (button) {
      button.addEventListener("click", attachStream);
    }

    if (cover) {
      cover.addEventListener("click", attachStream);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        attachStream();
      }
    });
  };
})();
