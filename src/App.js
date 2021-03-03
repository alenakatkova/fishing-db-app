import React from 'react';
// import HomePageNavBar from "./HomePageNavBar";
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
    // <div className="App-container">
    //   <header className="App-header">
    //     <h1>База данных рыболовной станции</h1>
    //   </header>
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
      /*<HomePageNavBar/>*/
    //   <footer>Разработано Катковой А.А.</footer>
    // </div>
  );
}

export default App;
