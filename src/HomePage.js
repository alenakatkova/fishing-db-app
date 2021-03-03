import React from 'react';
import HomePageNavBar from "./HomePageNavBar";
import './App.css';

function HomePage() {
  return (
      <div className="App-container">
        <header className="App-header">
          <h1>База данных рыболовной станции</h1>
        </header>
        <HomePageNavBar/>
        <footer>Разработано Катковой А.А.</footer>
      </div>
  );
}

export default HomePage;
