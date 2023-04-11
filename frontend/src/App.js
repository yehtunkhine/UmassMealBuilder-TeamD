import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';
import Login from './pages/Login'
import Signup from './pages/Signup'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseInit from "./pages/firebaseInit";



//Initialize firebase
const app = firebaseInit();

const auth = getAuth(app);



function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <h1>Hello World!</h1>
      <Login/>

    </div>
  );
}


export default App;
