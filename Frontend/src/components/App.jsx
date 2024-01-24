import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "/src/pages/Login";
import MainPage from "/src/pages/MainPage";
import CreateTeam from "/src/pages/CreateTeam";
import NavBar from "./Navbar";
import EditTeam from "/src/pages/EditTeam"

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  return (
    <>
      <div>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Login onLogin={setUser} />} />
            <Route path="/main-page" element={<MainPage />} />
            <Route path="/create-team" element={<CreateTeam />} />
            <Route path="/edit-team/:teamId" element={<EditTeam />} /> 
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;