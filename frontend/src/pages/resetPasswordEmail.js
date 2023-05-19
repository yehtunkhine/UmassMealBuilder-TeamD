import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useContext } from 'react';
import { useRef } from 'react';
import { AuthenticationContext } from './../App';
import { useNavigate } from 'react-router-dom';
import './loginstyles.css';



export default function ResetPasswordEmail(){
    const auth = useContext(AuthenticationContext);
    const navigate = useNavigate();

    const txtEmail = useRef(null);

    const sendPasswordReset = async () => {
        let email = txtEmail.current.value;
        try {
            if(email.length === 0){
                throw new Error("Please enter your email");
            }
          await sendPasswordResetEmail(auth, email);
          alert("If email exists, password reset link sent!");//To try to have ambiguity
          navigate("/");
        } catch (err) {
            if(err.code === 'auth/user-not-found'){
                alert("If email exists, password reset link sent!");
                navigate("/");
                return;
            }
          console.error(err);
          alert(err.message);
        }
    };
    return  (
    <div class = "outerBox" >
        <text class = "description">Please enter your email address then check your email for a reset link.</text>
        <input class = "inputText" ref = {txtEmail} type = "text" id = "username" name = "emailInput" placeholder="Email"/>
        <div>
            <button class = "button" onClick={sendPasswordReset}>Reset Password</button>
        </div>
    </div>
    );
}