// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { Navigate } from "react-router-dom";
import { handleMovieClick } from "./FirebaseAuth";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };



// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth(app);

// Function to retrieve movies and render them into the provided container
 export function retrieveMovies(moviesData, containerId) {
    try {
        const moviesContainer = document.getElementById(containerId); // Get the container div
        if (!moviesContainer) {
            // console.error(`Container with id "${containerId}" not found.`);
            return;
        }
        moviesContainer.innerHTML = ""; // Clear previous content

        // Check if the movies array is empty
        if (moviesData.length === 0) {
            moviesContainer.innerHTML = "<p>No movies found.</p>";
            return; // Exit if no movies are found
        }

        // Iterate over the movies array and create movie cards
        moviesData.forEach(movie => {
            // Create the movie card container
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-card'); // Add a class for styling

            // Get genres as a comma-separated string
            const genres = movie.genres ? movie.genres.join(', ') : 'No genres available';

            movieElement.innerHTML = `
                <h2>${movie.title}</h2>
                <img src="${movie.image || 'https://example.com/placeholder-image.jpg'}" alt="${movie.title}" style="width:200px;height:300px;" />
                <p><strong>Genre:</strong> ${genres}</p>
                <p><strong>Rating:</strong> ${movie.rating || 'N/A'}</p>
                <p><a href="${movie.trailerUrl}" target="_blank" class = "btn-neon">Watch Trailer</a></p>
                <button class="movie-btn" data-id="${movie.id}" data-name="${movie.title}">Explore More</button>
            `;

            // Append the movie card to the container
            moviesContainer.appendChild(movieElement);
        });

        // Add event listeners to all "Explore More" buttons
        const buttons = moviesContainer.querySelectorAll('.movie-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const movieId = e.target.getAttribute('data-id');
                const movieName = e.target.getAttribute('data-name')
                handleMovieClick(movieId,movieName);
            });
        });
    } catch (error) {
        console.error("Error retrieving data: ", error);
    }
}

// Function to handle movie card clicks


// Example usage: Query Firestore for movies based on category
 export async function getMoviesByCategory(category) {
    const moviesCollectionRef = collection(db, "movies");
    const q = query(moviesCollectionRef, where("category", "==", category));
    const snapshot = await getDocs(q);

    const moviesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })); 
    return moviesData;
}

// Example function to call retrieveMovies with data for each category
 export async function displayMovies() {
    try {
        // Fetch movies data by category
        const topRatedMovies = await getMoviesByCategory("top rated");
        const romanticMovies = await getMoviesByCategory("romantic");
        const actionMovies = await getMoviesByCategory("action");
        const thrillerMovies = await getMoviesByCategory("thriller");

        // Call retrieveMovies for each category
        retrieveMovies(topRatedMovies, "top-rated"); // Pass the top-rated movies data to 'top-rated' div
        retrieveMovies(romanticMovies, "romantic"); // Pass the romantic movies data to 'romantic' div
        retrieveMovies(actionMovies, "action"); // Pass the action movies data to 'action' div
        retrieveMovies(thrillerMovies, "thriller"); // Pass the thriller movies data to 'thriller' div
    } catch (error) {
        console.error("Error displaying movies:", error);
    }
}

// Wait for the DOM content to load, then initialize the app
document.addEventListener("DOMContentLoaded", function () {
    displayMovies();
});