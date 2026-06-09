const header = document.querySelector('[data-site-header]');
const toggle = document.querySelector('[data-mobile-toggle]');
const panel = document.querySelector('[data-mobile-panel]');

if (toggle && panel) {
  toggle.addEventListener('click', () => {
    panel.classList.toggle('is-open');
  });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  const previous = hero.querySelector('[data-hero-prev]');
  const next = hero.querySelector('[data-hero-next]');
  let current = 0;
  let timer = null;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  };

  const start = () => {
    timer = window.setInterval(() => show(current + 1), 5200);
  };

  const restart = () => {
    window.clearInterval(timer);
    start();
  };

  previous?.addEventListener('click', () => {
    show(current - 1);
    restart();
  });

  next?.addEventListener('click', () => {
    show(current + 1);
    restart();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      show(index);
      restart();
    });
  });

  start();
}

const filterPanel = document.querySelector('[data-filter-panel]');
const filterGrid = document.querySelector('[data-filter-grid]');

if (filterPanel && filterGrid) {
  const cards = Array.from(filterGrid.querySelectorAll('[data-movie-card]'));
  const input = filterPanel.querySelector('[data-live-search]');
  const count = filterPanel.querySelector('[data-result-count]');
  const empty = document.querySelector('[data-empty-message]');
  const params = new URLSearchParams(window.location.search);
  let selectedType = params.get('type') || '';
  let selectedRegion = params.get('region') || '';

  if (input) {
    input.value = params.get('q') || '';
  }

  const normalize = (value) => String(value || '').trim().toLowerCase();

  const markButtons = () => {
    filterPanel.querySelectorAll('[data-filter-field]').forEach((button) => {
      const field = button.getAttribute('data-filter-field');
      const value = button.getAttribute('data-filter-value') || '';
      const active = field === 'type' ? value === selectedType : value === selectedRegion;
      button.classList.toggle('is-active', active);
    });
    const reset = filterPanel.querySelector('[data-filter-reset]');
    if (reset) {
      reset.classList.toggle('is-active', !selectedType && !selectedRegion);
    }
  };

  const apply = () => {
    const keyword = normalize(input?.value || '');
    let visible = 0;

    cards.forEach((card) => {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.tags
      ].join(' '));
      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesType = !selectedType || card.dataset.type === selectedType;
      const matchesRegion = !selectedRegion || card.dataset.region === selectedRegion;
      const showCard = matchesKeyword && matchesType && matchesRegion;
      card.hidden = !showCard;
      if (showCard) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = `${visible} 部影片`;
    }
    if (empty) {
      empty.hidden = visible !== 0;
    }
    markButtons();
  };

  filterPanel.querySelectorAll('[data-filter-field]').forEach((button) => {
    button.addEventListener('click', () => {
      const field = button.getAttribute('data-filter-field');
      const value = button.getAttribute('data-filter-value') || '';
      if (field === 'type') {
        selectedType = selectedType === value ? '' : value;
      }
      if (field === 'region') {
        selectedRegion = selectedRegion === value ? '' : value;
      }
      apply();
    });
  });

  filterPanel.querySelector('[data-filter-reset]')?.addEventListener('click', () => {
    selectedType = '';
    selectedRegion = '';
    if (input) {
      input.value = '';
    }
    apply();
  });

  input?.addEventListener('input', apply);
  apply();
}

document.querySelectorAll('[data-search-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    const input = form.querySelector('input[name="q"]');
    if (input && !input.value.trim()) {
      event.preventDefault();
      window.location.href = form.getAttribute('action') || 'movies.html';
    }
  });
});
