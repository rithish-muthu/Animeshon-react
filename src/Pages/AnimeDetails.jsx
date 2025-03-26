import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import EpisodesPage from "./episodes";
import Loader from "../Components/loader";
import Checkbox from "../Components/LikeButton";
import { AddToWishlist,RemoveFromWishlist } from "../Components/loader";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import EpisodesPage from "../Components/Episodes";

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

function AnimeDetails() {
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const [user, setUser] = useState(null);
  const [wishlistMessageComponent, setWishlistMessageComponent] = useState(null);

  
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
      }, 1000);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      navigate("/");
      setLoading(false);
    }
  }, [navigate]);

  
  useEffect(() => {
    if (user && anime?.title) { 
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
  }, [user, anime]); 
  

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please log in to manage your wishlist.");
      return;
    }
  
    const movieRef = doc(db, `users/${user.uid}/wishlist`, anime.title);
  
    try {
      if (isWishlisted) {
      
        await deleteDoc(movieRef);
        setIsWishlisted(false);
        console.log("Removed from wishlist");
        setWishlistMessageComponent(<RemoveFromWishlist />);
      } else {
        
        
        await setDoc(movieRef, {
          title: anime.title,
          image: anime.image,
          genres: anime.genres,
          description: anime.description || "",
          rating: anime.rating,
          trailerUrl: anime.trailerUrl || ""
           
        });
        
        setIsWishlisted(true);
        console.log("Added to wishlist");
        setWishlistMessageComponent(<AddToWishlist />);
      }
  
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
    <main className="bg-gray-900 text-white min-h-screen ">
      {wishlistMessageComponent && 
        <div className="absolute right-5 top-10">{wishlistMessageComponent}</div>
      }
  
      <div className="container mx-auto mb-10 pt-10 px-4 h-[100vh]">
        <div className="flex flex-col md:flex-row items-center gap-8">
    
          <div className="md:w-1/3 w-full">
            <img
              src={anime.image}
              alt="Anime"
              className="w-full rounded-lg shadow-xl"
              draggable="false"
            />
          </div>
  
         
          <div className="md:w-2/3 w-full flex flex-col space-y-4">
            <h1 className="text-4xl font-bold">{anime.title}</h1>
            <p className="text-gray-300">
              <span className="font-semibold">Genres:</span> {anime.genres}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Rating:</span> {anime.rating}
            </p>
  
            {anime.trailerUrl && (
              <p>
                <a
                  href={anime.trailerUrl}
                  target="_blank"
                  className="text-blue-400 hover:text-blue-500 transition"
                >
                  🎬 Watch Trailer
                </a>
              </p>
            )}
  
            <p className="text-gray-400 leading-relaxed">{anime.description}</p>
  
            <div className="flex gap-6 mt-4">
              {/* <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                Go to Episodes
              </button> */}
  
              <button onClick={toggleWishlist}>
                <Checkbox isChecked={isWishlisted} />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      
      <EpisodesPage id={anime?.id || ""} />
    </main>
  );
  
}

export default AnimeDetails;