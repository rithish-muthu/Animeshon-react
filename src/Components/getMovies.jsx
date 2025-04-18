
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
// import { handleMovieClick } from "./FirebaseAuth";


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


//  export function retrieveMovies(moviesData, containerId) {
//     try {
//         const moviesContainer = document.getElementById(containerId); 
//         if (!moviesContainer) {
            
//             return;
//         }
//         moviesContainer.innerHTML = ""; 

       
//         if (moviesData.length === 0) {
//             moviesContainer.innerHTML = "<p>No movies found.</p>";
//             return; 
//         }

        


       
//         const buttons = moviesContainer.querySelectorAll('.movie-btn');
//         buttons.forEach(button => {
//             button.addEventListener('click', (e) => {
//                 const movieId = e.target.getAttribute('data-id');
//                 const movieName = e.target.getAttribute('data-name')
//                 handleMovieClick(movieId,movieName);
//             });
//         });
//     } catch (error) {
//         console.error("Error retrieving data: ", error);
//     }
// }





 export async function getMoviesByCategory(category) {
    const moviesCollectionRef = collection(db, "movies");
    const q = query(moviesCollectionRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    console.log(snapshot)

    const moviesData = []
    snapshot.docs.forEach(doc => moviesData.push(doc.data()))


    return moviesData;

}
