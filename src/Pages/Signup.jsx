import React from 'react'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loader from '../Components/loader'



import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore,setDoc,doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import Button from '../Components/Button'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);





const formSchema = Yup.object({
  firstName: Yup.string().min(3).max(25).required("First Name is required"),
  lastName: Yup.string().min(3).max(25).required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function loader(){
      try{
        setTimeout(() => {
          setLoading(false);
        }, 2000);
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

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
       
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUser} size="12" />
        </div>

       
        <h1 className="text-center text-2xl font-semibold text-white mb-6">
          Create an Account
        </h1>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={formSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
             
              const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
              const user = userCredential.user;
          
              
              await setDoc(doc(db, "users", user.uid), {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                uid: user.uid, 
                password:values.password
              });
              
          
              alert("Account created successfully!");
          
             
              navigate("/");
            } catch (error) {
              setErrors({ general: error.message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
             
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">First Name:</label>
                <Field
                  type="text"
                  name="firstName"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
                {errors.firstName && touched.firstName && <div className="text-red-400">{errors.firstName}</div>}
              </div>

              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">Last Name:</label>
                <Field
                  type="text"
                  name="lastName"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
                {errors.lastName && touched.lastName && <div className="text-red-400">{errors.lastName}</div>}
              </div>

              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">Email:</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && <div className="text-red-400">{errors.email}</div>}
              </div>

              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">Create Password:</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                {errors.password && touched.password && <div className="text-red-400">{errors.password}</div>}
              </div>

             
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-1">Confirm Password:</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && touched.confirmPassword && <div className="text-red-400">{errors.confirmPassword}</div>}
              </div>

             
              {errors.general && <div className="text-red-400 text-center mb-4">{errors.general}</div>}

             
              <div className="mb-4">
                {isSubmitting ? (
                  
                  <Button action={"Signing in..."}/>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                    disabled={isSubmitting}
                  >
                    Sign In
                    
                  </button>
                )} 
              </div>
            </Form>
          )}
        </Formik>

        
        <div className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Signup;