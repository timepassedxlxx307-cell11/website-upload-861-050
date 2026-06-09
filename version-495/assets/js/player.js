import { H as Hls } from './hls-vendor-dru42stk.js';

const player = document.querySelector('[data-player]');

if (player) {
  const video = player.querySelector('video');
  const button = player.querySelector('[data-play-button]');
  const source = player.getAttribute('data-source');
  let ready = false;
  let hls = null;

  const attach = () => {
    if (ready || !video || !source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    ready = true;
  };

  const play = async () => {
    attach();

    if (!video) {
      return;
    }

    button?.classList.add('is-hidden');

    try {
      await video.play();
    } catch (error) {
      button?.classList.remove('is-hidden');
    }
  };

  button?.addEventListener('click', play);

  video?.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });

  video?.addEventListener('play', () => {
    button?.classList.add('is-hidden');
  });

  video?.addEventListener('pause', () => {
    if (video.currentTime === 0) {
      button?.classList.remove('is-hidden');
    }
  });
}
