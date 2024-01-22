import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

function TeamList() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("/teams")
      .then((r) => r.json())
      .then(setTeams);
  }, []);

  return (
    <Wrapper>
      {teams.length > 0 ? (
        teams.map((team) => (
          <Team key={team.id}>
            <Box>
              <h2>{team.title}</h2>
              <ReactMarkdown>{team.pokemon.name}</ReactMarkdown>
            </Box>
          </Team>
        ))
      ) : (
        <>
          <h2>No Teams Found</h2>
          <Button as={Link} to="/new">
            Build a New Team
          </Button>
        </>
      )}
    </Wrapper>
  );
}
//still needs a logout button
export default main-page.js;
