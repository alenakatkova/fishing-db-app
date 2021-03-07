import React from 'react';
import './App.css';
import Boats from "./Boats";
import Teams from "./Teams";
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import HomePage from "./HomePage";
import FishingSpots from "./FishingSpots";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/boats">
            <Boats />
          </Route>
          <Route exact path="/workers">
            <Boats />
          </Route>
          <Route exact path="/teams">
            <Teams />
          </Route>
          <Route exact path="/fishing-spots">
            <FishingSpots />
          </Route>
          <Route exact path="/fishing-trips">
            <Boats />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
