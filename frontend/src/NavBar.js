import { Link, useMatch, useResolvedPath} from "react-router-dom"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthenticationContext } from './App';
import { useContext, shouldComponentUpdate } from "react";
import { signOut } from "firebase/auth";

let loggedIn = false;
let userName = null;





  

export default function Navbar(){
    
    const [logInOrUser, setLogInOrUser] = useState("Login");
    const [logInOrUserLink, setLogInOrUserLink] = useState("/login");
    const [signUpOrLogOut, setSignUpOrLogOut] = useState("Sign Up");
    const [signUpOrLogOutLink, setSignUpOrLogOutLink] = useState("/signup");
    shouldComponentUpdate = (nextProps, nextState) => {
        return signUpOrLogOutLink != nextState.value;
    }
    const changeLogIn = () => {
        if(loggedIn){
            setLogInOrUser(userName);
            setLogInOrUserLink("/userPage");
            setSignUpOrLogOut("Log Out");
            setSignUpOrLogOutLink("/")
            
        }else{
            setLogInOrUser("Login");
            setLogInOrUserLink("/login");
            setSignUpOrLogOut("Sign Up");
            setSignUpOrLogOutLink("/signup");
        }
    }
    
    const auth = useContext(AuthenticationContext);
    const monitorAuthState = async () => {
        onAuthStateChanged(auth, user => {
            if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            if(user.displayName != null){
                userName = user.displayName;
                if(userName.length > 10){
                    userName = userName.substring(0,10) + "..."
                }
                loggedIn = true;
            }
            // ...
            } else {
            // User is signed out
            userName = null;
            loggedIn = false;
            }
            changeLogIn();
        });
      }
      monitorAuthState();

    const logout = async() => {
        if(loggedIn)
            signOut(auth);
    }
    return (
        <nav className="navbar navbar-expand-md nav bg-maroon navbar-dark">
        <div className="container-fluid">
            <Link to="/" className="navbar-brand site-title">UMass Meal Builder</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul>
                    <CustomLink to = "/analysis">Analysis</CustomLink>
                    <CustomLink to = "/dininghalls">Dining Halls</CustomLink>
                    <CustomLink to = "/favorites">Favorites</CustomLink>
                    <CustomLink to = {logInOrUserLink}>{logInOrUser}</CustomLink>
                    <CustomLink to = {signUpOrLogOutLink} onClick = {logout}>{signUpOrLogOut}</CustomLink>
                </ul>
            </div>
        </div>
    </nav>
    )
}
function CustomLink({ to,children, ...props}){
 const resolvedPath = useResolvedPath(to)
 const isActive = useMatch({path: resolvedPath.pathname, end:true})
    return(
        <li className = {isActive ? "active":""}>
            <Link to = {to}{...props}>
                 {children}
            </Link>
        </li>
    )
}
