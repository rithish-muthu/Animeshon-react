import React from 'react'
// import { useLocation } from 'react-router-dom'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loader from './loader'


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Your web app's Firebase configuration
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


const formSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function loader(){
      try{
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    }
    loader()
  },[]);
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <Loader />
      </div>
    );
  }

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      console.log("User logged in:", userCredential.user);
      navigate("/"); 
    } catch (error) {
      console.error("Login error:", error.message);
      setErrors({ general: error.message });
    }
    setSubmitting(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* User Icon */}
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
        </div>

        {/* Form Title */}
        <h2 className="text-center text-xl font-semibold text-white mb-4">
          Login to Your Account
        </h2>

        {/* Login Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={formSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Email:
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && (
                  <div className="text-red-400 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Password:
                </label>
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                {errors.password && touched.password && (
                  <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                )}
              </div>

              {/* General Error Message */}
              {errors.general && (
                <div className="text-red-400 text-sm mb-4 text-center">
                  {errors.general}
                </div>
              )}

              {/* Login Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Signup Link */}
        <div className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to={"/signup"}>
            <span className="text-blue-400 hover:underline">Create one</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Login;