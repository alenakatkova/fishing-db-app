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
                <li><Link to="/workers" className="menu-link">Сотрудники</Link></li>
                <li><Link to="/teams" className="menu-link">Команды</Link></li>
                <li><Link to="/fishing-trips" className="menu-link">Выходы на лов</Link></li>
              </ul>
            </nav>
          </section>
          <section className="subsection">
            <h2>Формирование отчетов</h2>
            <ul className="menu">
              <li><a className="menu-link">Катера по году постройки</a></li>
              <li><a className="menu-link">Катера по количеству выходов на лов</a></li>
              <li><a className="menu-link">Катера по мощности</a></li>
              <li><a className="menu-link">Сотрудники с наибольшим уловом</a></li>
            </ul>
          </section>
        </div>


  );
}

export default HomePageNavBar;