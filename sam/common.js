

// Common constants and utility functions for CineMax
const API_KEY = '1a0b5a05408e9ebf9a9501f91504705d';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Initialize dropdown functionality
function initializeDropdown() {
    const profile = document.getElementById("profile");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (profile && dropdownMenu) {
        profile.addEventListener("click", () => {
            // Toggle the dropdown visibility
            dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
        });

        // Close the dropdown if the user clicks anywhere outside the profile area
        document.addEventListener("click", (event) => {
            if (!profile.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchBar = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');
    
    if (searchBar && searchButton) {
        // Handle search button click
        searchButton.addEventListener('click', () => {
            performSearch(searchBar.value);
        });
        
        // Handle enter key in search bar
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchBar.value);
            }
        });
    }
}

// Perform search and navigate to results
function performSearch(query) {
    if (query.trim() === '') return;
    
    // Store the search query in session storage
    sessionStorage.setItem('lastSearchQuery', query);
    
    // Search TMDB and navigate to the first result
    searchMovies(query)
        .then(results => {
            if (results.length > 0) {
                // Navigate to the first movie in results
                window.location.href = `details.html?id=${results[0].id}`;
                // Also update recently viewed
                updateRecentlyViewed(results[0].id);
            } else {
                alert('No movies found matching your search.');
            }
        })
        .catch(err => {
            console.error('Search error:', err);
            alert('An error occurred during search. Please try again.');
        });
}

// Search for movies using TMDB API
async function searchMovies(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results;
}

// Update recently viewed movies in localStorage
function updateRecentlyViewed(movieId) {
    if (!movieId) return;
    
    // Get existing history
    const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove the current movie if it's already in the history
    const updatedHistory = history.filter(id => id !== movieId.toString());
    
    // Add current movie to the beginning
    updatedHistory.unshift(movieId.toString());
    
    // Keep only the last 10 movies
    const limitedHistory = updatedHistory.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(limitedHistory));
}

// Format runtime into hours and minutes
function formatRuntime(minutes) {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Format date to readable format
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Render star rating based on score (0-10)
function renderStars(rating) {
    if (!rating) return '';
    
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let starsHTML = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }

    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
}

// Generic function to create a movie card
function createMovieCard(movie) {
    const div = document.createElement('div');
    div.classList.add('movie-card');
    
    // Add click event to navigate to movie details
    div.addEventListener('click', () => {
        window.location.href = `details.html?id=${movie.id}`;
        updateRecentlyViewed(movie.id);
    });
    
    div.innerHTML = `
        <img src="${movie.poster_path ? IMAGE_BASE + movie.poster_path : '/placeholder.jpg'}" alt="${movie.title}" />
        <p>${movie.title}</p>
    `;
    return div;
}

// Initialize components on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdown();
    initializeSearch();
    
    // Track the current page view if it's a movie detail page
    const movieId = new URLSearchParams(window.location.search).get('id');
    if (movieId) {
        updateRecentlyViewed(movieId);
    }
});