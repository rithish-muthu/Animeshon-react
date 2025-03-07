import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { handleMovieClick } from "./FirebaseAuth";
import { useNavigate } from "react-router-dom";

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

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          const userId = user.uid;
          const wishlistRef = collection(db, `users/${userId}/wishlist`);
          try {
            const querySnapshot = await getDocs(wishlistRef);
            const items = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setWishlist(items);
          } catch (error) {
            console.error("Error fetching wishlist:", error);
          }
        }
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    const removeFromWishlist = async (itemId) => {
      if (!user) return;
  
      try {
        const itemRef = doc(db, `users/${user.uid}/wishlist`, itemId);
        await deleteDoc(itemRef);
  
        // Update local state
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error removing item from wishlist:", error);
      }
    };
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (!user) {
      return <p>Please log in to see your wishlist.</p>;
    }
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-gray-400 text-center">No items in wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 border border-gray-700 p-4 w-[300px] rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white truncate">
                  {item.title}
                </h3>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover rounded-md mt-2"
                />
                <p className="text-gray-400 mt-2 text-sm">{item.genres}</p>
                <p className="text-yellow-400 text-sm font-medium">⭐ {item.rating}</p>
                <a
                  href={item.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline mt-3 inline-block transition-colors"
                >
                  ▶ Watch Trailer
                </a>
                <button
                  onClick={() => {
                    window.localStorage.setItem("movie", JSON.stringify(item));
                    handleMovieClick(auth, navigate, item);
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition-all"
                >
                  Explore More
                </button>
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default Wishlist;
