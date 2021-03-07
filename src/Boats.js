import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import { format, parse } from 'date-fns';
import './forms.css';
import './tables.css';

function Boats() {
  console.log("boats");
  const [response, setResponse] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState({
    boat_passport:"",
    name: "",
    construction_date: null,
    weight: null,
    power: null
  });
  const [post, setPost] = useState({
    boat_passport:"",
    name: "",
    construction_date: null,
    weight: null,
    power: null
  });

  const currentDate = new Date().toISOString().split("T")[0];

  const onSubmit = (e) => {
    e.preventDefault();
    let dateFromInput = parse(post["construction_date"], 'yyyy-MM-dd', new Date());
    let timestamp = dateFromInput.getTime();
      //  let timestamp = format(dateFromInput, "T");
    db
        .run(`INSERT INTO fs_ts_boat(
            boat_passport, 
            name, 
            construction_date, 
            weight, 
            power) 
            VALUES(?, ?, ?, ?, ?)`,
            [
                post.boat_passport,
                post.name,
                timestamp,
                post.weight,
                post.power
            ]);
  };

  const onUpdate = (e) => {
    e.preventDefault();
    let columns = [];
    let values = [];
    for (let key in post) {
      if (post[key] !== recordToUpdate[key]) {
        let newColumnRecord = post[key];
        if (key === "construction_date") {
          newColumnRecord = post[key].split("-").reverse().join(".");
        }
        columns.push(key + " = ?");
        values.push(newColumnRecord);
      }
    }
    values.push(recordToUpdate.boat_passport);
    const sql = `UPDATE fs_ts_boat 
        SET 
            ${columns.join(", ")}
        WHERE 
            boat_passport = ?`;
    db.run(sql, values).then(() => {setIsUpdating(false)});
  };

  const onDelete = (id) => {
    db.run(`DELETE FROM fs_ts_boat WHERE boat_passport=?`, [id]);
  };

  const formatDateFromTimestamp = (timestamp) => {
    return format(new Date(timestamp), "yyyy-MM-dd");
  };

  const onUpdateButtonClick = (id) => {
    db.all(`SELECT *
           FROM fs_ts_boat
           WHERE boat_passport  = ?`, id)
        .then((data) => {
              setPost({
                boat_passport:data[0]["boat_passport"],
                name: data[0]["name"],
                construction_date: formatDateFromTimestamp(data[0]["construction_date"]),
                weight: data[0]["weight"],
                power: data[0]["weight"]
              });
              setRecordToUpdate({
                boat_passport:data[0]["boat_passport"],
                name: data[0]["name"],
                construction_date: formatDateFromTimestamp(data[0]["construction_date"]),
                weight: data[0]["weight"],
                power: data[0]["power"]
              });
              setIsUpdating(true);
    })
  };

  useEffect(() => {
    db.all('SELECT * FROM fs_ts_boat')
        .then((data) => {
          setResponse(data
              .map((item) => {
                return [
                  <tr key={item["boat_passport"]}>
                    <td className="db-table-cell">{item["boat_passport"]}</td>
                    <td className="db-table-cell">{item["name"]}</td>
                    <td className="db-table-cell">{format(new Date(item["construction_date"]), "dd.MM.yyyy")}</td>
                    <td className="db-table-cell">{item["weight"]}</td>
                    <td className="db-table-cell">{item["power"]}</td>
                    <td className="db-table-cell">
                      <button className="db-table-button"
                              onClick={() => onUpdateButtonClick(item["boat_passport"])}>Редактировать
                      </button>
                      <button className="db-table-button" onClick={() => onDelete(item["boat_passport"])}>Удалить</button>
                    </td>
                  </tr>
                ];
              }))
        })
  }, [setResponse]);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Катера</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={isUpdating ? onUpdate : onSubmit}>
            <label htmlFor="passport">Паспорт №</label>
            <input
                className="input"
                type="text"
                name="passport"
                id="passport"
                placeholder="Номер паспорта"
                value={post.boat_passport}
                onChange={e => setPost({ ...post, boat_passport: e.target.value })}
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
                value={post["construction_date"]}
                onChange={e => {setPost({ ...post, "construction_date": e.target.value })}} />
            <label htmlFor="weight">Вес</label>
            <input
                className="input"
                type="number"
                name="weight"
                id="weight"
                placeholder="Вес катера"
                value={post.weight}
                onChange={e => setPost({ ...post, weight: e.target.value })} />
            <label htmlFor="power">Мощность двигателя</label>
            <input
                className="input"
                type="number"
                name="power"
                id="power"
                placeholder="Мощность двигателя"
                value={post.power}
                onChange={e => setPost({ ...post, power: e.target.value })} />
            {isUpdating
                ? <input className="submit" type="submit" value="Внести изменения" />
                : <input className="submit" type="submit" value="Отправить" />}
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
              {response}
            </table>
          </div>
        </div>
        <footer>Разработано Катковой А.А.</footer>
      </div>
  );
}

export default Boats;
