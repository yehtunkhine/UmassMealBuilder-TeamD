import React from "react";
import { useRef, useState } from 'react';
import { getAuth, connectAuthEmulator, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import './loginstyles.css';
import { useContext } from 'react';
import { FirebaseContext, AuthenticationContext } from './../App';




const Signup = () => {
    const app = useContext(FirebaseContext);
    const auth = useContext(AuthenticationContext);
    
    const txtEmail = useRef(null);
    const txtPassword = useRef(null);
    const txtConfirmPassword = useRef(null);

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
                <text>   Show Password</text>
                <br></br>
                <div>
                    <button class = "button" onClick={createAccount}>Sign Up</button>
                </div>
            </div>
        </div>  
        </html>
    );
}

export default Signup;
