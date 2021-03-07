import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import { format, parse, sub } from 'date-fns';
import './forms.css';
import './tables.css';

function BoatsByYear() {
  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState(0);
  const [chosenYear, setChosenYear] = useState(0);
  const [post, setPost] = useState({
    year: ""
  });

  const formatDateToTimestamp = (date) => {
    let parsedDate = parse(date, 'yyyy', new Date());
    let timestamp = parsedDate.getTime();
    return timestamp;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    db
        .all(`SELECT * FROM fs_ts_boat WHERE construction_date < ?;`, [formatDateToTimestamp(post.year)])
        .then((data) => {
          setAmount(data.length);
          setChosenYear(post.year);
          setRows(data
              .map(item => {
                return [
                    <tr key={item["boat_passport"]}>
                      <td className="db-table-cell">{item["name"]}</td>
                      <td className="db-table-cell">{formatDateFromTimestamp(item["construction_date"])}</td>
                    </tr>
                ]
              }))
        });
  };

  const formatDateFromTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd.MM.yyyy");
  };

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Формирование отчета по катерам, построенным ранее выбранного года</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={onSubmit}>
            <label htmlFor="year">Выбрать катера, построенные ранее</label>
            <input
                className="input"
                type="text"
                name="year"
                id="year"
                placeholder="Год"
                value={post["year"]}
                onChange={e => {setPost({ ...post, "year": e.target.value })}} />

            <input className="submit" type="submit" value="Отправить запрос"/>
          </form>
          {chosenYear !== 0 ? <div className="stat-container">Количество катеров, построенных ранее {chosenYear}: {amount}</div> : ""}
          <div className="table-container">
            <table className="db-table">
              <thead>
                <tr className="db-table-row">
                  <th className="db-table-header">Название катера</th>
                  <th className="db-table-header">Дата постройки</th>
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

export default BoatsByYear;
