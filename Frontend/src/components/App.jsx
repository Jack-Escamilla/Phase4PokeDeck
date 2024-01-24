import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NavBar from "./NavBar";
import Login from "/src/pages/Login";
import MainPage from "/src/pages/MainPage";
import CreateTeam from "/src/pages/CreateTeam";
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
    <Routes>
      <Route path="/" element={<Login onLogin={setUser}/>}/>
      <Route path="/main-page" element={<MainPage/>}/>
      <Route path="/create-team" element={<CreateTeam/>}/>
      {/* <Route path="/save-team" element={<SaveTeam/>}/> */}
    </Routes>
  </BrowserRouter>
  </div>
  </>
)
}
export default App;