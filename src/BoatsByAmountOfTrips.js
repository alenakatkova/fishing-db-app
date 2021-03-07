import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import {parse, startOfToday, sub} from 'date-fns';
import './forms.css';
import './tables.css';

function BoatsByAmountOfTrips() {
  const [rows, setRows] = useState([]);


  const currentDate = startOfToday().getTime();

  useEffect(() => {
    db.all(`SELECT 
                    l.boat_passport,
                    r.name,
                  COUNT(l.boat_passport) as Count
                  FROM fs_tt_trip l
                  LEFT JOIN fs_ts_boat r ON
                    r.boat_passport = l.boat_passport
                    WHERE l.start_date < ?
                  GROUP BY
                    l.boat_passport, r.name
                  ORDER BY
                    Count DESC;
           `, [currentDate])
        .then((data) => {
          setRows(data
              .map((item) => {
                    return [
                        <tr key={item["boat_passport"]}>
                          <td className="db-table-cell">{item["boat_passport"]}</td>
                          <td className="db-table-cell">{item.name}</td>
                          <td className="db-table-cell">{item["Count"]}</td>
                        </tr>
                    ]
              }))
        })
  }, [setRows]);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Формирование отчета по количеству выходов на лов для каждого катера</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <div className="table-container">
            <table className="db-table">
              <thead>
                <tr className="db-table-row">
                  <th className="db-table-header">Паспорт катера</th>
                  <th className="db-table-header">Название катера</th>
                  <th className="db-table-header">Количество рейсов, совершенное до сегодняшнего дня</th>
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

export default BoatsByAmountOfTrips;
