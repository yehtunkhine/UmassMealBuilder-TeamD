import './App.css';
import NavBar from './NavBar';
import Analysis from "./pages/Analysis"
import Favorites from "./pages/Favorites"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DiningHalls from "./pages/DiningHalls"
import Home from "./pages/Home"
import {Route, Routes} from "react-router-dom"

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
          </Routes>
      </div>
    </>
    )
}
export default App


