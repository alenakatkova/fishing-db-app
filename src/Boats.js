import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import database from "./database/database";
import './forms.css';
import './tables.css';

function Boats() {
  const [message, setMessage] = useState('SELECT * FROM boats');
  const [response, setResponse] = useState();
  const [post, setPost] = useState({});

  const db = new database('././public/db.sqlite3');

  const submit = (e) => {
    db
        .run(`INSERT INTO boats(
        passport, 
        name, 
        construction_date, 
        weight, 
        power) 
        VALUES(?, ?, ?, ?, ?)`,
        [post.passport, post.name, post["construction-date"], post.weight, post.power])
        .then(data => console.log(data));
    e.preventDefault();
  };



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
          <form className="form-container" onSubmit={submit}>
            <label htmlFor="passport">Паспорт №</label>
            <input
                className="input"
                type="text"
                name="passport"
                id="passport"
                placeholder="Номер паспорта"
                onChange={e => setPost({ ...post, passport: e.target.value })}
            />
            <label htmlFor="name">Название</label>
            <input
                className="input"
                type="text"
                name="name"
                id="name"
                placeholder="Название катера"
                onChange={e => setPost({ ...post, name: e.target.value })} />
            <label htmlFor="construction-date">Дата постройки</label>
            <input
                className="input"
                type="text"
                name="construction-date"
                id="construction-date"
                onChange={e => setPost({ ...post, "construction-date": e.target.value })} />
            <label htmlFor="weight">Вес</label>
            <input
                className="input"
                type="text"
                name="weight"
                id="weight"
                placeholder="Вес катера"
                onChange={e => setPost({ ...post, weight: e.target.value })} />
            <label htmlFor="power">Мощность двигателя</label>
            <input
                className="input"
                type="text"
                name="power"
                id="power"
                placeholder="Мощность двигателя"
                onChange={e => setPost({ ...post, power: e.target.value })} />
            <input className="submit" type="submit" value="Отправить" />
          </form>
          <button onClick={submit}>Click</button>

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
