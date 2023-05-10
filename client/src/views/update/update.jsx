import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import InputField from './components/inputfield';
import SelectField from './components/selectfield';
import { validate } from './components/validate';

function Update() {
  const history = useHistory();
  const { id } = useParams();
  const [input, setInput] = useState({
    name: '',
    description: '',
    platforms: '',
    image: '',
    releaseDate: '',
    rating: '',
    genres: [],
  });

  const [error, setError] = useState({
    name: '',
    description: '',
    platforms: 'required',
    image: '',
    releaseDate: '',
    rating: '',
  });

  const [fetchedGenres, setFetchedGenres] = useState([]);

 

  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setInput({
          name: data.name,
          description: data.description,
          platforms: data.platforms.join(', '),
          image: data.background_image || data.image,
          releaseDate: data.released,
          rating: data.rating,
          genres: data.genres.map(genre => genre.id.toString()),
        });
        fetchGenres(); 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetchGenres();
  }, []);

  async function fetchGenres() {
    try {
      const response = await axios.get('http://localhost:3001/genres');
      setFetchedGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
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
    if (!input.name || !input.description || !input.platforms || !input.image || !input.releaseDate || !input.rating || !input.genres.length) {
      alert('All fields must be completed.');
      return;
    }

    const updatedInput = {
      ...input,
      platforms: input.platforms.split(',').map((platform) => platform.trim()),
      genres: input.genres
        .map((genreId) => {
          const genreObj = fetchedGenres.find((genre) => genre.id.toString() === genreId);
          return genreObj ? genreObj.name : null;
        })
        .filter((genreName) => genreName !== null),
    };
console.log("id:",id)
    try {
      const response = await axios.put(`http://localhost:3001/games/${id}`, updatedInput, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      alert('Game updated successfully!');
      history.push('/home');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 409) {
        alert('Game with this name already exists');
      } else {
        alert('An unknown error occurred');
      }
    }
  }
  return (
    <div className="update">
      <p>Update Game Form</p>
      <form onSubmit={handleSubmit}>
        <InputField label="Nombre" name="name" value={input.name} onChange={handleChange} />
        <InputField label="Descripcion" name="description" value={input.description} onChange={handleChange} />
        <InputField label="Plataforma" name="platforms" value={input.platforms} onChange={handleChange} />
        <InputField label="Imagen" name="image" value={input.image} onChange={handleChange} />
        <InputField label="Fecha de lanzamiento" name="releaseDate" value={input.releaseDate} onChange={handleChange} />
        <InputField label="Rating" name="rating" value={input.rating} onChange={handleChange} />
        <SelectField
          label="Géneros"
          name="genres"
          value={input.genres}
          options={fetchedGenres.map((genre) => ({ value: genre.id, label: genre.name }))}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setInput({ ...input, genres: selectedOptions });
          }}
        />

        {error.name ? null : <button type='submit'>Update</button>}
      </form>
    </div>
  );
}

export default Update;
