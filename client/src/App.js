import { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import Home from "./views/home/home";
import Detail from './views/detail/detail';
import Create from './views/create/create';
import Landing from './views/landing/landing';

import soundfile from "./assets/backgroundmp3.mp3";

function App() {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    if (hasUserInteracted) {
      const audio = new Audio(soundfile);
      audio.play();
    }
  }, [hasUserInteracted]);

  const handleUserInteraction = () => {
    setHasUserInteracted(true);
    document.removeEventListener("mousedown", handleUserInteraction);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleUserInteraction);
    return () => {
      document.removeEventListener("mousedown", handleUserInteraction);
    };
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Home} />
          <Route path="/home/:id" component={Detail} />
          <Route path="/create" component={Create} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
