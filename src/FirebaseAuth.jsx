
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwXdjJLt6SuSEI7Zxpu7yjw0KqVEXuLqk",
  authDomain: "animeshon-ott.firebaseapp.com",
  projectId: "animeshon-ott",
  storageBucket: "animeshon-ott.appspot.com",
  messagingSenderId: "66791238589",
  appId: "1:66791238589:web:44be6f3a218b55e3ae00d4"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export  const db = getFirestore(app);

import { onAuthStateChanged } from "firebase/auth";

export function handleMovieClick(auth, navigate, movie) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate(`/details/${movie.title}`);
    } else {
      alert("User not Logged In");
      navigate("/login");
    }
  });
}


