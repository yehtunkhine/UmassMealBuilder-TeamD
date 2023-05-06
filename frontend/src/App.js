import './App.css';
import NavBar from './NavBar';
import Analysis from "./pages/Analysis"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DiningHalls from "./pages/DiningHalls"
import Home from "./pages/Home"
import Worcester from "./diningHalls/Worcester"
import Hampshire from "./diningHalls/Hampshire"
import Franklin from "./diningHalls/Franklin"
import Berkshire from "./diningHalls/Berkshire"
import FactsTemplate from './components/FactsTemplate';
import User from "./pages/User"
import ResetPasswordEmail from './pages/resetPasswordEmail';
import {Route, Routes} from "react-router-dom"
import { getAuth } from "firebase/auth";
import firebaseInit from "./pages/firebaseInit";
import { createContext } from 'react';//To pass getAuth for user data
import Footer from './components/Footer';



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


function App(){


  return (
    <>
    <NavBar/>
          <Routes>
              <Route path ="/" element={<Home />} />
              <Route path ="/analysis" element={<Analysis />} />
              <Route path ="/dininghalls" element={<DiningHalls />} />
              <Route path ="/login" element={<Login />} />
              <Route path ="/signup" element={<Signup />} />
              <Route path ="/worcester" element={<Worcester />} />
              <Route path ="/hampshire" element={<Hampshire />} />
              <Route path ="/franklin" element={<Franklin />} />
              <Route path ="/berkshire" element={<Berkshire />} />
              <Route path ="/FactsTemplate" element={<FactsTemplate />} />
              <Route path = "/userPage" element = {<User />} />
              <Route path = "/resetPasswordEmail" element = {<ResetPasswordEmail />} />
          </Routes>
      <Footer/>
    </>
    );
}
export default App
