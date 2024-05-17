let searchInputEl = document.getElementById("searchInput");
let searchButton = document.getElementById('searchButton');
let searchIcon = document.getElementById('searchIcon');
let searchResultsEl = document.getElementById("searchResults");
let paginationContainer = document.getElementById('pagination');

let currentPage = 1;
const resultsPerPage = 5;
let data;


function createAndAppendSearchResult(result) {
    let {
        link,
        title,
        description
    } = result;

    let resultItemEl = document.createElement("div");
    resultItemEl.classList.add("result-item");

    let titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultItemEl.appendChild(titleEl);

    let titleBreakEl = document.createElement("br");
    resultItemEl.appendChild(titleBreakEl);

    let urlEl = document.createElement("a");
    urlEl.classList.add("result-url");
    urlEl.href = link;
    urlEl.target = "_blank";
    urlEl.textContent = link;
    resultItemEl.appendChild(urlEl);

    let linkBreakEl = document.createElement("br");
    resultItemEl.appendChild(linkBreakEl);

    let descriptionEl = document.createElement("p");
    descriptionEl.classList.add("link-description");
    descriptionEl.textContent = description;
    resultItemEl.appendChild(descriptionEl);

    searchResultsEl.appendChild(resultItemEl);

}


function displayResults() {
    searchResultsEl.innerHTML = "";
    // Clear list and pagination
    paginationContainer.textContent = "";

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const resultsToShow = data.slice(startIndex, endIndex);

    // Generate pagination links
    const totalPages = Math.ceil(data.length / resultsPerPage);
    //console.log(totalPages);
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.classList.add('pagination-link');
        pageLink.textContent = i;
        paginationContainer.appendChild(pageLink);

        // Highlight the current page
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
    }

    for (let result of resultsToShow) {
        createAndAppendSearchResult(result);
    }
}


paginationContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'SPAN') {
        currentPage = parseInt(e.target.textContent);
        //console.log(currentPage);
        displayResults();
    }
});


const doNetworkCall = async () => {
    let searchInput = searchInputEl.value;
    let url = "https://apis.ccbp.in/wiki-search?search=" + searchInput;

    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        let {
            search_results
        } = jsonData;
        data = search_results;
        //console.log(data);
        displayResults();
    } catch (err) {
        console.log(err.message);
    }
};

function searchWikipedia() {
    if (searchInputEl.value === "") {
        searchResultsEl.innerHTML = "<h6 class='error'>Please enter a valid search term</h6>";
        paginationContainer.textContent = "";
    } else {
        //searchResultsEl.innerHTML = "<div class='spinner'>Loading ... </div>";
        searchResultsEl.innerHTML = "<div class='loader-outer'><div class='loader'></div></div>";
        paginationContainer.textContent = "";
        currentPage = 1;

        doNetworkCall();
    }
}


searchInputEl.addEventListener("keydown", e => e.key === "Enter" && searchWikipedia());

searchButton.addEventListener('click', searchWikipedia);

searchIcon.addEventListener('click', searchWikipedia);