(function () {
  function bindPlayer(frame) {
    var video = frame.querySelector('video');
    var cover = frame.querySelector('.player-cover');
    if (!video || !cover) {
      return;
    }

    var stream = video.getAttribute('data-stream');
    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (attached || !stream) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = stream;
    }

    function start() {
      attach();
      frame.classList.add('is-started');
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
    }

    cover.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!attached) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(bindPlayer);
})();
