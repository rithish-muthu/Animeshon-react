// document.addEventListener("DOMContentLoaded", async function () {
//     const firebaseConfig = {
//       apiKey: "YOUR_API_KEY",
//       authDomain: "YOUR_AUTH_DOMAIN",
//       projectId: "YOUR_PROJECT_ID",
//       storageBucket: "YOUR_STORAGE_BUCKET",
//       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//       appId: "YOUR_APP_ID"
//     };
  
//     firebase.initializeApp(firebaseConfig);
//     const db = firebase.firestore();
//     const auth = firebase.auth();
    
//     const wishlistContainer = document.getElementById("wishlist-container");
//     const loadingText = document.getElementById("loading");
  
//     auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         const userId = user.uid;
//         const wishlistRef = db.collection(`users/${userId}/wishlist`);
        
//         try {
//           const querySnapshot = await wishlistRef.get();
//           wishlistContainer.innerHTML = "";
  
//           if (querySnapshot.empty) {
//             wishlistContainer.innerHTML = "<p>No items in wishlist.</p>";
//           } else {
//             querySnapshot.forEach((doc) => {
//               const movie = doc.data();
//               const movieElement = document.createElement("div");
//               movieElement.classList.add("wishlist-item");
//               movieElement.innerHTML = `
//                 <h3>${movie.title}</h3>
//                 <img src="${movie.image}" alt="${movie.title}" width="200">
//                 <p>${movie.genres}</p>
//                 <p>⭐ ${movie.rating}</p>
//                 <a href="${movie.trailerUrl}" target="_blank">▶ Watch Trailer</a>
//                 <button onclick="exploreMovie(${JSON.stringify(movie)})">Explore More</button>
//                 <button onclick="removeFromWishlist('${doc.id}')">Remove</button>
//               `;
//               wishlistContainer.appendChild(movieElement);
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//         }
//       } else {
//         wishlistContainer.innerHTML = "<p>Please log in to see your wishlist.</p>";
//       }
//       loadingText.style.display = "none";
//     });
  
//     window.removeFromWishlist = async function (movieId) {
//       const user = auth.currentUser;
//       if (!user) return;
//       try {
//         await db.doc(`users/${user.uid}/wishlist/${movieId}`).delete();
//         document.location.reload();
//       } catch (error) {
//         console.error("Error removing item from wishlist:", error);
//       }
//     };
  
//     window.exploreMovie = function (movie) {
//       localStorage.setItem("movie", JSON.stringify(movie));
//       window.location.href = "movie-details.html";
//     };
//   });
  