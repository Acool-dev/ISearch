const apiKey = 'AIzaSyB9DPeArfIwGk9gmaEBXk2h9PI5p7DQJXo';
const searchEngineId = '963b7e89967c04d66';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const filterDate = document.getElementById('filter-date');
    const filterType = document.getElementById('filter-type');
    const searchResults = document.getElementById('search-results');
    const relatedSearches = document.getElementById('related-searches');
    const searchHistory = document.getElementById('search-history');
    const pagination = document.getElementById('pagination');
    const loader = document.getElementById('loader');
    const toggleThemeButton = document.getElementById('toggle-theme');
    let darkMode = false;

    const apiKey = 'AIzaSyB9DPeArfIwGk9gmaEBXk2h9PI5p7DQJXo';
    const cseId = '963b7e89967c04d66';

    const performSearch = async (startIndex = 1) => {
        const query = searchInput.value;
        const dateFilter = filterDate.value;
        const typeFilter = filterType.value;

        if (!query) {
            alert('Please enter a search query.');
            return;
        }

        showLoader(true);

        try {
            const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${query}&start=${startIndex}&dateRestrict=${dateFilter}&searchType=${typeFilter}`);
            const data = await response.json();
            displayResults(data);
            saveSearchHistory(query);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            showLoader(false);
        }
    };

    const displayResults = (data) => {
        if (data.items) {
            searchResults.innerHTML = data.items.map(item => `
                <div class="chrome-result">
                    <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
                    <p>${item.snippet}</p>
                </div>
            `).join('');
        } else {
            searchResults.innerHTML = '<p>No results found.</p>';
        }

        if (data.queries && data.queries.nextPage) {
            const nextPage = data.queries.nextPage[0].startIndex;
            pagination.innerHTML = `
                <button class="chrome-pagination-button" onclick="performSearch(${nextPage})">Next</button>
            `;
        } else {
            pagination.innerHTML = '';
        }
    };

    const saveSearchHistory = (query) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('chrome-history-item');
        historyItem.innerText = query;
        searchHistory.appendChild(historyItem);
    };

    const showLoader = (show) => {
        loader.style.display = show ? 'block' : 'none';
    };

    const toggleTheme = () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        toggleThemeButton.innerText = darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    };

    searchButton.addEventListener('click', () => performSearch());

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    toggleThemeButton.addEventListener('click', toggleTheme);
});
