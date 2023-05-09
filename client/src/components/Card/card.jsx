import React, { useState, useEffect } from "react";
import "./card.css";
import { Link } from "react-router-dom";

function Card({ games }) {
  const genres = games.genres || [];

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
