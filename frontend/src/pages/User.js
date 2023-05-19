import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthenticationContext } from './../App';
import { useRef } from 'react';
import './loginstyles.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
//import { EmailAuthCredential, updatePassword } from 'firebase/auth';

let firstRun = true;//Tracks first run through in order to only set the restrictions on the first run
let trackState = [];//Global trackState in order to make it so when we setState it properly refreshes

export default function User(){
    let auth = useContext(AuthenticationContext);//Firebase authentication
    let user = auth.currentUser;//Firebase user
    const allergensRef = useRef(null);
    const settingsRef = useRef(null);
    const favoritesRef = useRef(null);
    const navigate = useNavigate();
    const [userRestrictionsState, setUserRestrictionsState] = useState(trackState);//Tracks restrictions

    

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
    handleDropdown();//Calls it so it will add the listener

    //Gets restrictions to display in dropdown
    const getRestrictions = () =>{
        //TODO If you want you can make these set to whatever's in the databse
        let restrictions = [" ", "Milk", "Peanuts", "Shellfish", "Eggs", "Gluten", "Tree Nuts", "Fish", "Soy", "Corn", "Sesame", 
        "Vegetarian", "Plant Based", "Local", "Whole Grain", "Halal", "Antibiotic Free", "Sustainable"];
        let selection = document.getElementById("allergen");
        for(let i = selection.length-1; i >= 0; i--){//Clears all elements in list
            selection.remove(i);
        }
        for(let i = 0; i < restrictions.length; i++){//Readds all elements
            var el = document.createElement("option");
            el.textContent = restrictions[i];
            el.value = restrictions[i];
            selection.appendChild(el);
        }
    }  

    //Sets all user restrictions in the list
    const getUserRestrictions = () =>{
        let restrictions = document.getElementById("userRestrictions");
        let removal = document.getElementById("userRestrictionsRemoval");
        while(restrictions.firstChild){//Removes restrictions
            restrictions.removeChild(restrictions.firstChild);
        }
        while(removal.firstChild){//Removes x boxes
            removal.removeChild(removal.firstChild);
        }
        let userRestrictionsArray = userRestrictionsState;
        for(let i = 0; i < userRestrictionsArray.length; i++){
            var el = document.createElement("li");//Sets the restriction
            el.textContent = userRestrictionsArray[i];
            var remove = document.createElement("button");//Sets the x boxes
            remove.innerHTML = "X";
            remove.className= "removal-button"
            remove.onclick = function(){
                removeUserRestriction(userRestrictionsArray[i]);
            };
            if(i % 2 === 1){
                el.className = "color-white user-preference";
            }else{
                el.className = "color-gray user-preference";
            }
            removal.appendChild(remove);
            restrictions.appendChild(el);
        }
    }

    //For when we delete a restriction
    const removeUserRestriction = (child) => {
        let tempState = [...trackState];
        tempState.splice(tempState.indexOf(child), 1);
        trackState = tempState;
        //TODO set userdata to trackState
        setUserRestrictionsState(trackState); 
    }

    //The initial call in order to set the lists
    const setUserRestrictions = () => {
        //TODO set userRestrictionsArray to user data
        //Integrate here, this will only trigger on initial run through
        let userRestrictionsArray = [];
        userRestrictionsArray.push("Sample Restriction");
        userRestrictionsArray.push("Sample Restriction2");
        userRestrictionsArray.push("Sample");
        trackState = userRestrictionsArray;
        setUserRestrictionsState(userRestrictionsArray);
    }

    //When we want to add a restriction
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
        if(firstRun){//So we only set on the first run
            firstRun = false;
            setUserRestrictions();
        }
        if(user !== null){//Will then set the lists
            getRestrictions();
            getUserRestrictions();
            
        }else{//in case there is no user redirects
            navigate("/");
        }
    });
    if(user === null){//So we don't try to call anything that needs ids
        return <div>   
            </div>;
    }
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
                <h3>Allergens/Restrictions</h3>
            </div>
            <div class = "userBoxDescription">
                <h4>Add a restriction</h4>
                <div class = "flex-container">
                    <div class = "flex-space"></div>
                    <select id="allergen" class = "flex-select "></select>
                    <div class="flex-space"></div>
                    <button onClick={addUserRestrictions} class = "flex-button  restrictions-button">Add Restriction</button>
                    <div class = "flex-space"></div>
                </div>
                <br></br><br></br>
            <div class="separate"></div>
                <h4>Current Restrictions</h4>
                <div class = "flex-container">
                    <ul id="userRestrictions" class = "flex-list"></ul>
                    <ul id="userRestrictionsRemoval" class = "flex-remove"></ul>
                </div>
            </div>
            <br></br>
            <div class = "userBox labelBox" ref = {favoritesRef}>
                <h3>Upcoming Favorites</h3>
            </div>
            <div class= "userBoxDescription">
            </div>
            <br></br>
            <div class = "userBox labelBox" ref = {settingsRef}>
                <h3>Settings</h3>
            </div>
            <div class = "userBoxDescription">
                <div class = "innerBox">
                    <button onClick = {handleDropdown} class="dropdown-btn">Change Password 
                        <i class="fa fa-caret-down"></i>
                    </button>
                    
                    <div class="dropdown-container">
                        <div class = "separate"></div>
                        <button class = "dropdown-inner-button" onClick={sendPasswordReset} >Send Password Reset Link</button>
                    </div>
                </div>
            </div>
        </div>
        <script></script>
    </div>
    );
}