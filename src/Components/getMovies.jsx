
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { handleMovieClick } from "./FirebaseAuth";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


 export function retrieveMovies(moviesData, containerId) {
    try {
        const moviesContainer = document.getElementById(containerId); 
        if (!moviesContainer) {
            
            return;
        }
        moviesContainer.innerHTML = ""; 

       
        if (moviesData.length === 0) {
            moviesContainer.innerHTML = "<p>No movies found.</p>";
            return; 
        }

        
        moviesData.forEach(movie => {
           
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-card'); 

           
            const genres = movie.genres ? movie.genres.join(', ') : 'No genres available';

            movieElement.innerHTML = `
                <h2>${movie.title}</h2>
                <img src="${movie.image || 'https://example.com/placeholder-image.jpg'}" alt="${movie.title}" style="width:200px;height:300px;" />
                <p><strong>Genre:</strong> ${genres}</p>
                <p><strong>Rating:</strong> ${movie.rating || 'N/A'}</p>
                <p><a href="${movie.trailerUrl}" target="_blank" class = "btn-neon">Watch Trailer</a></p>
                <button class="movie-btn" data-id="${movie.id}" data-name="${movie.title}">Explore More</button>
            `;

            
            moviesContainer.appendChild(movieElement);
        });

       
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


 export async function displayMovies() {
    try {
       
        const topRatedMovies = await getMoviesByCategory("top rated");
        const romanticMovies = await getMoviesByCategory("romantic");
        const actionMovies = await getMoviesByCategory("action");
        const thrillerMovies = await getMoviesByCategory("thriller");

       
        retrieveMovies(topRatedMovies, "top-rated"); 
        retrieveMovies(romanticMovies, "romantic"); 
        retrieveMovies(actionMovies, "action"); 
        retrieveMovies(thrillerMovies, "thriller"); 
    } catch (error) {
        console.error("Error displaying movies:", error);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    displayMovies();
});