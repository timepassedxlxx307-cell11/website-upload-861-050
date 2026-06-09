(function () {
  function initVideoPlayer(source) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var hls = null;
    var attached = false;
    var attaching = null;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      if (attached) {
        return Promise.resolve();
      }

      if (attaching) {
        return attaching;
      }

      attaching = new Promise(function (resolve) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          attached = true;
          resolve();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            attached = true;
            resolve();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              try {
                hls.destroy();
              } catch (error) {
                hls = null;
              }
              video.src = source;
              attached = true;
              resolve();
            }
          });
          return;
        }

        video.src = source;
        attached = true;
        resolve();
      });

      return attaching;
    }

    function startPlayback() {
      attachSource().then(function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }

        video.controls = true;
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (!attached || video.paused) {
        startPlayback();
      }
    });
  }

  window.initVideoPlayer = initVideoPlayer;
}());
