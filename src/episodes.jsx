// import { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// import { collection, getDocs, query, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID
//   };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const EpisodesPage = ({ animeName }) => {
//     const [episodes, setEpisodes] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//     useEffect(() => {
//       const fetchEpisodes = async () => {
//         try {
//           if (!episodes) return;
  
//           const episodesRef = collection(db, "episodes", animeName);
//           const q = query(episodesRef);
//           const querySnapshot = await getDocs(q);
  
//           const episodesList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
  
//           setEpisodes(episodesList);
//         } catch (error) {
//           console.error("Error fetching episodes:", error);
//         } finally {
//           setLoading(false);
//         }

//         try {
//             const docRef = doc(db, "episodes", "all"); // Assuming all episodes are in a single document named 'all'
//             const docSnap = await getDoc(docRef);
        
//             if (docSnap.exists()) {
//               const data = docSnap.data();
//               if (data[animeName]) {
//                 setEpisodes(data[animeName]); // Access the correct anime episodes array
//               } else {
//                 console.warn(`No episodes found for anime: ${animeName}`);
//                 setEpisodes([]);
//               }
//             } else {
//               console.warn("Episodes document not found");
//               setEpisodes([]);
//             }
//           } catch (error) {
//             console.error("Error fetching episodes:", error);
//           } finally {
//             setLoading(false);
//           }
//       };
  
//       fetchEpisodes();
//     }, [animeName]);

    


  
//     if (loading) return <p>Loading...</p>;
  
//     return (
//       <div>
//         <h2>{animeName} Episodes</h2>
//         {episodes.length > 0 ? (
//           <ul>
//             {episodes.map((episode) => (
//               <li key={episode.episodeId}>
//                 <h3>{episode.episodeName}</h3>
//                 <p>{episode.episodeDescription}</p>
//                 <video controls width="500">
//                   <source src={episode.streaming} type="video/mp4" />
//                 </video>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No episodes found.</p>
//         )}
//       </div>
//     );
//   };
  
//   export default EpisodesPage;