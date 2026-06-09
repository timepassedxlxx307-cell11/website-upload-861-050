(function () {
  function setupPlayer(panel) {
    var video = panel.querySelector('video[data-m3u8]');
    var cover = panel.querySelector('[data-play-cover]');

    if (!video) {
      return;
    }

    var source = video.getAttribute('data-m3u8');
    var started = false;
    var hlsInstance = null;

    function start() {
      if (!source) {
        return;
      }

      if (cover) {
        cover.classList.add('hidden');
      }

      if (!started) {
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

        started = true;
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player-panel]')).forEach(setupPlayer);
})();
