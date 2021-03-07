import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import { format, parse, sub } from 'date-fns';
import './forms.css';
import './tables.css';

function Trips() {
  const [rows, setRows] = useState([]);
  const [teams, setTeams] = useState([]);
  const [boats, setBoats] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState({
    trip_id: "",
    start_date:"",
    finish_date: "",
    team_id: "",
    boat_passport: ""
  });
  const [post, setPost] = useState({
    trip_id: "",
    start_date:"",
    finish_date: "",
    team_id: "",
    boat_passport: ""
  });

  const currentDate = new Date().toISOString().split("T")[0];

  const formatDateToTimestamp = (date) => {
    let parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    let timestamp = parsedDate.getTime();
    return timestamp;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    db
        .run(`INSERT INTO fs_tt_trip(
            start_date, 
            finish_date,
            boat_passport,
            team_id) 
            VALUES(?, ?, ?, ?)`,
            [
                formatDateToTimestamp(post.start_date),
                formatDateToTimestamp(post.finish_date),
                post.boat_passport,
                post.team_id
            ]);
  };

  const onUpdate = (e) => {
    e.preventDefault();
    let columns = [];
    let values = [];
    for (let key in post) {
      if (post[key] !== recordToUpdate[key]) {
        let newColumnRecord = post[key];
        if (key === "start_date") {
          newColumnRecord = formatDateToTimestamp(post["start_date"]);
        }
        if (key === "finish_date") {
          newColumnRecord = formatDateToTimestamp(post["finish_date"]);
        }
        columns.push(key + " = ?");
        values.push(newColumnRecord);
      }
    }
    values.push(recordToUpdate.trip_id);
    const sql = `UPDATE fs_tt_trip
        SET 
            ${columns.join(", ")}
        WHERE 
            trip_id = ?`;
    db.run(sql, values).then(() => {setIsUpdating(false)});
  };

  const onDelete = (id) => {
    db.run(`DELETE FROM fs_tt_trip WHERE trip_id=?`, [id]);
  };

  const formatDateFromTimestamp = (timestamp) => {
    return format(new Date(timestamp), "yyyy-MM-dd");
  };

  const onUpdateButtonClick = (id) => {
    db.all(`SELECT *
           FROM fs_tt_trip
           WHERE trip_id  = ?`, id)
        .then((data) => {
              setPost({
                trip_id:data[0]["trip_id"],
                start_date: formatDateFromTimestamp(data[0]["start_date"]),
                finish_date: formatDateFromTimestamp(data[0]["finish_date"]),
                team_id: data[0]["team_id"],
                boat_passport: data[0]["boat_passport"]
              });
              setRecordToUpdate({
                trip_id:data[0]["trip_id"],
                start_date: formatDateFromTimestamp(data[0]["start_date"]),
                finish_date: formatDateFromTimestamp(data[0]["finish_date"]),
                team_id: data[0]["team_id"],
                boat_passport: data[0]["boat_passport"]
              });
              setIsUpdating(true);
    })
  };

  useEffect(() => {
    db.all('SELECT * FROM fs_ts_team')
        .then((data) => {
          setTeams(data
              .map((item) => {
                return [
                    <option key={item.team_id} value={item.team_id}>{item.team_id + " " + item.name}</option>
                ];
              }))
        });
    db.all('SELECT * FROM fs_ts_boat')
        .then((data) => {
          setBoats(data
              .map((item) => {
                return [
                  <option key={item.boat_passport} value={item.boat_passport}>{item.boat_passport + " " + item.name}</option>
                ];
              }))
        });
    db.all('SELECT * FROM fs_tt_trip')
        .then((data) => {
          setRows(data
              .map((item) => {
                return [
                  <tr key={item["trip_id"]}>
                    <td className="db-table-cell">{item["trip_id"]}</td>
                    <td className="db-table-cell">{format(new Date(item["start_date"]), "dd.MM.yyyy")}</td>
                    <td className="db-table-cell">{
                      item["finish_date"] !== null ? format(new Date(item["finish_date"]), "dd.MM.yyyy") : ""}</td>
                    <td className="db-table-cell">{item["team_id"]}</td>
                    <td className="db-table-cell">{item["boat_passport"]}</td>
                    <td className="db-table-cell">
                      <button className="db-table-button"
                              onClick={() => onUpdateButtonClick(item["trip_id"])}>Редактировать
                      </button>
                      <button className="db-table-button" onClick={() => onDelete(item["trip_id"])}>Удалить</button>
                    </td>
                  </tr>
                ];
              }))
        })
  }, [setRows]);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Выходы на лов</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={isUpdating ? onUpdate : onSubmit}>
            <label htmlFor="start_date">Дата выхода на лов</label>
            <input
                className="input"
                type="date"
                name="start_date"
                id="start_date"
                max={currentDate}
                value={post["start_date"]}
                onChange={e => {setPost({ ...post, "start_date": e.target.value })}} />
            <label htmlFor="finish_date">Дата возвращения с лова</label>
            <input
                className="input"
                type="date"
                name="finish_date"
                id="finish_date"
                max={currentDate}
                value={post["finish_date"]}
                onChange={e => {setPost({ ...post, "finish_date": e.target.value })}} />

            <label htmlFor="team">Команда</label>
            <div className="select">
              <select size={2} id="team" name="team" onChange={e => setPost({ ...post, team_id: e.target.value })}>
                {teams}
              </select>
            </div>
            <label htmlFor="boat">Катер</label>
            <div className="select">
              <select size={2} id="boat" name="boat" onChange={e => setPost({ ...post, boat_passport: e.target.value })}>
                {boats}
              </select>
            </div>

            {isUpdating
                ? <input className="submit" type="submit" value="Внести изменения" />
                : <input className="submit" type="submit" value="Отправить" />}
          </form>

          <div className="table-container">
            <table className="db-table">
              <thead>
                <tr className="db-table-row">
                  <th className="db-table-header">Идентификатор выхода на лов</th>
                  <th className="db-table-header">Дата выхода</th>
                  <th className="db-table-header">Дата возвращения</th>
                  <th className="db-table-header">Команда</th>
                  <th className="db-table-header">Катер</th>
                  <th className="db-table-header">Кнопки управления</th>
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

export default Trips;
