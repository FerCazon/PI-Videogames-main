import React, { useState, useEffect } from "react";
import "./card.css";
import {Link} from "react-router-dom"

function Card({ games, updateGameGenres }) {
  const [genres, setGenres] = useState(games.genres || []);

  useEffect(() => {
    fetch(`http://localhost:3001/genres/${games.id || games.gameId}?created=${games.created || false}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setGenres(data);
          updateGameGenres(games.id || games.gameId, data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [games.id, games.gameId, games.genres, updateGameGenres]);
  

  const genreNames = genres.map((genre) => genre.name).join(', ');

  return (
    <Link to={`/home/${games.id || games.gameId}`}>
      <div className="card-container">
        <h2>{games.name}</h2>
        <img src={games.image} alt={games.name} />
        {genreNames && <p>Genres: {genreNames}</p>}
        <p>Rating: {games.rating}</p>
      </div>
    </Link>
  );
}

export default Card;