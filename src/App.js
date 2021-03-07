import React from 'react';
import './App.css';
import Boats from "./Boats";
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import HomePage from "./HomePage";

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
            <Boats />
          </Route>
          <Route exact path="/fishing-trips">
            <Boats />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
