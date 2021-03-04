import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import database from "./database/database";
import './forms.css';
import './tables.css';

function Boats() {
  const [message, setMessage] = useState('SELECT * FROM boats');
  const [response, setResponse] = useState();
  const [post, setPost] = useState({
    passport:"",
    name: "",
    "construction-date": "",
    weight: null,
    power: null
  });

  const db = new database('././public/db.sqlite3');

  const currentDate = new Date().toISOString().split("T")[0];;

  const submit = (e) => {
    db
        .run(`INSERT INTO boats(
        passport, 
        name, 
        construction_date, 
        weight, 
        power) 
        VALUES(?, ?, ?, ?, ?)`,
        [post.passport, post.name, post["construction-date"].split("-").reverse().join("."), post.weight, post.power]);
    e.preventDefault();
  };

  const onDelete = (id) => {
    db
        .run(`DELETE FROM boats WHERE passport=?`,
            [id]);
  };

  // const onUpdate = (id) => {
  //   db.all(`SELECT *
  //          FROM boats
  //          WHERE passport  = ?`, id)
  //       .then((data) => {
  //     setPost({
  //       passport:data["PASSPORT"],
  //       name: data["NAME"],
  //       "construction-date": data["CONSTRUCTION_DATE"],
  //       weight: data["WEIGHT"],
  //       power: data["POWER"]
  //     })
  //   })
  // };

  const loadData = () => {
    db.all(message).then((data) => {
      setResponse(data
          .map((item, i) => [
            <tr key={item["PASSPORT"]}>
              <td className="db-table-cell">{item["PASSPORT"]}</td>
              <td className="db-table-cell">{item["NAME"]}</td>
              <td className="db-table-cell">{item["CONSTRUCTION_DATE"]}</td>
              <td className="db-table-cell">{item["WEIGHT"]}</td>
              <td className="db-table-cell">{item["POWER"]}</td>
              <td className="db-table-cell">
                <button className="db-table-button" onClick={() => onUpdate(item["PASSPORT"])}>Редактировать</button>
                <button className="db-table-button" onClick={() => onDelete(item["PASSPORT"])}>Удалить</button>
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
                value={post.passport}
                onChange={e => setPost({ ...post, passport: e.target.value })}
            />
            <label htmlFor="name">Название</label>
            <input
                className="input"
                type="text"
                name="name"
                id="name"
                placeholder="Название катера"
                value={post.name}
                onChange={e => setPost({ ...post, name: e.target.value })} />
            <label htmlFor="construction-date">Дата постройки</label>
            <input
                className="input"
                type="date"
                name="construction-date"
                id="construction-date"
                max={currentDate}
                value={post["construction-date"]}
                onChange={e => setPost({ ...post, "construction-date": e.target.value })} />
            <label htmlFor="weight">Вес</label>
            <input
                className="input"
                type="text"
                name="weight"
                id="weight"
                placeholder="Вес катера"
                value={post.weight}
                onChange={e => setPost({ ...post, weight: e.target.value })} />
            <label htmlFor="power">Мощность двигателя</label>
            <input
                className="input"
                type="text"
                name="power"
                id="power"
                placeholder="Мощность двигателя"
                value={post.power}
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
