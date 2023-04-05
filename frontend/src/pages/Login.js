import React from "react";
import { useRef, useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import './loginstyles.css';
import { Link } from "react-router-dom";
import Signup from "./Signup.js";
import firebaseInit from "./firebaseInit";



//Initialize firebase
const app = firebaseInit();




const Login = () => {
    const txtEmail = useRef(null);
    const txtPassword = useRef(null);
    const auth = getAuth(app);

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