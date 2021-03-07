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
import Workers from "./Workers";
import Trips from "./Trips";
import BoatsByYear from "./BoatsByYear";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/boats-by-year">
            <BoatsByYear />
          </Route>
          <Route exact path="/boats-by-amount-of-tripss">
            <BoatsByYear />
          </Route>
          <Route exact path="/boats-by-power">
            <BoatsByYear />
          </Route>
          <Route exact path="/workers-with-best-results">
            <Boats />
          </Route>
          <Route exact path="/workers">
            <Workers />
          </Route>
          <Route exact path="/teams">
            <Teams />
          </Route>
          <Route exact path="/fishing-spots">
            <FishingSpots />
          </Route>
          <Route exact path="/fishing-trips">
            <Trips />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
