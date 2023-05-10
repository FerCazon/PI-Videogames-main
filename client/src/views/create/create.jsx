import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./create.css";
import InputField from "./components/inputfield";
import SelectField from "./components/selectfield";
import { validate } from "./components/validate";
import { useHistory } from "react-router-dom";

function Create() {
  const history = useHistory();
  const [input, setInput] = useState({
    name: "",
    description: "",
    platforms: "",
    image: "",
    releaseDate: "",
    rating: "",
    genres: [],
  });

  const [error, setError] = useState({
    name: "",
    description: "",
    platforms: "required",
    image: "",
    releaseDate: "",
    rating: "",
  });

  const [fetchedGenres, setFetchedGenres] = useState([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  async function fetchGenres() {
    try {
      const response = await axios.get("http://localhost:3001/genres");
      setFetchedGenres(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });

    validate(input, setError);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !input.name ||
      !input.description ||
      !input.platforms ||
      !input.image ||
      !input.releaseDate ||
      !input.rating ||
      !input.genres.length
    ) {
      alert("All fields must be completed.");
      return;
    }
    // por cuestiones de compatibilidad me convierto el platforms en array
    const updatedInput = {
      ...input,
      platforms: input.platforms.split(",").map((platform) => platform.trim()),
      genres: input.genres
        .map((genreId) => {
          const genreObj = fetchedGenres.find(
            (genre) => genre.id.toString() === genreId
          );
          return genreObj ? genreObj.name : null;
        })
        .filter((genreName) => genreName !== null),
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/create",
        updatedInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("Character created successfully!");
      history.push("/home");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 409) {
        alert("Game with this name already exists");
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="create">
      <form
        className="form-style-9"
        onSubmit={handleSubmit}
      >
        <InputField
          label="Nombre"
          name="name"
          value={input.name}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <InputField
          label="Descripcion"
          name="description"
          value={input.description}
          onChange={handleChange}
          placeholder="Descripcion"
        />
        <InputField
          label="Plataforma"
          name="platforms"
          value={input.platforms}
          onChange={handleChange}
          placeholder="Plataforma"
        />
        <InputField
          label="Imagen"
          name="image"
          value={input.image}
          onChange={handleChange}
          placeholder="Imagen"
        />
        <InputField
          label="Fecha de lanzamiento"
          name="releaseDate"
          value={input.releaseDate}
          onChange={handleChange}
          placeholder="Fecha de lanzamiento"
        />
        <InputField
          label="Rating"
          name="rating"
          value={input.rating}
          onChange={handleChange}
          placeholder="Rating"
        />
        <SelectField
          label="Géneros"
          name="genres"
          value={input.genres}
          options={fetchedGenres.map((genre) => ({
            value: genre.id,
            label: genre.name,
          }))}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setInput({ ...input, genres: selectedOptions });
          }}
        />
        {error.name ? null : <button type="submit">Create</button>}
      </form>
    </div>
  );
}

export default Create;
