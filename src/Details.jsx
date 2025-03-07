import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import EpisodesPage from "./episodes";
import Loader from "./loader";
import Checkbox from "./LikeButton";
import { AddToWishlist } from "./loader";

import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBwXdjJLt6SuSEI7Zxpu7yjw0KqVEXuLqk",
  authDomain: "animeshon-ott.firebaseapp.com",
  projectId: "animeshon-ott",
  storageBucket: "animeshon-ott.appspot.com",
  messagingSenderId: "66791238589",
  appId: "1:66791238589:web:44be6f3a218b55e3ae00d4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function Details() {


  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  

  useEffect(() => {
    try {
      const data = window.localStorage.getItem("movie");
      if (!data) {
        navigate("/");
      } else {
        const parsedAnime = JSON.parse(data);
        setAnime(parsedAnime);

        // Check if the anime is already in the wishlist
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const movieRef = doc(db, `users/${userId}/wishlist`, parsedAnime.title);

          getDoc(movieRef).then((docSnap) => {
            if (docSnap.exists()) {
              setIsWishlisted(true);
            }
          });
        }
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

  const [showWishlistMessage, setShowWishlistMessage] = useState(false);

const toggleWishlist = async () => {
  if (!auth.currentUser) {
    alert("Please log in to manage your wishlist.");
    return;
  }

  const userId = auth.currentUser.uid;
  const movieRef = doc(db, `users/${userId}/wishlist`, anime.title);

  try {
    if (isWishlisted) {
      // Remove from wishlist
      await deleteDoc(movieRef);
      setIsWishlisted(false);
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

      // Show message for 3 seconds
      setShowWishlistMessage(true);
      setTimeout(() => {
        setShowWishlistMessage(false);
      }, 3000);
    }
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
    <main>
      <div className="container mx-auto my-10 px-4">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
          <div className="md:w-1/3 w-full">
            <img
              src={anime.image}
              alt="Movie Image"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3 w-full flex flex-col items-start justify-center">
            <h1 className="text-3xl font-bold">{anime.title}</h1>
            <p className="text-gray-700">Genres: {anime.genres}</p>
            <p className="text-gray-700">Rating: {anime.rating}</p>
            <p>
              <a
                href={anime.trailer}
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
      {showWishlistMessage && (
        <div>
        <AddToWishlist/>
        </div>
)}
    </main>
  );
}

export default Details;
