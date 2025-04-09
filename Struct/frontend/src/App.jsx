import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SortRush from "./pages/SortRush";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import SortShift from "./pages/SortShift/SortShift";
import SortShiftSelection from "./pages/SortShiftSelection/SortShiftSelection";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sort" element={<SortRush />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path = "/sortshift" element={<SortShift />} />
        <Route path = "sortshiftselection" element={<SortShiftSelection/>} />
      </Routes>
    </Router>
  );
}

export default App;
