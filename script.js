// script.js
const cryptoList = document.getElementById('crypto-list');
const loading = document.getElementById('loading');

let page = 1;
let loadingCrypto = false;

function fetchCryptocurrencies() {
    if (loadingCrypto) return;

    loadingCrypto = true;
    loading.style.display = 'block';

    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=${page}&sparkline=false&price_change_percentage=7&locale=en`)
        .then(response => response.json())
        .then(data => {
            loadingCrypto = false;
            loading.style.display = 'none';

            if (!data || !Array.isArray(data)) {
                console.error('Error: Invalid data received from API.');
                return;
            }

            if (data.length === 0) {
                // No more cryptocurrencies to load
                return;
            }

            data.forEach(crypto => {
                const cryptoItem = document.createElement('li');
                cryptoItem.classList.add('crypto-item');
                cryptoItem.innerHTML = `
                    <img src="${crypto.image}" alt="${crypto.name}" />
                    <h3>${crypto.name}</h3>
                    <p>${crypto.symbol}</p>
                    <p>Price: $${crypto.current_price}</p>
                    <p>Market Cap: $${crypto.market_cap}</p>
                `;
                cryptoList.appendChild(cryptoItem);
            });

            page++; // Increment the page for the next fetch
        })
        .catch(error => {
            console.error('Error fetching cryptocurrencies:', error);
            loadingCrypto = false;
            loading.style.display = 'none';
        });
}

// Initial cryptocurrency fetch
fetchCryptocurrencies();

// Load more cryptocurrencies when scrolling to the end
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchCryptocurrencies();
    }
});
