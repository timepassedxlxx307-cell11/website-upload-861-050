(function () {
    const params = new URLSearchParams(window.location.search);
    const input = document.querySelector('[data-search-input]');
    const results = document.querySelector('[data-search-results]');
    const status = document.querySelector('[data-search-status]');
    const initialQuery = params.get('q') || '';

    if (input) {
        input.value = initialQuery;
    }

    const makeCard = function (movie) {
        const article = document.createElement('article');
        article.className = 'movie-card';
        article.innerHTML = [
            '<a href="' + movie.url + '" class="poster-link" aria-label="观看' + escapeHtml(movie.title) + '">',
            '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.remove()">',
            '<span class="poster-glow"></span>',
            '<span class="play-chip">立即观看</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="card-meta"><a href="categories.html">' + escapeHtml(movie.category) + '</a><span>' + escapeHtml(movie.year) + '</span></div>',
            '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
            '<p>' + escapeHtml(movie.summary) + '</p>',
            '<div class="tag-row"><span>' + escapeHtml(movie.genre) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
            '</div>'
        ].join('');
        return article;
    };

    const runSearch = function (query) {
        if (!results || !status) {
            return;
        }

        const normalized = query.trim().toLowerCase();
        results.innerHTML = '';

        if (!normalized) {
            status.textContent = '输入关键词查找影片。';
            return;
        }

        const found = MOVIE_INDEX.filter(function (movie) {
            return movie.keywords.toLowerCase().includes(normalized) || movie.summary.toLowerCase().includes(normalized);
        }).slice(0, 96);

        status.textContent = found.length ? '为你找到以下相关影片。' : '暂未找到匹配影片。';
        found.forEach(function (movie) {
            results.appendChild(makeCard(movie));
        });
    };

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[char];
        });
    }

    if (input) {
        input.addEventListener('input', function () {
            runSearch(input.value);
        });
    }

    runSearch(initialQuery);
})();
