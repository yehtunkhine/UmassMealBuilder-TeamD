
import React from "react";
import { useRef, useState } from 'react';
import { 
    getAuth, 
    connectAuthEmulator, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged } from 'firebase/auth';

    import { initializeApp } from "firebase/app";

import './loginstyles.css';

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


const Signup = () => {
    const txtEmail = useRef(null);
    const txtPassword = useRef(null);
    const txtConfirmPassword = useRef(null);
    const auth = getAuth(app);

    const createAccount = async () => {
        const email = txtEmail.current.value;
        const password = txtPassword.current.value;
        const confirmPassword = txtConfirmPassword.current.value;
        if(password.localeCompare(confirmPassword) != 0){
            throw new Error("Passwords don't match");
        }
      
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        }
        catch(error) {
          console.log(`There was an error: ${error}`);
          alert(error);
        } 
    };      

    const hidePassword = () => {
        var x = document.getElementById("password");
        var y = document.getElementById("confirmPassword")
        if (x.type === "password") {
            x.type = "text";
            y.type = "text";
        } else {
            x.type = "password";
            y.type = "password";
        }
    }

    return (
        <html>
        <div>
            <div class = "outerBox" >
                <text class = "labelText">Email:</text>
                <input class = "inputText" ref = {txtEmail} type = "text" id = "email" name = "emailInput" placeholder="Email"/>

                <text class =  "labelText">Password:</text>
                <input class = "inputText" ref = {txtPassword} type = "text" id = "password" name = "passwordInput" placeholder="Password" type = "password"/>
                <text class =  "labelText">Confirm Password:</text>
                <input class = "inputText" ref = {txtConfirmPassword} type = "text" id = "confirmPassword" name = "confirmPasswordInput" placeholder="Confirm Password" type = "password"/>
                <input type="checkbox" onClick = {hidePassword}/>
                <text>Show Password</text>
                <div>
                    <button class = "button" onClick={createAccount}>Sign Up</button>
                </div>
            </div>
        </div>  
        </html>
    );
    return (<div></div>);
}

export default Signup;