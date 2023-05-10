import React from "react";
import Card from "../Card/card";
import "./cards.css";

function Cards({ allGames, updateGameGenres }) {
  const gamesList = allGames;
  return (
    <div className="card-list">
      {gamesList?.map((games) => (
        <Card
          key={games.id || games.gameId}
          games={games}
          updateGameGenres={updateGameGenres}
        />
      ))}
    </div>
  );
}

export default Cards;
