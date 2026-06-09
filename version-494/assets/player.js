(function () {
  window.setupPlayer = function (source) {
    var video = document.getElementById('movieVideo');
    var button = document.getElementById('moviePlayButton');
    var message = document.getElementById('playerMessage');
    if (!video || !source) {
      return;
    }

    function showMessage(text) {
      if (message) {
        message.textContent = text;
        message.hidden = false;
      }
    }

    function bindSource() {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage('暂时无法播放，请稍后再试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        showMessage('暂时无法播放，请稍后再试');
      }
    }

    function start() {
      if (button) {
        button.classList.add('hidden');
      }
      video.controls = true;
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          if (button) {
            button.classList.remove('hidden');
          }
        });
      }
    }

    bindSource();
    if (button) {
      button.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });
  };
})();
