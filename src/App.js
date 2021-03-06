import React from 'react';
import './App.css';
import Boats from "./Boats";
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import HomePage from "./HomePage";
import database from "./database/database";
import {
    teamTableQuery,
    workerTableQuery,
    boatTableQuery,
    fishingSpotTableQuery,
    fishingTableQuery,
    tripTableQuery
} from "./database/create-table-queries";

// const sqlQueries = [ "CREATE TABLE IF NOT EXISTS boats (passport TEXT NOT NULL, name TEXT NOT NULL, construction_date TEXT, weight INTEGER, power INTEGER)" ];
//sendAsync('INSERT INTO boats(passport, name, construction_date, weight, power) VALUES("kfkjebgfkjw","faiko","11.11",56,45)');
//
// database.serialize(() => {
//   database.run(sqlQueries[0])
//       .run('INSERT INTO boats(passport, name, construction_date, weight, power) VALUES(?, ?, ?, ?, ?)', ['Raiko',"faiko","11.11",56,45]);
// });

function App() {
  const setDatabase = () => {
    const db = new database('././public/db.sqlite3');
    // db.createTable(boatTableQuery + teamTableQuery + fishingSpotTableQuery + workerTableQuery + tripTableQuery + fishingTableQuery);
    db.createTable(boatTableQuery);
    db.createTable(teamTableQuery);
    db.createTable(fishingSpotTableQuery);
    db.createTable(workerTableQuery);
    db.createTable(tripTableQuery);
    db.createTable(fishingTableQuery);
  };

  setDatabase();

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
