
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from './pages/home/Home';
import Login from './pages/login/Login'
import Room from './pages/room/Room'

function App() {

  let logged_in = localStorage.getItem('token') ? true : false

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={ logged_in ? <Home /> : <Navigate replace to={"/login"} />} /> 
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/rooms/:id" element={<Room />} />
        <Route exact path="/rooms" element={<Navigate replace to={"/"} />} />
      </Routes>  
    </BrowserRouter>
  ) 
}

export default App;
