import { useState } from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from './components/Navbar'
import Tickets from './components/Tickets';

import Login from './components/Login';
import Register from './components/Register';
function App() {


  return (

    

    <Router>
      <Navbar />
      <Tickets />
      <Login />
      <Register />
    </Router>
       
  );
}

export default App
