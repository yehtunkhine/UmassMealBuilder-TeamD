import React from "react";
import { useRef, useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail} from 'firebase/auth';
import './loginstyles.css';
import { Link, NavLink } from "react-router-dom";
import { useContext } from 'react';
import { FirebaseContext, AuthenticationContext } from './../App';





const Login = () => {
    //Initialize firebase
    const app = useContext(FirebaseContext);
    const auth = useContext(AuthenticationContext);
    const txtEmail = useRef(null);
    const txtPassword = useRef(null);


    /*const monitorAuthState = async () => {
        onAuthStateChanged(auth, user => {
            if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            console.log("Hello");
            // ...
            } else {
            // User is signed out
            // ...
            console.log("Hi");
            }
        });
    }*/
    
    const sendPasswordReset = async (email) => {
        try {
          await sendPasswordResetEmail(auth, email);
          alert("Password reset link sent!");
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      };

    const login = async() => {
        //Get text values
        const loginEmail = txtEmail.current.value;
        const loginPassword = txtPassword.current.value;
        //monitorAuthState();
        //Try signup
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
              });
            
        }
        //If error, then probably username/password invalid.
        catch(error) {
            console.log(`There was an error: ${error}`);
            alert(error);
        }
    };

   /*const logout = async() => {
       // monitorAuthState();
        signOut(auth);
    }*/

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
            <text>   Show Password</text>
            
            <br></br>
            <div>
                <button class = "button" onClick={login}>Login</button>
            </div>
            
        </div>
    );
}

/*
<br></br> Singup button
            <div>
                <button class = "button" onClick={login}>Sign Up</button>
            </div>
<br></br> Logout button
            <div>
                <button class="button" onClick={logout}>Logout</button>
            </div> */
export default Login;
