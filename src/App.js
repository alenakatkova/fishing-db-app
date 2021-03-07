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
import BoatsByAmountOfTrips from "./BoatsByAmountOfTrips";
import BoatsByPower from "./BoatsByPower";
import FishingSessions from "./FishingSessions";
import ResultByWorker from "./ResultByWorker";

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
          <Route exact path="/boats-by-amount-of-trips">
            <BoatsByAmountOfTrips />
          </Route>
          <Route exact path="/boats-by-power">
            <BoatsByPower />
          </Route>
          <Route exact path="/workers-with-best-results">
            <ResultByWorker />
          </Route>
          <Route exact path="/boats">
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
          <Route exact path="/fishing-sessions">
            <FishingSessions />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
