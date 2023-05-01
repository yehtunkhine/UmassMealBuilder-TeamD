import React, { useEffect, useState, useRef } from 'react';
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
  const txtEmail = useRef(null);
  const txtPassword = useRef(null);


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        let userObject = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          Allergens: "None",
          DietaryRestrictions: "None"
        }

        let userObject2 = JSON.stringify(userObject);
        console.log("suer object", userObject2);
        
        fetch(`http://localhost:3001/users/${userObject2}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
            return response.json();
        }).then(data => {
          console.log(data);
        }).catch(error => {
          console.log(error);
        });


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

  const login = async() => {
    //Get text values
    const loginEmail = txtEmail.current.value;
    const loginPassword = txtPassword.current.value;
    //Try singup
    try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    }
    //If error, then probably username/password invalid.
    catch(error) {
        console.log(`There was an error: ${error}`);
        alert("Invalid Username/Password");
    }
  };

      //Toggle password
  const hidePassword = () => {
      var x = document.getElementById("password");
      if (x.type === "password") {
          x.type = "text";
      } else {
          x.type = "password";
      }
    }

  if(!user) {
    return (
      <div class = "outerBox" >
            <text class = "labelText">Email:</text>
            <input class = "inputText" ref = {txtEmail} type = "text" id = "username" name = "emailInput" placeholder="Email"/>

            <text class =  "labelText">Password:</text>
            <input class = "inputText" ref = {txtPassword} type = "text" id = "password" name = "passwordInput" placeholder="Password" type = "password"/>
            <input type="checkbox" onClick = {hidePassword}/>
            <text>Show Password</text>
            <div>
                <button class = "button" onClick={login}>Login</button>
            </div>
            <div>
                    <button class = "button" onClick={login}>Sign Up</button>
            </div>
          <h1 className='text-center text-3xl font-bold py-8'>Sign in</h1>
          <div className='signUpButton max-w-[240px] m-auto py-4' >
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
