document.addEventListener('DOMContentLoaded', function () {

    /* ── Menú hamburguesa ── */
    const navToggler = document.getElementById('navToggler');
    const navMenu = document.getElementById('navMenu');
    if (navToggler && navMenu) {
        navToggler.addEventListener('click', function () {
            navMenu.classList.toggle('nav-open');
            navToggler.classList.toggle('nav-open');
        });
    }

    /* ── Nav activo según página actual ── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('nav-active');
        }
    });

    /* ── Búsqueda ── */
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');

    if (searchInput && searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            performSearch();
        });
        searchInput.addEventListener('input', performSearch);
        searchForm.addEventListener('reset', function () {
            setTimeout(performSearch, 0);
        });
    }

    function performSearch() {
        if (!searchInput) return;

        const query = searchInput.value.trim().toLowerCase();
        const inProducts = window.location.pathname.includes('productos.html');

        if (inProducts) {
            const productCols = document.querySelectorAll('.product-col');
            let found = false;
            let firstVisible = null;

            // Mostrar todas las categorías al buscar
            document.querySelectorAll('.category-section').forEach(s => s.style.display = '');

            productCols.forEach(col => {
                const name = (col.dataset.name || '').toLowerCase();
                if (query === '' || name.includes(query)) {
                    col.style.display = '';
                    if (!firstVisible) firstVisible = col;
                    found = true;
                } else {
                    col.style.display = 'none';
                }
            });

            // Ocultar secciones vacías cuando hay búsqueda activa
            if (query !== '') {
                document.querySelectorAll('.category-section').forEach(section => {
                    const visibles = section.querySelectorAll('.product-col:not([style*="display: none"])');
                    section.style.display = visibles.length > 0 ? '' : 'none';
                });

                // Resetear filtros al buscar
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
                if (allBtn) allBtn.classList.add('active');
            }

            const noResults = document.getElementById('noResultsMessage');
            if (noResults) noResults.style.display = (query !== '' && !found) ? 'block' : 'none';

            if (firstVisible && query !== '') {
                firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (query !== '') {
            window.location.href = 'productos.html?q=' + encodeURIComponent(query);
        }
    }

    /* ── Parámetro ?q= al llegar desde otra página ── */
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery && window.location.pathname.includes('productos.html')) {
        if (searchInput) {
            searchInput.value = urlQuery;
            performSearch();
        }
    }

    /* ── Filtros de categoría (página productos) ── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Limpiar búsqueda al filtrar
                if (searchInput) searchInput.value = '';
                document.querySelectorAll('.product-col').forEach(c => c.style.display = '');

                const filter = this.dataset.filter;
                document.querySelectorAll('.category-section').forEach(section => {
                    if (filter === 'all' || section.dataset.category === filter) {
                        section.style.display = '';
                    } else {
                        section.style.display = 'none';
                    }
                });

                const noResults = document.getElementById('noResultsMessage');
                if (noResults) noResults.style.display = 'none';
            });
        });
    }

    /* ── Formulario de contacto → WhatsApp ── */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = (document.getElementById('nombre')?.value || '').trim();
            const empresa = (document.getElementById('empresa')?.value || '').trim();
            const asunto = (document.getElementById('asunto')?.value || 'Consulta general');
            const mensaje = (document.getElementById('mensaje')?.value || '').trim();

            if (!nombre || !mensaje) {
                alert('Por favor completa tu nombre y mensaje.');
                return;
            }

            let text = `Hola Insycar, soy ${nombre}`;
            if (empresa) text += ` de ${empresa}`;
            text += `.\n*Asunto:* ${asunto}\n*Mensaje:* ${mensaje}`;

            window.open('https://wa.me/593987369760?text=' + encodeURIComponent(text), '_blank');
        });
    }

    /* ── Animación reveal al scroll ── */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    /* ── Contadores animados (página Nosotros) ── */
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const animateCounter = (el) => {
            const target = Number(el.getAttribute('data-target')) || 0;
            const duration = 1200;
            const startTime = performance.now();

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                el.textContent = Math.floor(target * progress).toLocaleString('es-EC');
                if (progress < 1) requestAnimationFrame(step);
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
