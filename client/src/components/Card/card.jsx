import React, { useState, useEffect } from "react";
import "./card.css";
import { Link } from "react-router-dom";

function Card({ games, updateGameGenres }) {
  const [genres, setGenres] = useState(games.genres || []);

  useEffect(() => {
    const id = games.id || games.gameId;
  
    if (!games.genres && id) {
      const url = `http://localhost:3001/games/${id}`;
  
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.genres && data.genres.length > 0) {
            setGenres(data.genres);
            updateGameGenres(id, data.genres);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [games.id, games.gameId, games.genres, updateGameGenres]);
  

  const genreNames = genres.map((genre) => genre.name || genre).join(", ");

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
