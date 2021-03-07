import React from 'react';
import {
  Link
} from "react-router-dom";
import './App.css';

function HomePageNavBar() {
  return (

        <div className="content-container">
          <section className="subsection">
            <h2>Просмотр и редактирование</h2>
            <nav>
              <ul className="menu">
                <li><Link to="/boats" className="menu-link">Флотилия</Link></li>
                <li><Link to="/teams" className="menu-link">Команды</Link></li>
                <li><Link to="/fishing-spots" className="menu-link">Рыболовные точки</Link></li>
                <li><Link to="/workers" className="menu-link">Сотрудники</Link></li>
                <li><Link to="/fishing-trips" className="menu-link">Выходы на лов</Link></li>
                <li><Link to="/fishing-sessions" className="menu-link">Лов на рыболовных точках</Link></li>
              </ul>
            </nav>
          </section>
          <section className="subsection">
            <h2>Формирование отчетов</h2>
            <ul className="menu">
              <li><Link to="/boats-by-year" className="menu-link">Катера по году постройки</Link></li>
              <li><Link to="/boats-by-amount-of-trips" className="menu-link">Катера по количеству выходов на лов</Link></li>
              <li><Link to="/boats-by-power" className="menu-link">Катера по мощности</Link></li>
              <li><Link to="/workers-with-best-results" className="menu-link">Сотрудники с наибольшим уловом</Link></li>
            </ul>
          </section>
        </div>


  );
}

export default HomePageNavBar;