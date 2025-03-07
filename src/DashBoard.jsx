
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwXdjJLt6SuSEI7Zxpu7yjw0KqVEXuLqk",
  authDomain: "animeshon-ott.firebaseapp.com",
  projectId: "animeshon-ott",
  storageBucket: "animeshon-ott.appspot.com",
  messagingSenderId: "66791238589",
  appId: "1:66791238589:web:44be6f3a218b55e3ae00d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);




 import React, { useEffect, useState } from "react";
import { getMoviesByCategory } from "./getMovies";
import { useNavigate } from "react-router-dom";
import { handleMovieClick } from "./FirebaseAuth";
import Loader from "./loader";


function Dashboard() {
   const navigate = useNavigate();

  const [movies, setMovies] = useState({
    topRated: [],
    romantic: [],
    action: [],
    thriller: [],
  });


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const [topRatedMovies, romanticMovies, actionMovies, thrillerMovies] =
          await Promise.all([
            getMoviesByCategory("top rated"),
            getMoviesByCategory("romantic"),
            getMoviesByCategory("action"),
            getMoviesByCategory("thriller"),
          ]);

        setMovies({
          topRated: topRatedMovies,
          romantic: romanticMovies,
          action: actionMovies,
          thriller: thrillerMovies,
        });

        
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <Loader />
      </div>
    );
  }


  const renderMovies = (moviesList) => {
    if (!moviesList.length) {
      return <p className="text-gray-400">No movies found.</p>;
    }

    return moviesList.map((movie) => (
      <div
        key={movie.id}
        className="min-w-[200px] bg-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <h2 className="text-white font-semibold truncate">{movie.title}</h2>
        <img
          src={movie.image || "https://example.com/placeholder-image.jpg"}
          alt={movie.title}
          className="w-full h-48 object-cover rounded-md mt-2"
        />
        <p className="text-gray-300 mt-2 text-sm">
          <strong>Genre:</strong> {movie.genres?.join(", ") || "No genres available"}
        </p>
        <p className="text-gray-300 text-sm">
          <strong>Rating:</strong> {movie.rating || "N/A"}
        </p>
        <p><a href={movie.trailer || "https://www.youtube.com/"} target="">Watch Trailer</a></p>
        <button
          onClick={() =>{
            window.localStorage.setItem("movie", JSON.stringify(movie));
            handleMovieClick(auth, navigate, movie);
          } }
          className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Explore More
        </button>
      </div>
    ));
  };

  return (
    <div className="p-4">
      {/* Top Rated Section */}
      <section className="mt-5">
        <h1 className="text-2xl font-bold text-white mb-3">Top Rated</h1>
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide">
            {renderMovies(movies.topRated)}
          </div>
        </div>
      </section>

      {/* Other Categories */}
      <section className="mt-5">
        <h1 className="text-2xl font-bold text-white mb-3">Romantic</h1>
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide">
            {renderMovies(movies.romantic)}
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h1 className="text-2xl font-bold text-white mb-3">Action</h1>
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide">
            {renderMovies(movies.action)}
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h1 className="text-2xl font-bold text-white mb-3">Thriller</h1>
        <div className="relative">
          <div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide">
            {renderMovies(movies.thriller)}
          </div>
        </div>
      </section>
    </div>
  );
}


export default Dashboard;