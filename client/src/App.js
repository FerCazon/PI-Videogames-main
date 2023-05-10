import { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import Home from "./views/home/home";
import Detail from './views/detail/detail';
import Create from './views/create/create';
import Landing from './views/landing/landing';
import Update from "./views/update/update";



function App() { 

  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Home} />
          <Route path="/home/:id" component={Detail} />
          <Route path="/create" component={Create} />
          <Route path="/update/:id" component={Update} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
