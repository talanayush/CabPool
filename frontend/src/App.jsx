import { useState } from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from './components/Navbar'
import Tickets from './components/Tickets';
function App() {


  return (

    

    <Router>
      <Navbar />
      <Tickets />
    </Router>
       
  );
}

export default App
