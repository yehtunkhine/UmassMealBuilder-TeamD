import React, { useEffect } from 'react';
import { GoogleButton } from 'react-google-button';
import { useNavigate } from 'react-router-dom';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIQMdCZU3XRcV0GhvD2N90bTgTZr9sxrk",
  authDomain: "umassmealbuilder-d9713.firebaseapp.com",
  projectId: "umassmealbuilder-d9713",
  storageBucket: "umassmealbuilder-d9713.appspot.com",
  messagingSenderId: "244857604224",
  appId: "1:244857604224:web:8ba3536d6ad5bb5dbf3e65",
  measurementId: "G-K58XKBTEEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Login() {

  const handleGoogleSignIn = async () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
        }
  
      return (
            <div>
                <h1 className='text-center text-3xl font-bold py-8'>Sign in</h1>
                <div className='max-w-[240px] m-auto py-4' >
                    <GoogleButton onClick={handleGoogleSignIn} />
                </div>
            </div>
        );

};