import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import  "./create.css"
import InputField from './components/inputfield';
import SelectField from './components/selectfield';
import { validate } from './components/validate';

function Create() {
  
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
  
    // convertir plataformas al array
    const updatedInput = {
      ...input,
      platforms: input.platforms.split(',').map((platform) => platform.trim()),
    };
  
    try {
      const response = await axios.post('http://localhost:3001/create', updatedInput, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  return (
    <div className="create">
      <p>Estas en el create</p>
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

        {error.name ? null : <button type='submit'>Create</button>}
      </form>
    </div>
  );
}

export default Create;