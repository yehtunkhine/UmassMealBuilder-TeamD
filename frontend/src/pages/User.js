import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticationContext } from './../App';
import { useRef } from 'react';
import './loginstyles.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
//import { EmailAuthCredential, updatePassword } from 'firebase/auth';

let firstRun = true;
let trackState = [];

export default function User(){
    let auth = useContext(AuthenticationContext);//Firebase authentication
    let user = auth.currentUser;
    const allergensRef = useRef(null);
    const settingsRef = useRef(null);
    const favoritesRef = useRef(null);
    const navigate = useNavigate();
    const [userRestrictionsState, setUserRestrictionsState] = useState(trackState);//Tracks restrictions

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

    const sendPasswordReset = async () => {//For reset password sends email
        let email = user.email;
        try {
          await sendPasswordResetEmail(auth, email);
          alert("Password reset link sent to email!");
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
    };

    //To scroll smoothly
    const scrollAllergens = () =>{
        allergensRef.current?.scrollIntoView({behavior: 'smooth'});
    }
    const scrollSettings = () =>{
        settingsRef.current?.scrollIntoView({behavior: 'smooth'});
    }
    const scrollFavorites = () =>{
        favoritesRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    //Handles dropdown for settings
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

    //Gets restrictions to display in dropdown
    const getRestrictions = () =>{
        //TODO If you want you can make these set to whatever's in the databse
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

    const getUserRestrictions = () =>{
        let restrictions = document.getElementById("userRestrictions");
        let removal = document.getElementById("userRestrictionsRemoval");
        while(restrictions.firstChild){
            restrictions.removeChild(restrictions.firstChild);
        }
        while(removal.firstChild){
            removal.removeChild(removal.firstChild);
        }
        let userRestrictionsArray = userRestrictionsState;
        for(let i = 0; i < userRestrictionsArray.length; i++){
            var el = document.createElement("li");
            el.textContent = userRestrictionsArray[i];
            var remove = document.createElement("button");
            remove.textContent = "\xD7";
            remove.className = "removal-button";
            remove.onclick = function(){
                removeUserRestriction(userRestrictionsArray[i]);
            };
            removal.appendChild(remove);
            restrictions.appendChild(el);
        }
    }

    const removeUserRestriction = (child) => {
        let tempState = [...trackState];
        tempState.splice(tempState.indexOf(child), 1);
        trackState = tempState;
        //TODO set userdata to trackState
        setUserRestrictionsState(trackState);
    }

    const setUserRestrictions = () => {
        //TODO set userRestrictionsArray to user data
        //Integrate here, this will only trigger on initial run through
        let userRestrictionsArray = [];
        trackState = userRestrictionsArray;
        setUserRestrictionsState(userRestrictionsArray);
    }

    const addUserRestrictions = () =>{
        let userRestrictionsArray = [...userRestrictionsState];
        let tempRestriction = document.getElementById("allergen").value;
        if(!userRestrictionsArray.includes(tempRestriction)){
            userRestrictionsArray.push(tempRestriction);
            trackState = userRestrictionsArray;
            //Sort if have time
            //Then push array to database
            //TODO push new restriction to user data
            setUserRestrictionsState(userRestrictionsArray);
        }
    }


    useEffect(() => {
        if(firstRun){
            firstRun = false;
            setUserRestrictions();
        }
        if(user !== null){
            getRestrictions();
            getUserRestrictions();

        }else{
            navigate("/");
        }
        console.log(userRestrictionsState);
    });

    if(user === null){
        return <div>
            </div>;
    }

    return (
        <div className ="flex-container">
            <div className="sidenav flex-child-nav">
                <text className = "forgotPasswordButton" onClick={scrollAllergens}>Allergens/Restrictions</text>
                <text className = "forgotPasswordButton" onClick={scrollFavorites}>Upcoming Favorites</text>
                <text className = "forgotPasswordButton" onClick={scrollSettings}>Account Settings</text>
            </div>
            <div className="container flex-child" >
                <div>
                    <h2>Welcome {user.displayName}!</h2>
                </div>
                <div className = "userBox labelBox" ref = {allergensRef}>
                    <h3>Allergens/Restrictions</h3>
                </div>
                <div className = "userBoxDescription">
                    <h4>Add a restriction</h4>
                    <div className = "flex-container">
                        <div className = "flex-space"></div>
                        <select id="allergen" className = "flex-select "></select>
                        <div className="flex-space"></div>
                        <button onClick={addUserRestrictions} className = "flex-button  restrictions-button">Add Restriction</button>
                        <div className = "flex-space"></div>
                    </div>
                    <br></br><br></br>
                <div className="separate"></div>
                    <h4>Current Restrictions</h4>
                    <div className = "flex-container">
                    <ul id="userRestrictions" className = "flex-list"></ul>
                    <ul id="userRestrictionsRemoval" className = "flex-remove"></ul>
                    </div>
                </div>
                <br></br>
                <div className = "userBox labelBox" ref = {favoritesRef}>
                    <h3>Upcoming Favorites</h3>
                </div>
                <div className= "userBoxDescription">
                </div>
                <br></br>
                <div className = "userBox labelBox" ref = {settingsRef}>
                    <h3>Settings</h3>
                </div>
                <div className = "userBoxDescription">
                    <div className = "innerBox">
                        <button onClick = {handleDropdown} className="dropdown-btn">Change Password
                            <i className="fa fa-caret-down"></i>
                        </button>

                        <div className="dropdown-container">
                            <div className = "separate"></div>
                            <button className = "" onClick={sendPasswordReset} >Send Password Reset Link</button>
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
