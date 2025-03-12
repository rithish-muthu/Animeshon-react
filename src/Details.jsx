import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import EpisodesPage from "./episodes";
import Loader from "./loader";
import Checkbox from "./LikeButton";
import { AddToWishlist,RemoveFromWishlist } from "./loader";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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
const auth = getAuth(app);

function Details() {
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  // const [showWishlistMessage, setShowWishlistMessage] = useState(false);
  const [user, setUser] = useState(null);
  const [wishlistMessageComponent, setWishlistMessageComponent] = useState(null);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const data = window.localStorage.getItem("movie");
      if (!data) {
        navigate("/");
      } else {
        const parsedAnime = JSON.parse(data);
        setAnime(parsedAnime);
      }

      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      navigate("/");
      setLoading(false);
    }
  }, [navigate]);

  
  useEffect(() => {
    if (user && anime?.title) { // Ensure anime exists before running
      const movieRef = doc(db, `users/${user.uid}/wishlist`, anime.title);
  
      getDoc(movieRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setIsWishlisted(true);
          } else {
            setIsWishlisted(false);
          }
        })
        .catch((error) => {
          console.error("Error checking wishlist status:", error);
        });
    }
  }, [user, anime]); // Runs when `user` or `anime` changes
  

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please log in to manage your wishlist.");
      return;
    }
  
    const movieRef = doc(db, `users/${user.uid}/wishlist`, anime.title);
  
    try {
      if (isWishlisted) {
        // Remove from wishlist
        await deleteDoc(movieRef);
        setIsWishlisted(false);
        console.log("Removed from wishlist");
        setWishlistMessageComponent(<RemoveFromWishlist />);
      } else {
        // Add to wishlist
        await setDoc(movieRef, {
          title: anime.title,
          image: anime.image,
          genres: anime.genres,
          rating: anime.rating,
          trailerUrl: anime.trailer || "",
        });
        setIsWishlisted(true);
        console.log("Added to wishlist");
        setWishlistMessageComponent(<AddToWishlist />);
      }
  
      // Hide message after 3 seconds
      setTimeout(() => {
        setWishlistMessageComponent(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <Loader />
      </div>
    );
  }

  if (!anime) return null;

  return (
    <main className="h-[78vh]">
      {wishlistMessageComponent && (
  <div className="absolute right-0  top-25">{wishlistMessageComponent}</div>
)}
      <div className="container mx-auto my-10 px-4 select-none">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
          <div className="md:w-1/3 w-full">
            <img
              src={anime.image}
              alt="Movie Image"
              className="w-full rounded-lg shadow-lg"
              draggable = "false"
            />
          </div>
          <div className="md:w-2/3 w-full flex flex-col justify-between ">
            <h1 className="text-3xl font-bold">{anime.title}</h1>
            <p className="text-gray-700">Genres: {anime.genres}</p>
            <p className="text-gray-700">Rating: {anime.rating}</p>
            <p>
              {console.log(anime)}
              <a
                href={anime.trailerUrl}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Watch Trailer
              </a>
            </p>
            <div className="text-gray-800">{anime.description}</div>
            <div className="flex gap-10">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                Go to Episodes
              </button>
              <button onClick={toggleWishlist}>
                <Checkbox isChecked={isWishlisted} />
              </button>
            </div>
          </div>
        </div>
      </div>
      

    </main>
  );
}

export default Details;