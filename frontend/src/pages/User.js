import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AuthenticationContext } from './../App';
import { useRef } from 'react';
import './loginstyles.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
//import { EmailAuthCredential, updatePassword } from 'firebase/auth';


export default function User(){
    let auth = useContext(AuthenticationContext);
    let user = auth.currentUser;
    const allergensRef = useRef(null);
    const settingsRef = useRef(null);
    const favoritesRef = useRef(null);
    const navigate = useNavigate();
    /* In case we can ever fix the user authentication
    const txtPassword = useRef(null);
    const txtNewPassword = useRef(null);
    const txtReNewPassword = useRef(null);

    const changePassword = () =>{
        const password = txtPassword.current.value;
        const newPassword = txtNewPassword.current.value;
        const confirmPassword = txtReNewPassword.current.value;

        var strongPassword = false;
        let len = newPassword.length;
        console.log(len);
        for (let i = 0; i < len; i++) {
            let code = newPassword.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                    strongPassword = true;
            }
        }
        try{
            if(newPassword.localeCompare(newPassword.toUpperCase()) === 0 || newPassword.localeCompare(newPassword.toLowerCase()) === 0 
                || !/[0-9]/.test(newPassword) || !strongPassword || len < 8){
                throw new Error("Password is not strong enough, please have at least 1 number, 1 uppercase, 1 lowercase, 1 special character and at least 8 characters");
            }
            if(newPassword.localeCompare(confirmPassword) !== 0){
                throw new Error("Passwords don't match");
            }
        }catch(error){
            console.log(`There was an error: ${error}`);
            alert(error);
            return;
        }  
        let credential = EmailAuthCredential.credential(user.email ,password).then(() => {
            try{
                updatePassword(user, newPassword).then(() => {
                    try{
                        alert("Password successfully changed");
                    }catch(error){
                        console.log(error);
                        alert(error);
                    }
                })
            }catch(error){
                console.log(error);
                alert(error);
            }
        })
    }*/

    const sendPasswordReset = async () => {
        let email = user.email;
        try {
          await sendPasswordResetEmail(auth, email);
          alert("Password reset link sent to email!");
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
    };


    const scrollAllergens = () =>{
        allergensRef.current?.scrollIntoView({behavior: 'smooth'});
    }
    const scrollSettings = () =>{
        settingsRef.current?.scrollIntoView({behavior: 'smooth'});
    }
    const scrollFavorites = () =>{
        favoritesRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    
    const handleDropdown = () =>{
        let dropdown = document.getElementsByClassName("dropdown-btn");
        let i;

        for (i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var dropdownContent = this.nextElementSibling;
                if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
                } else {
                dropdownContent.style.display = "block";
                }
            });
        }
    }   
    handleDropdown();

    const getRestrictions = () =>{
        let restrictions = [" ", "Milk", "Peanuts", "Shellfish", "Eggs", "Gluten", "Tree Nuts", "Fish", "Soy", "Corn", "Sesame", 
        "Vegetarian", "Plant Based", "Local", "Whole Grain", "Halal", "Antibiotic Free", "Sustainable"];
        let selection = document.getElementById("allergen");
        for(let i = selection.length-1; i >= 0; i--){
            selection.remove(i);
        }
        for(let i = 0; i < restrictions.length; i++){
            var el = document.createElement("option");
            el.textContent = restrictions[i];
            el.value = restrictions[i];
            selection.appendChild(el);
        }
    }  

    useEffect(() => {
        if(user === null){
            navigate("/");
        }
        getRestrictions();
    });
    return (  
    <div class ="flex-container">
        <div class="sidenav flex-child-nav">
            <text class = "forgotPasswordButton" onClick={scrollAllergens}>Allergens/Restrictions</text>
            <text class = "forgotPasswordButton" onClick={scrollFavorites}>Upcoming Favorites</text>
            <text class = "forgotPasswordButton" onClick={scrollSettings}>Account Settings</text>
        </div>
        <div class="container flex-child" >
            <div>
                <h2>Welcome {user.displayName}!</h2>
            </div>
            <div class = "userBox labelBox" ref = {allergensRef}>
                <h3>Allergens</h3>
            </div>
            <div class = "userBox">
                <h4>Add a restriction</h4>
                <select id="allergen"></select>
                <button >Add Restriction</button>
            <div class="separate"></div>
                <h4>Current Restrictions</h4>
            </div>
            <br></br>
            <div class = "userBox" ref = {favoritesRef}>
                <h3>Upcoming Favorites</h3>
            </div>
            <br></br>
            <div class = "userBox" ref = {settingsRef}>
                <h3>Settings</h3>
                <div class = "innerBox">
                    <button onClick = {handleDropdown} class="dropdown-btn">Change Password 
                        <i class="fa fa-caret-down"></i>
                    </button>
                    
                    <div class="dropdown-container">
                        <button class = "" onClick={sendPasswordReset} >Send Password Reset Link</button>
                    </div>
                </div>
            </div>
        </div>
        <script></script>
    </div>
    );
}
/*<text class = "dropdown-text">Enter Current Password</text>
                        <input class = "input" ref = {txtPassword} id = "password" name = "passwordInput" placeholder="Password" type = "password"/>
                        <text class = "dropdown-text">Enter New Password</text>
                        <input class = "input" ref = {txtNewPassword} id = "password" name = "passwordInput" placeholder="New Password" type = "password"/>
                        <text class = "dropdown-text">Re-enter New Password</text>
                        <input class = "input" ref = {txtReNewPassword} id = "password" name = "passwordInput" placeholder="Re-Enter New Password" type = "password"/>
                        <button onClick={changePassword} class = "">Change Password</button>*/