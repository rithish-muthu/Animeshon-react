import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
// const auth = getAuth(app);

function AddEpisodes() {
  const location = useLocation();
  const { anime, animeId } = location.state || {};

  const [animeName, setAnimeName] = useState("");
  const [episodeDescription, setEpisodeDescription] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [episodeName, setEpisodeName] = useState("");
  const [id, setId] = useState("");
  // const [values,setValues] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    if (anime) setAnimeName(anime);
    if (animeId) setId(animeId);
  }, [anime, animeId]);

  async function addSubmittedData(e) {
    e.preventDefault();
    const newEpisode = {
      animeName,
      episodeDescription,
      episodeId,
      episodeName,
      id,
    };
    // console.log(values)
    try {
      const movieRef = doc(db, "movies", id);
      const docSnap = await getDoc(movieRef);

      if (docSnap.exists()) {
        const existingEpisodes = docSnap.data().episodes || [];

        const updatedEpisodes = [...existingEpisodes, newEpisode];

        await updateDoc(movieRef, {
          episodes: updatedEpisodes,
        });

        alert("Episode added successfully!");
        setEpisodeDescription("");
        setEpisodeId("");
        setEpisodeName("");
        navigate(`/details/${animeName}`);
      } else {
        console.error("Movie not found!");
      }
    } catch (error) {
      console.error("error while updating: " + error);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUser} size="12" />
        </div>

        <h1 className="text-center text-2xl font-semibold text-white mb-6">
          Add Episode in {anime}
        </h1>

        <form onSubmit={addSubmittedData}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Anime Name:
            </label>
            <input
              type="text"
              name="animeName"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the Anime Name"
              value={animeName}
              onChange={(e) => setAnimeName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Episode Description:
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter The Episode Description"
              value={episodeDescription}
              onChange={(e) => setEpisodeDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Episode Id:
            </label>
            <input
              type="text"
              name="episodeId"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter The Episode Id"
              value={episodeId}
              onChange={(e) => setEpisodeId(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Episode Name:
            </label>
            <input
              type="text"
              name="episodeName"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter The Episode Name"
              value={episodeName}
              onChange={(e) => setEpisodeName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">
              id:
            </label>
            <input
              type="text"
              name="id"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Anime id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export { AddEpisodes };
