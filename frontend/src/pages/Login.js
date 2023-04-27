import React from "react";
import { useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './loginstyles.css';
import { useContext } from 'react';
import { AuthenticationContext } from './../App';
//import { useEffect} from 'react';
import { GoogleButton } from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



const Login = () => {
    //Initialize firebase
    const auth = useContext(AuthenticationContext);
    const provider = new GoogleAuthProvider();

    const navigate = useNavigate();

    const txtEmail = useRef(null);
    const txtPassword = useRef(null);

    //const [user, setUser] = useState();
    /*useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            //setUser(user);
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            //const uid = user.uid;
          } 
        });
      }, []);*/

    const handleGoogleSignIn = async () => {
        console.log('signing in');
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            /*const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            console.log('user', user);
            console.log('token', token);
            console.log('credential', credential);*/
            navigate("/");
          }).catch((error) => {
            /*// Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);*/
            alert(error);
            console.log(error);
          });
          
    }
    

    const login = async() => {
        //Get text values
        const loginEmail = txtEmail.current.value;
        const loginPassword = txtPassword.current.value;

        //Try signup
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((userCredential) => {
                // Signed in 
                //const user = userCredential.user;
              });
            navigate("/")
            
        }
        //If error, then probably username/password invalid.
        catch(error) {
            console.log(`There was an error: ${error}`);
            alert(error);
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

    const resetPassword = () => {
      navigate("/resetPasswordEmail")
    }

    return (
      <div class = "container">
        <div class = "outerBox" >
            <text class = "labelText">Email:</text>
            <input class = "inputText" ref = {txtEmail} type = "text" id = "username" name = "emailInput" placeholder="Email"/>

            <text class =  "labelText">Password:</text>
            <input class = "inputText" ref = {txtPassword} id = "password" name = "passwordInput" placeholder="Password" type = "password"/>
            <input type="checkbox" onClick = {hidePassword}/>
            <text>   Show Password</text>
            
            <br></br>
            <div>
                <button class = "button" onClick={login}>Login</button>
            </div>
            <div>
              <text class = "forgotPasswordButton" onClick={resetPassword} >Forgot Password?</text>
            </div>
            <div  class = 'max-w-[240px] m-auto py-4'>
                <GoogleButton className='signUpButton ' onClick={handleGoogleSignIn} />
            </div>
        </div>
      </div>
    );
}
export default Login;

