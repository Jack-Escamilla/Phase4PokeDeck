import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTeams() {
  const [pokemonList, setPokemonList] = useState([]);
  const [team, setTeam] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const navigate = useNavigate();
  const [pokemonSprites, setPokemonSprites] = useState([]);
  const [hoveredPokemon, setHoveredPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);

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

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (hoveredPokemon) {
        const url = `https://pokeapi.co/api/v2/pokemon/${hoveredPokemon.id}`;
        const response = await fetch(url);
        const data = await response.json();
        setPokemonDetails({
          typing: data.types.map(type => type.type.name).join(', '),
          stats: data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ')
        });
      }
    };

    fetchPokemonDetails();
  }, [hoveredPokemon]);

  const handlePokemonClick = (pokemon) => {
    if (team.length < 6 && !team.some(p => p.id === pokemon.id)) {
      setTeam(prevTeam => [...prevTeam, pokemon]);
    }
  };

  const handleRemoveFromTeam = (pokemonId) => {
    setTeam(prevTeam => prevTeam.filter(p => p.id !== pokemonId));
  };

  const handleSubmitTeam = (e) => {
    e.preventDefault();
    if (newTeamName && team.length > 0 && team.length <= 6) {
      const data = {
        team_name: newTeamName,
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

  const handleMouseOver = (pokemon) => {
    setHoveredPokemon(pokemon);
  };

  const handleMouseOut = () => {
    setHoveredPokemon(null);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Create Teams Page</h1>
      <div>
        <label>
          New Team Name:
          <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '300px', marginRight: '20px', marginTop: hoveredPokemon ? '0' : '-300px' }}>
          {hoveredPokemon && (
            <div>
              <h2>{hoveredPokemon.name}</h2>
              <img src={hoveredPokemon.image} alt={hoveredPokemon.name} />
              {pokemonDetails && (
                <div>
                  <p><strong>Typing:</strong> {pokemonDetails.typing}</p>
                  <p><strong>Stats:</strong> {pokemonDetails.stats}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {pokemonSprites.map((pokemon) => (
            <div
              key={pokemon.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transform: hoveredPokemon === pokemon ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
              onClick={() => handlePokemonClick(pokemon)}
              onMouseOver={() => handleMouseOver(pokemon)}
              onMouseOut={handleMouseOut}
            >
              <img className="card-image" src={pokemon.image} alt={pokemon.name} style={{ marginBottom: '5px' }} />
              <div style={{ color: hoveredPokemon === pokemon ? 'pink' : 'white' }}>{pokemon.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', left: '-450px', top: '-100px', width: '250px'}}>
        <h2>Selected Team:</h2>
        <ul>
          {team.map(pokemon => (
            <li key={pokemon.id}>
              <img src={pokemon.image} alt={pokemon.name} style={{ marginRight: '5px', marginBottom: '-5px', width: '30px', height: '30px' }} />
              {pokemon.name}
              <span style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => handleRemoveFromTeam(pokemon.id)}>🗑️</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div >
          <form onSubmit={handleSubmitTeam} style={{ textAlign: 'center' }}>
            <button type="submit">Save Team</button>
          </form>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate("/main-page")}>Home</button>
        </div>
      </div>
    </div>
  );
}

export default CreateTeams;
