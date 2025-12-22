// Search functionality using Fuse.js
$(function() {
    // Search index data
    const searchIndex = [
        {
            title: "Home",
            url: "index.html",
            description: "Official website of Bunninadden GAA Club, a proud GAA club in South Sligo, Ireland. Home of Senior County Champions 2000 and Intermediate Champions 2012.",
            keywords: "Bunninadden GAA club Sligo Gaelic Football Ireland sports"
        },
        {
            title: "Gallery",
            url: "portfolio.html",
            description: "Photo gallery of Bunninadden GAA Club featuring match photos, team celebrations, and historic moments from our championship wins.",
            keywords: "gallery photos pictures images match team championship"
        },
        {
            title: "History",
            url: "history.html",
            description: "History of Bunninadden GAA Club. From our founding to Senior County Champions in 2000 and Intermediate Champions in 2012.",
            keywords: "history club founded 2000 2012 champions championship"
        },
        {
            title: "Recent News",
            url: "blog.html",
            description: "Latest news and updates from Bunninadden GAA Club. Match reports, club announcements, and community news.",
            keywords: "news updates match reports announcements community"
        },
        {
            title: "Contact",
            url: "contact.html",
            description: "Contact Bunninadden GAA Club. Get in touch with our club officers, find our location in South Sligo, and connect with us on social media.",
            keywords: "contact email phone location address social media"
        },
        {
            title: "Club Officers",
            url: "Officers.html",
            description: "Club officers of Bunninadden GAA. Meet our chairperson, secretary, treasurer, and committee members for 2025.",
            keywords: "officers committee chairperson secretary treasurer management"
        },
        {
            title: "Membership Information",
            url: "membership.html",
            description: "Join Bunninadden GAA Club. Membership information, registration details, and how to become a member of our club.",
            keywords: "membership join register registration member"
        },
        {
            title: "Child Protection",
            url: "child-protection.html",
            description: "Child protection and safeguarding policies at Bunninadden GAA Club. Our commitment to the safety and welfare of young players.",
            keywords: "child protection safeguarding safety welfare young players"
        },
        {
            title: "2000 Senior Championship Commemoration",
            url: "Portfolio-items/2000-commemoration.html",
            description: "Celebrating 25 years since Bunninadden's historic Senior County Championship victory in 2000. Match programmes, team photos, and video highlights.",
            keywords: "2000 senior championship county final commemoration victory champions"
        },
        {
            title: "2006 County Final",
            url: "Portfolio-items/2006-gallery.html",
            description: "2006 County Final match report and gallery. Bunninadden vs Curry in the Intermediate County Final.",
            keywords: "2006 county final intermediate curry match report"
        },
        {
            title: "2012 Intermediate Final",
            url: "Portfolio-items/2012-gallery.html",
            description: "2012 Intermediate Final, Connacht Final, and Connacht Semi-Final gallery. Championship winning season.",
            keywords: "2012 intermediate final connacht champions championship"
        },
        {
            title: "2021 Gallery",
            url: "Portfolio-items/2021-gallery.html",
            description: "2021 season gallery featuring match photos and team celebrations.",
            keywords: "2021 gallery photos match team"
        },
        {
            title: "2022 Gallery",
            url: "Portfolio-items/2022-gallery.html",
            description: "2022 season gallery featuring match photos, U21 championship winners, and team action.",
            keywords: "2022 gallery photos U21 championship winners"
        },
        {
            title: "2025 Season",
            url: "Portfolio-items/2025-gallery.html",
            description: "Bunninadden GAA 2025 Season - Football Report and Gallery. Division 2 League and Intermediate Championship.",
            keywords: "2025 season division 2 league intermediate championship football report"
        },
        {
            title: "Teams Through the Years",
            url: "Portfolio-items/Teams-through-the-ages.html",
            description: "Historic team photos from Bunninadden GAA spanning from 1948 to present day.",
            keywords: "teams history 1948 1953 1965 1975 1994 1995 historic photos"
        }
    ];

    // Initialize Fuse.js
    const fuse = new Fuse(searchIndex, {
        keys: ['title', 'description', 'keywords'],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2
    });

    // Get search query from URL
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Highlight search terms in text
    function highlightText(text, query) {
        if (!query) return text;
        const terms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        let highlighted = text;
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="search-highlight">$1</span>');
        });
        return highlighted;
    }

    // Display search results
    function displayResults(results, query) {
        const resultsContainer = $('#search-results');
        resultsContainer.empty();

        if (!query || query.trim() === '') {
            resultsContainer.html(`
                <div class="no-results">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <h3>Enter a search term to find pages, news, and galleries</h3>
                    <p>Try searching for: "2025", "championship", "gallery", "officers", or "history"</p>
                </div>
            `);
            return;
        }

        if (results.length === 0) {
            resultsContainer.html(`
                <div class="no-results">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <h3>No results found for "${query}"</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `);
            return;
        }

        const stats = `<p class="search-stats">Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</p>`;
        resultsContainer.append(stats);

        results.forEach(result => {
            const item = result.item;
            const score = result.score;
            const highlightedTitle = highlightText(item.title, query);
            const highlightedDesc = highlightText(item.description, query);

            const resultHtml = `
                <div class="search-result-item">
                    <h3><a href="${item.url}">${highlightedTitle}</a></h3>
                    <div class="search-result-url">${item.url}</div>
                    <div class="search-result-snippet">${highlightedDesc}</div>
                </div>
            `;
            resultsContainer.append(resultHtml);
        });
    }

    // Perform search
    function performSearch(query) {
        if (!query || query.trim() === '') {
            displayResults([], '');
            return;
        }

        const results = fuse.search(query);
        displayResults(results, query);
    }

    // Initialize search on page load
    const query = getQueryParam('q');
    if (query) {
        $('#main-search').val(query);
        $('#header-search').val(query);
        performSearch(query);
    }

    // Handle search form submission
    $('form[role="search"]').on('submit', function(e) {
        e.preventDefault();
        const query = $(this).find('input[name="q"]').val();
        if (query && query.trim() !== '') {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
});

