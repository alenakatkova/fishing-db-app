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

 // const sqlQueries = [ "CREATE TABLE IF NOT EXISTS boats (passport TEXT NOT NULL, name TEXT NOT NULL, construction_date TEXT, weight INTEGER, power INTEGER)" ];
  //sendAsync('INSERT INTO boats(passport, name, construction_date, weight, power) VALUES("kfkjebgfkjw","faiko","11.11",56,45)');
  //
  // database.serialize(() => {
  //   database.run(sqlQueries[0])
  //       .run('INSERT INTO boats(passport, name, construction_date, weight, power) VALUES(?, ?, ?, ?, ?)', ['Raiko',"faiko","11.11",56,45]);
  // });

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
