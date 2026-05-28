// js/scripts.js - Búsqueda con scroll automático a resultados

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');

    if (searchInput && searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('input', performSearch);
    }

    function performSearch() {
        if (!searchInput) return;

        const query = searchInput.value.trim().toLowerCase();
        const inProducts = window.location.pathname.includes('productos.html') || window.location.pathname.includes('products.html');

        if (inProducts) {
            const productCards = document.querySelectorAll('.product-card');
            let found = false;
            let firstVisibleCard = null;

            productCards.forEach(card => {
                const title = card.querySelector('h5');
                if (!title) return;

                const productName = title.textContent.toLowerCase();
                if (query === '' || productName.includes(query)) {
                    card.style.display = 'block';
                    if (!firstVisibleCard) firstVisibleCard = card;
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });

            let noResults = document.getElementById('noResultsMessage');
            if (query !== '' && !found) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.id = 'noResultsMessage';
                    noResults.className = 'text-center py-5';
                    noResults.innerHTML = '<p class="lead text-muted">No se encontraron productos para "<strong>' + query + '</strong>"</p>';
                    const container = document.querySelector('.container');
                    if (container) container.appendChild(noResults);
                }
            } else if (noResults) {
                noResults.remove();
            }

            if (firstVisibleCard && query !== '') {
                firstVisibleCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else if (query !== '') {
            window.location.href = 'productos.html?q=' + encodeURIComponent(query);
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery && (window.location.pathname.includes('productos.html') || window.location.pathname.includes('products.html'))) {
        if (searchInput) searchInput.value = urlQuery;
        performSearch();
    }

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.14,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }



        const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const animateCounter = (el) => {
            const target = Number(el.getAttribute('data-target')) || 0;
            const duration = 1200;
            const start = 0;
            const startTime = performance.now();

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(start + (target - start) * progress);
                el.textContent = value.toLocaleString('es-EC');

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => counterObserver.observe(counter));
    }
});