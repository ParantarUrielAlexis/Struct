import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Module from "./pages/Module";
import TypeTest from "./pages/TypeTest";
import SortShift from "./pages/SortShift/SortShift"; // Import SortShift component
import SortShiftSelection from "./pages/SortShiftSelection/SortShiftSelection"; // Import SortShiftSelection component
import SortShiftBubble from "./pages/SortShiftBubble/SortShiftBubble"; // Import SortShiftBubble component
import SortShiftInsertion from "./pages/SortShiftInsertion/SortShiftInsertion"; // Import SortShiftInsertion component
const AppLayout = () => {
  const location = useLocation();

  // State to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Restore login state from localStorage on page load
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Function to update login state
  const updateLoginState = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem("username", username); // Save username to localStorage
  };

  // Define routes that should only show the Header
  const headerOnlyRoutes = [
    "/type-test",
    "/sortshift",
    "sortshiftselection",
    "/sortshiftbubble",
    "/sortshiftinsertion",
  ];

  // Check if the current route is in the header-only routes
  const isHeaderOnlyRoute = headerOnlyRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {/* Conditionally render Sidebar */}
      {!isHeaderOnlyRoute && isLoggedIn && <Sidebar isLoggedIn={isLoggedIn} />}
      <div
        className={`flex-1 flex flex-col ${
          !isHeaderOnlyRoute && isLoggedIn ? "ml-14" : ""
        }`}
      >
        {/* Conditionally render Navbar or Header */}
        {isHeaderOnlyRoute ? (
          <Header />
        ) : (
          <Navbar
            isLoggedIn={isLoggedIn}
            username={username}
            setIsLoggedIn={setIsLoggedIn}
            setUsername={setUsername}
          />
        )}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={<Login updateLoginState={updateLoginState} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/module" element={<Module />} />
            <Route path="/type-test" element={<TypeTest />} />
            <Route path="/sortshift" element={<SortShift />} />
            <Route
              path="/sortshiftselection"
              element={<SortShiftSelection />}
            />
            <Route path="/sortshiftbubble" element={<SortShiftBubble />} />
            <Route
              path="/sortshiftinsertion"
              element={<SortShiftInsertion />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
