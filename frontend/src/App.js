import './App.css';
import NavBar from './NavBar';
<<<<<<< HEAD
import Login from './pages/Login'
import Signup from './pages/Signup'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseInit from "./pages/firebaseInit";



//Initialize firebase
const app = firebaseInit();

const auth = getAuth(app);


=======
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
>>>>>>> develop

import {Route, Routes} from "react-router-dom"

function App(){
  return (
<<<<<<< HEAD
    <div className="App">
      <NavBar></NavBar>
      <h1>Hello World!</h1>
      <Login/>

    </div>
  );
=======
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
          </Routes>
      </div>
    </>
    )
>>>>>>> develop
}
export default App


<<<<<<< HEAD

export default App;
=======
>>>>>>> develop
