import React from "react";
import { useRef, useState } from 'react';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import './loginstyles.css';
import { Link } from "react-router-dom";
import Signup from "./Signup.js";



//Initialize firebase
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBIQMdCZU3XRcV0GhvD2N90bTgTZr9sxrk",
  authDomain: "umassmealbuilder-d9713.firebaseapp.com",
  projectId: "umassmealbuilder-d9713",
  storageBucket: "umassmealbuilder-d9713.appspot.com",
  messagingSenderId: "244857604224",
  appId: "1:244857604224:web:8ba3536d6ad5bb5dbf3e65",
  measurementId: "G-K58XKBTEEZ"
});

const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "https://localhost:9099");



const Login = () => {
    const txtEmail = useRef(null);
    const txtPassword = useRef(null);

    const login = async() => {
        const loginEmail = txtEmail.current.value;
        const loginPassword = txtPassword.current.value;
        console.log(loginEmail);
        console.log(loginPassword);

    try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    }
        catch(error) {
            console.log(`There was an error: ${error}`);
            alert("Invalid Username/Password");
            //showLoginError(error);
        }
    };

    const hidePassword = () => {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }


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
        </div>
    );
}
export default Login;