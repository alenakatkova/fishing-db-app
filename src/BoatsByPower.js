import React, { useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import {startOfToday, sub} from 'date-fns';
import './forms.css';
import './tables.css';

function BoatsByPower() {
  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState(0);
  const [chosenPower, setChosenPower] = useState(0);
  const [post, setPost] = useState({
    power: ""
  });

  const currentDate = startOfToday().getTime();
  const monthAgo = sub(currentDate, {months: 1}).getTime();

  const onSubmit = (e) => {
    e.preventDefault();
    db
        .all(`SELECT
                    r.name,
                    r.power,
                    l.boat_passport,
                    COUNT(l.boat_passport) as Count
                FROM fs_tt_trip l
                LEFT JOIN fs_ts_boat r ON
                    l.boat_passport = r.boat_passport
                WHERE 
                    r.power > ? AND l.start_date >= ? AND l.finish_date <= ?
                GROUP BY
                    l.boat_passport, 
                    r.name;
                    `, [post.power, monthAgo, currentDate])
        .then((data) => {
          setAmount(data.length);
          setChosenPower(post.power);
          setRows(data
              .map(item => {
                return [
                    <tr key={item["name"]}>
                      <td className="db-table-cell">{item["name"]}</td>
                      <td className="db-table-cell">{item["power"]}</td>
                      <td className="db-table-cell">{item["Count"]}</td>
                    </tr>
                ]
              }))
        });
  };

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Формирование отчета по катерам, мощность которых превышает заданное значение</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={onSubmit}>
            <label htmlFor="power">Выбрать катера с мощностью более</label>
            <input
                className="input"
                type="text"
                name="power"
                id="power"
                placeholder="Мощность"
                value={post["power"]}
                onChange={e => {setPost({ ...post, power: e.target.value })}} />

            <input className="submit" type="submit" value="Отправить запрос"/>
          </form>
          {chosenPower !== 0 ? <div className="stat-container">Количество катеров с мощностью более {chosenPower}: {amount}</div> : ""}
          <div className="table-container">
            <table className="db-table">
              <thead>
                <tr className="db-table-row">
                  <th className="db-table-header">Название катера</th>
                  <th className="db-table-header">Мощность</th>
                  <th className="db-table-header">Количество выходов на рейс за последний месяц</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
        <footer>Разработано Катковой А.А.</footer>
      </div>
  );
}

export default BoatsByPower;
