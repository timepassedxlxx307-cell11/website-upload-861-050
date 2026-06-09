(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

        players.forEach(function (box) {
            var video = box.querySelector('video');
            var startButton = box.querySelector('[data-player-start]');
            var toggleButton = box.querySelector('[data-player-toggle]');
            var muteButton = box.querySelector('[data-player-mute]');
            var fullButton = box.querySelector('[data-player-full]');
            var message = box.querySelector('[data-player-message]');
            var stream = box.getAttribute('data-stream');
            var prepared = false;
            var hls = null;

            function showMessage(value) {
                if (!message) {
                    return;
                }
                message.textContent = value;
                message.style.display = 'block';
            }

            function setToggleText() {
                if (!toggleButton) {
                    return;
                }
                toggleButton.textContent = video.paused ? '▶' : 'Ⅱ';
            }

            function prepare() {
                if (prepared || !video || !stream) {
                    return;
                }

                prepared = true;

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            showMessage('暂时无法播放，请稍后重试');
                        }
                    });
                    return;
                }

                showMessage('暂时无法播放，请稍后重试');
            }

            function play() {
                prepare();
                if (!video) {
                    return;
                }
                var result = video.play();
                if (result && typeof result.catch === 'function') {
                    result.catch(function () {
                        setToggleText();
                    });
                }
            }

            if (startButton) {
                startButton.addEventListener('click', function () {
                    play();
                });
            }

            if (toggleButton) {
                toggleButton.addEventListener('click', function () {
                    if (video.paused) {
                        play();
                    } else {
                        video.pause();
                    }
                });
            }

            if (muteButton) {
                muteButton.addEventListener('click', function () {
                    video.muted = !video.muted;
                    muteButton.textContent = video.muted ? '静' : '音';
                });
            }

            if (fullButton) {
                fullButton.addEventListener('click', function () {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else if (box.requestFullscreen) {
                        box.requestFullscreen();
                    }
                });
            }

            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });

            video.addEventListener('playing', function () {
                if (startButton) {
                    startButton.classList.add('is-hidden');
                }
                setToggleText();
            });

            video.addEventListener('pause', setToggleText);
            video.addEventListener('ended', setToggleText);
            video.addEventListener('error', function () {
                showMessage('暂时无法播放，请稍后重试');
            });

            prepare();
        });
    });
})();
