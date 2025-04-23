import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../Components/loader";


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import Button from "../Components/Button";

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

const formSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loader() {
      try {
        setTimeout(() => {
          setLoading(false);
        },2000);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    }
    loader();
  }, []);
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <Loader />
      </div>
    );
  }

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true); // Just in case it's not already set
  
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
  
      console.log("User logged in:", userCredential.user);
  
      // Custom logic for a specific user (e.g. admin)
      if (values.email === "rithishmuthu0987@gmail.com") {
        window.localStorage.setItem("token", true); 
      } else {
        window.localStorage.removeItem("token");
      }
  
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      setErrors({ general: error.message }); 
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
        </div>

        <h2 className="text-center text-xl font-semibold text-white mb-4">
          Login to Your Account
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={formSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
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
                  <div className="text-red-400 text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

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
                  <div className="text-red-400 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="text-red-400 text-sm mb-4 text-center">
                  {errors.general}
                </div>
              )}

              <div className="mb-4">
                {isSubmitting ? (
                  
                  <Button action={"Logging in..."}/>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                    disabled={isSubmitting}
                  >
                    Login
                    {/* {isSubmitting ? "Logging in..." : "Login"} */}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>

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
