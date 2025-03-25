import React from 'react';
import logo from '../assets/logo-1.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";



// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore,doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { useNavigate } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};



// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);





function Header() {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(null  );
  const location = useLocation();
  const profileRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(db, "users", authUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser({
              uid: authUser.uid,
              ...userDoc.data(),
            });
          } else {
            console.error("No user document found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
      } catch (error) {
        alert(`Logout failed: ${error.message}`);
      }
    }
  };
  const isMain = location.pathname ==="/"
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const logoClickHandle = ()=>{
    if(!isMain){
      navigate('/')
      window.localStorage.removeItem('movie')
    }
  }

  return (
    <header className="p-4 sticky top-0  bg-gray-800 shadow-2xs z-50 shadow-blue-200">
      <div className="container mx-auto flex justify-between items-center">
         
        <div className="flex items-center gap-3">
          <div onClick={logoClickHandle} className=' '>
          <img src={logo} alt="Website Logo" className="rounded-full h-14 w-14 mix-blend-plus-lighter"  />
          </div>
          <div className="text-2xl font-bold text-blue-50">ANIMESHON</div>
        </div>

      
        <div className="flex items-center gap-4 relative">
        
          {!isAuthPage && !user && (
            <Link to="/login">
              <button
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 hover:bg-blue-600 active:scale-95"
              >
                Login
              </button>
            </Link>
          )}

          {user && (
            <div className="relative" ref={profileRef}>
              <button
                className="cursor-pointer text-white text-xl hover:text-blue-500 transition-colors duration-200"
                onClick={toggleProfile}
                aria-expanded={isProfileOpen}
                aria-label="Toggle profile menu"
              >
                <FontAwesomeIcon icon={faUser} size="2x" />
              </button>

              {/* Profile */}
              <div
                className={`absolute right-0 mt-2 w-72 bg-white p-4 border rounded-lg shadow-lg transition-all duration-300 transform ${
                  isProfileOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
                }`}
              >
                <div className="space-y-2">
                  <div className="text-gray-800 font-medium">
                    <strong>First Name:</strong> {user.firstName || "N/A"}
                  </div>
                  <div className="text-gray-800 font-medium">
                    <strong>Last Name:</strong> {user.lastName || "N/A"}
                  </div>
                  <div className="text-gray-800 font-medium">
                    <strong>Email:</strong> {user.email || "N/A"}
                  </div>
                </div>

               
                <button
                  className="mt-4 w-full bg-red-500 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-red-600 active:scale-95"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
                <Link to={'/wishlist'}>
                <button 
                className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-blue-800 active:scale-95"
                >Wishlist</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
