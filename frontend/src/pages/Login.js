import React, { useEffect, useState } from 'react';
import { GoogleButton } from 'react-google-button';
import { useNavigate } from 'react-router-dom';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  connectAuthEmulator, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged } from 'firebase/auth';
import './loginstyles.css';

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

const handleGoogleSignIn = async () => {
  console.log('signing in');
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      console.log('user', user);
      console.log('token', token);
      console.log('credential', credential);
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }



export default function Login() {

  const [user, setUser] = useState();


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
      } 
    });
  }, []);

  const logOut = () => {
    auth.signOut().then(() => {
      setUser(null);
    }).catch((error) => {
      console.log('An error happened.');
    });
  }

  if(!user) {
    return (
      <div>
          <h1 className='text-center text-3xl font-bold py-8'>Sign in</h1>
          <div className='max-w-[240px] m-auto py-4' >
              <GoogleButton onClick={handleGoogleSignIn} />
          </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-center text-3xl font-bold py-8'>Welcome {user.displayName}</h1>
      <button onClick={logOut}>Sign out</button>
    </div>
  );

  };
