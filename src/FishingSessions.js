import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import { format, parse, sub } from 'date-fns';
import './forms.css';
import './tables.css';

function FishingSessions() {
  const [rows, setRows] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fishingSpots, setFishingSpots] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState({
    fishing_id: "",
    start_date:"",
    finish_date: "",
    haul: "",
    quality: "",
    fishing_spot_id: "",
    trip_id: "",
    team_id: ""
  });
  const [post, setPost] = useState({
    fishing_id: "",
    start_date:"",
    finish_date: "",
    haul: "",
    quality: "",
    fishing_spot_id: "",
    trip_id: "",
    team_id: ""
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
        .run(`INSERT INTO fs_tt_fishing(
            start_date, 
            finish_date,
            haul,
            quality,
            fishing_spot_id,
            trip_id) 
            VALUES(?, ?, ?, ?, ?, ?)`,
            [
                formatDateToTimestamp(post.start_date),
                formatDateToTimestamp(post.finish_date),
                post.haul,
                post.quality,
                post.fishing_spot_id,
                post.trip_id
            ]).then(() => {
            let values = [];
            const amountOfFishermen = teams[post.team_id].length;
            for (let i = 0; i < amountOfFishermen; i++) {
              values.push([
                  Object.keys(teams[post.team_id][i])[0],
                  teams[post.team_id][i][Object.keys(teams[post.team_id][i])],
                  post.haul / amountOfFishermen,
                  formatDateToTimestamp(post.start_date),
                  formatDateToTimestamp(post.finish_date),
                  post.trip_id
              ])
            }
            return values;
          })
          .then(values => {
            for (let i = 0; i < values.length; i++) {
              db.run(`INSERT INTO fs_tt_fishing_by_worker(
                  worker_id,
                  full_name,
                  haul,
                  start_date,
                  finish_date,
                  trip_id)
                  VALUES(?, ?, ?, ?, ?, ?)`, values[i]);
            }

          });
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
    values.push(recordToUpdate.fishing_id);
    const sql = `UPDATE fs_tt_fishing
        SET 
            ${columns.join(", ")}
        WHERE 
            fishing_id = ?`;
    db.run(sql, values).then(() => {setIsUpdating(false)});
  };

  const onDelete = (id) => {
    db.run(`DELETE FROM fs_tt_fishing WHERE fishing_id=?`, [id]);
  };


  const formatDateFromTimestamp = (timestamp) => {
    return format(new Date(timestamp), "yyyy-MM-dd");
  };
  const formatDateFromTimestampForTrip = (timestamp) => {
    return format(new Date(timestamp), "dd.MM.yyyy");
  };

  const onUpdateButtonClick = (id) => {
    db.all(`SELECT *
           FROM fs_tt_fishing
           WHERE fishin_id  = ?`, id)
        .then((data) => {
              setPost({
                fishing_id:data[0]["fishing_id"],
                start_date: formatDateFromTimestamp(data[0]["start_date"]),
                finish_date: formatDateFromTimestamp(data[0]["finish_date"]),
                haul: data[0]["haul"],
                quality: data[0]["quality"],
                fishing_spot_id: data[0]["fishing_spot_id"],
                trip_id: data[0]["trip_id"]
              });
              setRecordToUpdate({
                fishing_id:data[0]["fishing_id"],
                start_date: formatDateFromTimestamp(data[0]["start_date"]),
                finish_date: formatDateFromTimestamp(data[0]["finish_date"]),
                haul: data[0]["haul"],
                quality: data[0]["quality"],
                fishing_spot_id: data[0]["fishing_spot_id"],
                trip_id: data[0]["trip_id"]
              });
              setIsUpdating(true);
    })
  };

  useEffect(() => {
    db.all('SELECT * FROM fs_ts_fishing_spot')
        .then((data) => {
          setFishingSpots(data
              .map((item) => {
                return [
                  <option key={item.fishing_spot_id} value={item.fishing_spot_id}>{item.fishing_spot_id + " " + item.name}</option>
                ];
              }))
        });
    db.all('SELECT * FROM fs_tt_trip')
        .then((data) => {
          setTrips(data
              .map((item) => {
                return [
                  <option
                      key={item.trip_id}
                      value={`${item.trip_id} ${item.team_id}`}>
                    {"Рейс № " + item.trip_id + ", стартовавший " + formatDateFromTimestampForTrip(item.start_date)}
                  </option>
                ];
              }))
        });
    db.all('SELECT * FROM fs_ts_worker WHERE job = "рыболов"')
        .then((data) => {
          setTeams(data
              .reduce((acc, item) => {
                let {team_id, worker_id, surname, first_name, patronym} = item;
                return {...acc, [team_id]: [...(acc[team_id] || []), {[worker_id]: `${surname} ${first_name} ${patronym}`}]};
              }, {})
          )
        });

    db.all('SELECT * FROM fs_tt_fishing')
        .then((data) => {
          setRows(data
              .map((item) => {
                return [
                  <tr key={item["fishing_id"]}>
                    <td className="db-table-cell">{item["fishing_id"]}</td>
                    <td className="db-table-cell">{format(new Date(item["start_date"]), "dd.MM.yyyy")}</td>
                    <td className="db-table-cell">{format(new Date(item["finish_date"]), "dd.MM.yyyy")}</td>
                    <td className="db-table-cell">{item["haul"]}</td>
                    <td className="db-table-cell">{item["quality"]}</td>
                    <td className="db-table-cell">{item["fishing_spot_id"]}</td>
                    <td className="db-table-cell">{item["trip_id"]}</td>
                    <td className="db-table-cell">
                      <button className="db-table-button"
                              onClick={() => onUpdateButtonClick(item["fishing_id"])}>Редактировать
                      </button>
                      <button className="db-table-button" onClick={() => onDelete(item["fishing_id"])}>Удалить</button>
                    </td>
                  </tr>
                ];
              }))
        })
  }, [setRows]);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Лов на рыболовных точках</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={isUpdating ? onUpdate : onSubmit}>
            <label htmlFor="start_date">Дата прихода на точку</label>
            <input
                className="input"
                type="date"
                name="start_date"
                id="start_date"
                max={currentDate}
                value={post["start_date"]}
                onChange={e => {setPost({ ...post, "start_date": e.target.value })}} />
            <label htmlFor="finish_date">Дата ухода с точки</label>
            <input
                className="input"
                type="date"
                name="finish_date"
                id="finish_date"
                max={currentDate}
                value={post["finish_date"]}
                onChange={e => {setPost({ ...post, "finish_date": e.target.value })}} />
            <label htmlFor="haul">Улов, кг</label>
            <input
                className="input"
                type="number"
                name="haul"
                id="haul"
                min={0}
                value={post["haul"]}
                onChange={e => {setPost({ ...post, "haul": e.target.value })}} />

            <label htmlFor="qaulity">Качество улова</label>
            <div className="select">
              <select size={2} id="qaulity" name="qaulity" onChange={e => setPost({ ...post, quality: e.target.value })}>
                <option value="отличное">отличное</option>
                <option value="хорошее">хорошее</option>
                <option value="удовлетворительное">удовлетворительное</option>
                <option value="плохое">плохое</option>
              </select>
            </div>

            <label htmlFor="fishing_spot">Рыболовная точка</label>
            <div className="select">
              <select size={2} id="fishing_spot" name="fishing_spot" onChange={e => setPost({ ...post, fishing_spot_id: e.target.value })}>
                {fishingSpots}
              </select>
            </div>

            <label htmlFor="trip">Выход на лов</label>
            <div className="select">
              <select size={2} id="trip" name="trip" onChange={e => {
                let ids = e.target.value.split(" ").map((item) => Number.parseInt(item));
                setPost({
                  ...post,
                  trip_id: ids[0],
                  team_id: ids[1]
                })
              }}>
                {trips}
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
                  <th className="db-table-header">Идентификатор лова</th>
                  <th className="db-table-header">Дата прихода</th>
                  <th className="db-table-header">Дата выхода</th>
                  <th className="db-table-header">Улов, кг</th>
                  <th className="db-table-header">Качество улова</th>
                  <th className="db-table-header">Рыболовная точка №</th>
                  <th className="db-table-header">Выход на лов №</th>
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

export default FishingSessions;
