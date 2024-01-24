import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Button } from "../styles";



function TeamList() {
  const [teams, setTeams] = useState([]);
  
  useEffect(() => {
    fetch("/api/teams")
    .then((r) => r.json())
    .then(setTeams);
  }, []);
  
  const deleteTeam = (teamId) => {
    fetch(`/api/teams/${teamId}`, {
      method: "DELETE",
    })
    .then(() => {
      setTeams((deletedTeams) => deletedTeams.filter((team) => team.id !== teamId));
    })
  };
  
  return (
    <div className="Wrapper">
      <h1 className="Logo">PokeDecks</h1>
    <div>
      {teams.length > 0 ? (
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              {team.name}
              <button onClick={() => deleteTeam(team.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <h2>No Teams Found</h2>
        </>
      )}
      <Button as={Link} to="/create-team">
        Build a New Team
      </Button>
    </div>
    </div>
  );
}
// still needs a logout button
export default TeamList;