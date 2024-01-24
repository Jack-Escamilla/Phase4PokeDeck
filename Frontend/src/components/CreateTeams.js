
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTeams = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/pokemons')
      .then(response => {
        setPokemonList(response.data);
      })
      .catch(error => {
        console.error('Error fetching Pokémon:', error);
      });
  }, []); 

  return (
    <div>
      <h1>Create Teams Page</h1>
      <ul>
        {pokemonList.map(pokemon => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CreateTeams;
