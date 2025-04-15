import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SortRush from "./pages/SortRush";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import SortShiftBubble from "./pages/SortShiftBubble/SortShiftBubble";
import SortShiftSelection from "./pages/SortShiftSelection/SortShiftSelection";
import SortShiftInsertion from "./pages/SortShiftInsertion/SortShiftInsertion";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sort" element={<SortRush />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path = "/sortshiftbubble" element={<SortShiftBubble />} />
        <Route path = "/sortshiftselection" element={<SortShiftSelection />} />
        <Route path = "/sortshiftinsertion" element={<SortShiftInsertion />} />
      </Routes>
    </Router>
  );
}

export default App;
