import './App.css';
import NavBar from './NavBar';
import Analysis from "./pages/Analysis"
import Favorites from "./pages/Favorites"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DiningHalls from "./pages/DiningHalls"
import Home from "./pages/Home"
import Worcester from "./diningHalls/Worcester"
import Hampshire from "./diningHalls/Hampshire"
import Franklin from "./diningHalls/Franklin"
import Berkshire from "./diningHalls/Franklin"
import User from "./pages/User"
import {Route, Routes} from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseInit from "./pages/firebaseInit";
import { createContext, setState, toggleIsActive } from 'react';//To pass getAuth for user data



//Initialize firebase
const app = firebaseInit();
const auth = getAuth(app);
//type User = FirebaseAuthTypes.User | null;

/**
 * Contexts
 */
//export const UserContext = createContext<User>(null);
export const FirebaseContext = createContext(app);
export const AuthenticationContext = createContext(auth);

let loggedIn = false;
let uid;


const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
      if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      uid = user.uid;
      loggedIn = true;
      
      // ...
      } else {
      // User is signed out
      // ...
      const uid = null;
      loggedIn = false;
      //this.setState({ log: loggedIn });
      }
  });
}
monitorAuthState();


function App(){
  

  return (
    <>
    <NavBar/>
      <div className = "container">
          <Routes>
              <Route path ="/" element={<Home />} />
              <Route path ="/analysis" element={<Analysis />} />
              <Route path ="/dininghalls" element={<DiningHalls />} />
              <Route path ="/favorites" element={<Favorites />} />
              <Route path ="/login" element={<Login />} />
              <Route path ="/signup" element={<Signup />} />
              <Route path ="/worcester" element={<Worcester />} />
              <Route path ="/hampshire" element={<Hampshire />} />
              <Route path ="/franklin" element={<Franklin />} />
              <Route path ="/berkshire" element={<Berkshire />} />
              <Route path = "/userPage" element = {<User />} />
          </Routes>
      </div>
    </>
    );
}
export default App