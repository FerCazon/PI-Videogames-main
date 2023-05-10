import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./detail.css";

function Detail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const history = useHistory();

  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const handleBackClick = () => {
    history.goBack();
  };

  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setGame(data);

        // veo si el genero existe en el array
        if (data.genres && Array.isArray(data.genres)) {
          setGenres(data.genres);
          console.log(data.genres);
        } else {
          setGenres([]);
        }

        // veo si plataformas existen enel array
        if (data.platforms && Array.isArray(data.platforms)) {
          setPlatforms(data.platforms);
        } else {
          setPlatforms([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  }

  return (
    <div className="detail">
      {game ? (
        <>
          <div
            id="arrowAnim"
            onClick={handleBackClick}
          >
            <div class="arrowSliding">
              <div class="arrow"></div>
            </div>
            <div class="arrowSliding delay1">
              <div class="arrow"></div>
            </div>
            <div class="arrowSliding delay2">
              <div class="arrow"></div>
            </div>
            <div class="arrowSliding delay3">
              <div class="arrow"></div>
            </div>
          </div>
          <div className="game-detail">
            <h2>{game.name}</h2>
            <img
              src={game.background_image || game.image}
              alt={game.name}
            />
            <p>ID: {game.gameId || game.id}</p>
            <p>
              Release Date:{" "}
              {game.released
                ? formatDate(game.released)
                : game.releaseDate
                ? formatDate(game.releaseDate)
                : "N/A"}
            </p>

            <p>
              Platforms:{" "}
              {platforms
                .map((platform) => platform.name || platform)
                .join(", ")}
            </p>
            <p>
              Description:{" "}
              {game.description && (
                <div
                  dangerouslySetInnerHTML={{ __html: game.description }}
                ></div>
              )}
            </p>
            <p>
              Genres: {genres.map((genre) => genre.name || genre).join(", ")}
            </p>
            {game.createdAt && (
              <button
                onClick={() =>
                  history.push(`/update/${game.gameId || game.id}`)
                }
              >
                Update
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Detail;
