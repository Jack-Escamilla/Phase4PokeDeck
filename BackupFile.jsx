import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTeams() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [team, setTeam] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const navigate = useNavigate();
  const [pokemonSprites, setPokemonSprites] = useState([]);
  
  useEffect(() => {
    const fetchPokemon = async () => {
      const promises = [];
      for (let i = 1; i <= 20; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
      }
      Promise.all(promises).then((results) => {
        const pokemon = results.map((result) => ({
          id: result.id,
          name: result.name,
          image: result.sprites['front_default'],
        }));
        setPokemonSprites(pokemon);
      });
    };
    
    fetchPokemon();
  }, []);

  useEffect(() => {
    fetch("/api/pokemon")
    .then(r => r.json())
    .then(response => {
      setPokemonList(response);
    })
    .catch(error => {
      console.error('Error fetching Pokémon:', error);
    });
  }, []);
  
  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleAddToTeam = () => {
    if (selectedPokemon && team.length < 6 && !team.some(p => p.id === selectedPokemon.id)) {
      setTeam(prevTeam => [...prevTeam, selectedPokemon]);
      setSelectedPokemon(null);
    }
  };
  
  const handleRemoveFromTeam = (pokemonId) => {
    setTeam(prevTeam => prevTeam.filter(p => p.id !== pokemonId));
  };
  
  const handleSubmitTeam = (e) => {
    e.preventDefault();
    // You may want to add validation before submitting
    if (newTeamName && team.length > 0 && team.length <= 6) {
      const data = {
        team_name: newTeamName,
        // Assuming you want to send an array of selected Pokemon names
        pokemon_names: team.map(pokemon => pokemon.name),
      };
      
      fetch("/api/save-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (response.ok) {
          setNewTeamName('');
          setTeam([]);
          navigate("/main-page");
        } else {
          throw new Error('Team creation failed');
        }
      })
      .catch(error => console.error('Error submitting team:', error));
    }
  };
  
  return (
    <div>
      <h1>Create Teams Page</h1>
      <ul>
        {pokemonSprites.map((pokemon) => (
          <li key={pokemon.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img className="card-image" src={pokemon.image} alt={pokemon.name} style={{ marginRight: '10px' }} />
            <div onClick={() => handlePokemonClick(pokemon)}>{pokemon.name}</div>
          </li>
        ))}
      </ul>
      <div>
        <h2>Selected Pokémon: {selectedPokemon ? selectedPokemon.name : 'None'}</h2>
        <button onClick={handleAddToTeam} disabled={!selectedPokemon || team.length === 6}>
          Add to Team
        </button>
      </div>
      <div>
        <h2>Selected Team:</h2>
        <ul>
          {team.map(pokemon => (
            <li key={pokemon.id}>
              {pokemon.name}
              <button onClick={() => handleRemoveFromTeam(pokemon.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <form onSubmit={handleSubmitTeam}>
          <label>
            New Team Name:
            <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
          </label>
          <button type="submit">Save Team</button>
        </form>
      </div>
      <div>
        <button onClick={() => navigate("/main-page")}>Home</button>
      </div>
    </div>
  );
}

export default CreateTeams;