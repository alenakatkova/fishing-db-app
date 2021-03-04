import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import database from "./database/database";
import './forms.css';
import './tables.css';

function Boats() {
  const [message, setMessage] = useState('SELECT * FROM boats');
  const [response, setResponse] = useState();

  const db = new database('././public/db.sqlite3');

  const loadData = () => {
    db.all(message).then((data) => {
      setResponse(data
          .map((item, i) => [
            <tr key={i}>
              <td className="db-table-cell">{item["PASSPORT"]}</td>
              <td className="db-table-cell">{item["NAME"]}</td>
              <td className="db-table-cell">{item["CONSTRUCTION_DATE"]}</td>
              <td className="db-table-cell">{item["WEIGHT"]}</td>
              <td className="db-table-cell">{item["POWER"]}</td>
              <td className="db-table-cell">
                <button className="db-table-button">Редактировать</button>
                <button className="db-table-button">Удалить</button>
              </td>
            </tr>
          ]))
    })

  };

  useEffect(() => {
    loadData();
  });

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Катера</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container">
            <label htmlFor="passport">Паспорт №</label>
            <input className="input" type="text" name="passport" id="passport" placeholder="Номер паспорта" />
            <label htmlFor="name">Название</label>
            <input className="input" type="text" name="name" id="name" placeholder="Название катера" />
            <label htmlFor="construction-date">Дата постройки</label>
            <input className="input" type="date" name="construction-date" id="construction-date" />
            <label htmlFor="weight">Вес</label>
            <input className="input" type="text" name="weight" id="weight" placeholder="Вес катера" />
            <label htmlFor="power">Мощность двигателя</label>
            <input className="input" type="text" name="power" id="power" placeholder="Мощность двигателя" />
            <input className="submit" type="submit" value="Отправить" />
          </form>
          <div className="table-container">
            <table className="db-table">
              <tr className="db-table-row">
                <th className="db-table-header">Номер паспорта</th>
                <th className="db-table-header">Название</th>
                <th className="db-table-header">Дата постройки</th>
                <th className="db-table-header">Вес</th>
                <th className="db-table-header">Мощность двигателя</th>
                <th className="db-table-header">Кнопки управления</th>
              </tr>
              {(response && response)}
            </table>
          </div>
        </div>
        <footer>Разработано Катковой А.А.</footer>
      </div>
  );
}

export default Boats;
