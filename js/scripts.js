// js/scripts.js - Búsqueda con scroll automático a resultados

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');

    if (!searchInput || !searchForm) return;

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener('input', performSearch);

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (window.location.pathname.includes('productos.html') || window.location.pathname.includes('products.html')) {
            const productCards = document.querySelectorAll('.product-card');
            let found = false;
            let firstVisibleCard = null;

            productCards.forEach(card => {
                const productName = card.querySelector('h5').textContent.toLowerCase();
                if (query === '' || productName.includes(query)) {
                    card.style.display = 'block';
                    if (!found) {
                        firstVisibleCard = card; // Guardamos el primero que se muestra
                        found = true;
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            // Mensaje si no hay resultados
            let noResults = document.getElementById('noResultsMessage');
            if (query !== '' && !found) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.id = 'noResultsMessage';
                    noResults.className = 'text-center py-5';
                    noResults.innerHTML = `<p class="lead text-muted">No se encontraron productos para "<strong>${query}</strong>"</p>`;
                    document.querySelector('.container').appendChild(noResults);
                }
            } else if (noResults) {
                noResults.remove();
            }

            // SCROLL AUTOMÁTICO: si hay resultados, lleva al primero visible
            if (firstVisibleCard && query !== '') {
                firstVisibleCard.scrollIntoView({
                    behavior: 'smooth',  // Desplazamiento suave
                    block: 'center'      // Centra el producto en la pantalla
                });
            }
        } else if (query !== '') {
            // Desde otras páginas: redirige a productos con el término
            window.location.href = 'productos.html?q=' + encodeURIComponent(query);
        }
    }

    // Carga automática si llega con ?q= desde otra página
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery && (window.location.pathname.includes('productos.html') || window.location.pathname.includes('products.html'))) {
        searchInput.value = urlQuery;
        performSearch();
    }
});