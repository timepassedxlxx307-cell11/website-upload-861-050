(function () {
    const shell = document.querySelector('[data-video-url]');

    if (!shell) {
        return;
    }

    const video = shell.querySelector('video');
    const button = shell.querySelector('[data-play-button]');
    const url = shell.getAttribute('data-video-url');
    let attached = false;

    const attach = function () {
        if (attached || !video || !url) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            attached = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            attached = true;
            return;
        }

        video.src = url;
        attached = true;
    };

    const play = function () {
        attach();
        if (button) {
            button.classList.add('is-hidden');
        }
        const result = video.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () {});
        }
    };

    if (button) {
        button.addEventListener('click', play);
    }

    if (video) {
        video.addEventListener('click', play);
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
    }
})();
