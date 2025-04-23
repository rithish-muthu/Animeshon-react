import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import EpisodesPage from "./episodes";
import Loader from "../Components/loader";
import Checkbox from "../Components/LikeButton";
import { AddToWishlist, RemoveFromWishlist } from "../Components/loader";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import EpisodesPage from "../Components/Episodes";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
  const [wishlistMessageComponent, setWishlistMessageComponent] =
    useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const AddButton = () => {
    return (
      <button
        title="Add New"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          className="stroke-slate-400 fill-none group-hover:fill-slate-800 group-active:stroke-slate-200 group-active:fill-slate-600 group-active:duration-0 duration-300"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            strokeWidth="1.5"
          />
          <path d="M8 12H16" strokeWidth="1.5" />
          <path d="M12 16V8" strokeWidth="1.5" />
        </svg>
      </button>
    );
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setIsAdmin(token);
    console.log("Is admin (from storage):", token);
  }, []);

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
      }, 2000);
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
          trailerUrl: anime.trailerUrl || "",
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
      {wishlistMessageComponent && (
        <div className="absolute right-5 top-24">
          {wishlistMessageComponent}
        </div>
      )}

      <div className="container mx-auto mb-10 pt-10 px-4">
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
              <button onClick={toggleWishlist}>
                <Checkbox isChecked={isWishlisted} />
              </button>

              {isAdmin && (
                <div onClick={()=>navigate(`/addepisode/${anime.id}`,{state:{anime:anime.title,animeId:anime.id}})}>
                  <AddButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EpisodesPage id={anime?.id || ""} />
    </main>
  );
}

export default AnimeDetails;
