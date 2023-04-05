import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';
import Login from './pages/Login'
import Signup from './pages/Signup'


function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <h1>Hello World!</h1>
      <Signup/>
    </div>
  );
}

export default App;
