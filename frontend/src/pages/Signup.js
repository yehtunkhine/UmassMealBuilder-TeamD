import React from "react";
import { useRef, useState } from 'react';
import { updateProfile, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import './loginstyles.css';
import { useContext } from 'react';
import { FirebaseContext, AuthenticationContext } from './../App';
import { GoogleButton } from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";




const Signup = () => {
    const app = useContext(FirebaseContext);
    const auth = useContext(AuthenticationContext);
    const provider = new GoogleAuthProvider();

    const navigate = useNavigate();
    
    const txtName = useRef(null);
    const txtEmail = useRef(null);
    const txtPassword = useRef(null);
    const txtConfirmPassword = useRef(null);

    const createAccount = async () => {
        const name = txtName.current.value;
        const email = txtEmail.current.value;
        const password = txtPassword.current.value;
        const confirmPassword = txtConfirmPassword.current.value;
        var strongPassword = false;
        let len = password.length;
        console.log(len);
        for (let i = 0; i < len; i++) {
            let code = password.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                    strongPassword = true;
            }
        }
        try{
            if(password.localeCompare(password.toUpperCase()) == 0 || password.localeCompare(password.toLowerCase()) == 0 
                || !/[0-9]/.test(password) || !strongPassword || len < 8){
                throw new Error("Password is not strong enough, please have at least 1 number, 1 uppercase, 1 lowercase, 1 special character and at least 8 characters");
            }
            if(password.localeCompare(confirmPassword) != 0){
                throw new Error("Passwords don't match");
            }
            if(name.length == 0){
                throw new Error("Please enter a display name");
            }
        }catch(error){
            console.log(`There was an error: ${error}`);
            alert(error);
            return;
        }
      
        try {
          await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(auth.currentUser, {
            displayName: name
        })
        signOut(auth);
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
        });
        navigate("/")
        }
        catch(error) {
          console.log(`There was an error: ${error}`);
          alert(error);
          return;
        } 
    };  

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
            <text class = "labelText">Display Name:</text>
                <input class = "inputText" ref = {txtName} type = "text" id = "name" name = "nameInput" placeholder="Display Name"/>
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
                <div  class = 'max-w-[240px] m-auto py-4'>
                    <GoogleButton className='signUpButton ' onClick={handleGoogleSignIn} />
                </div>
            </div>
        </div>  
        </html>
    );
}

export default Signup;
