const apiKey = 'AIzaSyB9DPeArfIwGk9gmaEBXk2h9PI5p7DQJXo';
const searchEngineId = '963b7e89967c04d66';

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const loader = document.getElementById("loader");
    const resultsDiv = document.getElementById("search-results");
    const suggestionsDiv = document.getElementById("suggestions");
    const filterDate = document.getElementById("filter-date");
    const filterType = document.getElementById("filter-type");
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    resultsDiv.appendChild(paginationDiv);

    searchButton.addEventListener("click", function() {
        loader.style.display = "block";
        fetchSearchResults(searchInput.value).then(renderResults);
    });

    searchInput.addEventListener("input", function() {
        fetchSuggestions(searchInput.value).then(renderSuggestions);
    });

    function fetchSearchResults(query, start = 1) {
        let url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&start=${start}`;
        const dateFilter = filterDate.value;
        const typeFilter = filterType.value;

        if (dateFilter) {
            url += `&dateRestrict=${dateFilter}`;
        }

        if (typeFilter) {
            url += `&searchType=${typeFilter}`;
        }

        return fetch(url).then(response => response.json());
    }

    function fetchSuggestions(query) {
        const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`;
        return fetch(url).then(response => response.json()).then(data => data[1]);
    }

    function renderResults(data) {
        loader.style.display = "none";
        resultsDiv.style.display = "block";
        resultsDiv.innerHTML = data.items.map(item => `
            <div class="result-item">
                <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
                <p>${item.snippet}</p>
            </div>
        `).join('');
        renderPagination(data.queries);
    }

    function renderSuggestions(suggestions) {
        suggestionsDiv.innerHTML = suggestions.map(suggestion => `
            <div>${suggestion}</div>
        `).join('');
        suggestionsDiv.style.display = suggestions.length ? 'block' : 'none';
        suggestionsDiv.querySelectorAll('div').forEach((div, index) => {
            div.addEventListener('click', () => {
                searchInput.value = suggestions[index];
                suggestionsDiv.style.display = 'none';
            });
        });
    }

    function renderPagination(queries) {
        const nextPage = queries.nextPage ? queries.nextPage[0].startIndex : null;
        const previousPage = queries.previousPage ? queries.previousPage[0].startIndex : null;

        paginationDiv.innerHTML = `
            ${previousPage ? `<button onclick="loadPage(${previousPage})">Previous</button>` : ''}
            ${nextPage ? `<button onclick="loadPage(${nextPage})">Next</button>` : ''}
        `;
    }

    window.loadPage = function(startIndex) {
        loader.style.display = "block";
        fetchSearchResults(searchInput.value, startIndex).then(renderResults);
    }
});
