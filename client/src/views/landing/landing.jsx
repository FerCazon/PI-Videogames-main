import React from 'react';
import { Link } from 'react-router-dom';
import "./landing.css"

function Landing() {
  return (
    <div className="landing">
      <h1>Welcome to the Games Realm</h1>
      <Link to="/home">
      <button class="btn btn-background-slide"> Click me <div class="btn-background-slide--green btn-background-slide-bg"></div> </button>
      </Link>
    </div>
  );
}

export default Landing;