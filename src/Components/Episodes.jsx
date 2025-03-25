import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useParams, useLocation } from "react-router-dom";


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

const EpisodesPage = ({ id }) => {
  // const { id } = useParams();
  const [stream, setStream] = useState('')
  const location = useLocation();
  const params = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animeName, setAnimeName] = useState("");
  const [error, setError] = useState(null);
  const [selectedEpp, setSelectedEpp] = useState("");
  const [checkEpp, setCheckEpp] = useState(false)

  useEffect(() => {
    if (location.pathname.startsWith("/playing/")) {
      setCheckEpp(true);
      setSelectedEpp(params.id);
    } else {
      setCheckEpp(false);
    }
  }, [location.pathname, params.id]); 
    
    
    
  
  const fetchEpisodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const animeRef = doc(db, "movies", id);
      const docSnapshot = await getDoc(animeRef);

      if (!docSnapshot.exists()) {
        console.warn(`No data found for anime ID: ${id}`);
        setAnimeName("Unknown Anime");
        setEpisodes([]);
      } else {
        const animeData = docSnapshot.data();
        setAnimeName(animeData.animeName);
        setEpisodes(animeData.episodes || []);
        setStream(animeData.streamingUrl ? animeData.streamingUrl : animeData.trailerUrl);

      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      setError("Failed to load episodes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  
  useEffect(() => {
    console.log("Updated anime name:", animeName);
  }, [animeName]);
  const Load = ()=>{
    setTimeout(() => window.location.reload(), 1);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 h-[100vh]">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">{animeName} Episodes</h2>
  
      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">Loading episodes...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : episodes.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {episodes.map((episode, index) => (
  checkEpp && selectedEpp === episode.episodeId ? (
    <li
      key={episode.episodeId} 
      className="bg-gray-950 p-4 rounded-xl shadow-lg transform cursor-not-allowed transition-transform hover:scale-105 h-32 flex items-center justify-center"
    >
      <h3 className="text-lg font-semibold text-white">
        {index + 1}. {episode.episodeName}
      </h3>
    </li>
  ) : (
    <Link 
      key={episode.episodeId} 
      to={`/playing/${episode.episodeId}`} 
      state={{ 
        animeName: episode.animeName, 
        animeId: id, 
        episodeName: episode.episodeName, 
        id: episode.episodeId, 
        description: episode.episodeDescription,
        stream:stream
      }}
      onClick={Load}
    >
      <li
        className="bg-gray-800 p-4 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-700 h-32 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold text-white">
          {index + 1}. {episode.episodeName}
        </h3>
      </li>
    </Link>
  )
))}

        </ul>
      ) : (
        <p className="text-center text-gray-400">No episodes found.</p>
      )}
    </div>
  );
  
  
  
  
};

export default EpisodesPage;
