import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

import React, { useEffect, useState } from "react";
import { getMoviesByCategory } from "../Components/getMovies";
import { useNavigate } from "react-router-dom";
import { handleMovieClick } from "../Components/FirebaseAuth";
import Loader from "../Components/loader";

function Dashboard() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState({
    topRated: [],
    romantic: [],
    action: [],
    thriller: [],
  });

  const [loading, setLoading] = useState(true);
  const [searchedArr, setSearchedArr] = useState([]);
  // const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

        // const topRatedMovies = await getMoviesByCategory("top rated");
        // const romanticMovies = await getMoviesByCategory("romantic");
        // const actionMovies = await getMoviesByCategory("action");
        // const thrillerMovies = await getMoviesByCategory("thriller");

        setMovies({
          topRated: topRatedMovies,
          romantic: romanticMovies,
          action: actionMovies,
          thriller: thrillerMovies,
        });

        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchValue.trim() !== "") {
      const allMovies = [
        ...movies.topRated,
        ...movies.romantic,
        ...movies.action,
        ...movies.thriller,
      ];

      const filtered = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchValue.toLowerCase())
      );

      setSearchedArr(filtered);
    } else {
      setSearchedArr([]);
    }
  }, [searchValue, movies]);

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
        className="w-[250px] flex flex-col justify-between flex-shrink-0 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 select-none cursor-pointer hover:-translate-y-2"
        onClick={() => {
          window.localStorage.setItem("movie", JSON.stringify(movie));
          handleMovieClick(auth, navigate, movie);
        }}
      >
        <h2 className="text-lg font-semibold text-white truncate">
          {movie.title}
        </h2>
        <img
          src={movie.image || "https://example.com/placeholder-image.jpg"}
          alt={movie.title}
          className="w-full h-40 object-cover rounded-md mt-2 transform scale-100 transition-transform duration-300"
          draggable="false"
        />
        <p className="text-gray-400 mt-2 text-sm">
          <strong>Genre:</strong>{" "}
          {movie.genres?.join(", ") || "No genres available"}
        </p>
        <p className="text-yellow-400 text-sm font-medium">
          <strong>Rating:</strong> {movie.rating || "N/A"}
        </p>
        <p>
          <a
            href={movie.trailer || ""}
            target="_blank"
            className="text-blue-400 hover:text-blue-300 hover:underline mt-3 inline-block transition-colors"
          >
            🎬 Watch Trailer
          </a>
        </p>
        <button
          onClick={() => {
            window.localStorage.setItem("movie", JSON.stringify(movie));
            handleMovieClick(auth, navigate, movie);
          }}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition-all"
        >
          🔍 Explore More
        </button>
      </div>
    ));
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen">
      <div>
        <div className="flex gap-2 items-center justify-center">
          <input
            type="text"
            placeholder="Search Anime..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            // onFocus={() => setIsSearch(true)}
            className="w-80 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-400 "
          />
        </div>

        {searchValue.trim() !== "" ? (
          searchedArr.length > 0 ? (
            <section className="mt-10">
              <h1 className="text-3xl font-bold text-white mb-4">
                🔍 Search Results
              </h1>
              <div
                className="flex overflow-x-auto gap-4 py-2"
                style={{ scrollbarWidth: "none" }}
              >
                {renderMovies(searchedArr)}
              </div>
            </section>
          ) : (
            <p className="text-white mt-10 ">No results found</p>
          )
        ) : (
          <></>
        )}
      </div>
      <div>
        {[
          { title: "🔥 Top Rated", data: movies.topRated },
          { title: "💖 Romantic", data: movies.romantic },
          { title: "⚔️ Action", data: movies.action },
          { title: "🕵️ Thriller", data: movies.thriller },
        ].map((category) => (
          <section key={category.title} className="mt-10">
            <h1 className="text-3xl font-bold text-white mb-4">
              {category.title}
            </h1>
            <div className="relative">
              <div
                className="flex overflow-x-auto gap-4 py-2"
                style={{ scrollbarWidth: "none" }}
              >
                {renderMovies(category.data)}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
