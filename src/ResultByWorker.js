import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import { parse, sub } from 'date-fns';
import './forms.css';
import './tables.css';

function ResultByWorker() {
  const [rows, setRows] = useState([]);
  const [averageHaul, setAverageHaul] = useState(0);
  const [post, setPost] = useState({
    start: "",
    end: ""
  });

  const formatDateToTimestamp = (date) => {
    let parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    let timestamp = parsedDate.getTime();
    return timestamp;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    db
        .all(`SELECT 
                      full_name, 
                      sum(haul) as Sum
                  FROM fs_tt_fishing_by_worker
                  WHERE start_date >= ? AND finish_date <= ?
                  GROUP BY
                      full_name
                  ORDER BY
                      full_name ASC;
`, [formatDateToTimestamp(post.start), formatDateToTimestamp(post.end)])
        .then((data) => {
          let amountOfWorkers = data.length;
          let totalHaul = data.reduce((acc, cur) => acc + cur.Sum, 0);
          let average = Math.floor(totalHaul / amountOfWorkers);

          setAverageHaul(average);
          setRows(data
              .filter(item => item.Sum > average)
              .map(item => {
                return [
                    <tr key={item["full_name"]}>
                      <td className="db-table-cell">{item["full_name"]}</td>
                      <td className="db-table-cell">{Math.floor(item["Sum"])}</td>
                    </tr>
                ]
              }))
        });
  };

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Формирование отчета по катерам, построенным ранее выбранного года</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={onSubmit}>
            <label htmlFor="start">Выбрать данные за период с:</label>
            <input
                className="input"
                type="date"
                name="start"
                id="start"
                value={post["start"]}
                onChange={e => {setPost({ ...post, "start": e.target.value })}} />
            <label htmlFor="end">по:</label>
            <input
                className="input"
                type="date"
                name="end"
                id="end"
                value={post["end"]}
                onChange={e => {setPost({ ...post, "end": e.target.value })}} />

            <input className="submit" type="submit" value="Отправить запрос"/>
          </form>
          {averageHaul !== 0 ? <div className="stat-container">За указанный период в средним один работник выловил {averageHaul} кг рыбы</div> : ""}
          <div className="table-container">
            <table className="db-table">
              <thead>
                <tr className="db-table-row">
                  <th className="db-table-header">Фамилия работника</th>
                  <th className="db-table-header">Улов</th>
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

export default ResultByWorker;
