import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar({ handleChange, handleSubmit, handleSoundButtonClick }) {
  return (
    <div className="navbar">
      <div className="navbar-buttons">
        <Link to="/home">
          <button className="navbar-button">Home</button>
        </Link>
        <Link to="/create">
          <button className="navbar-button">Create Game</button>
        </Link>
      </div>
      <div className="search-box">
        <form onChange={handleChange}>
          <input placeholder="Busqueda" type="search" />
          <button type="submit" onClick={handleSubmit}>
            Buscar
          </button>
        </form>
      </div>
      
      <div className="sound-button">
        <button onClick={handleSoundButtonClick}>
          <i className="gg-loadbar-sound"></i>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
