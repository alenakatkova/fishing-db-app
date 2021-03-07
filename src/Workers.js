import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import { format, parse, sub } from 'date-fns';
import './forms.css';
import './tables.css';

function Workers() {
  const [rows, setRows] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState({
    worker_id:"",
    surname: "",
    first_name: "",
    patronym: "",
    birth_date: "",
    phone_number: "",
    job: "",
    team_id: ""
  });
  const [post, setPost] = useState({
    worker_id:"",
    surname: "",
    first_name: "",
    patronym: "",
    birth_date: "",
    phone_number: "",
    job: "",
    team_id: ""
  });

  // getting max birth date
  const currentDate = new Date().toISOString().split("T")[0];
  const minus18Years = sub(new Date(currentDate), {years: 18});
  const maxBirthDate = format(minus18Years, "yyyy-MM-dd");

  const formatDateToTimestamp = (date) => {
    let parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    let timestamp = parsedDate.getTime();
    return timestamp;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    db
        .run(`INSERT INTO fs_ts_worker(
            worker_id, 
            surname, 
            first_name,
            patronym,
            job,
            birth_date, 
            phone_number, 
            team_id) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                "С№" + post.phone_number,
                post.surname,
                post.first_name,
                post.patronym,
                post.job,
                formatDateToTimestamp(post.birth_date),
                post.phone_number,
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
        if (key === "birth_date") {
          newColumnRecord = formatDateToTimestamp(post["birth_date"]);
        }
        columns.push(key + " = ?");
        values.push(newColumnRecord);
      }
    }
    values.push(recordToUpdate.worker_id);
    const sql = `UPDATE fs_ts_worker 
        SET 
            ${columns.join(", ")}
        WHERE 
            worker_id = ?`;
    db.run(sql, values).then(() => {setIsUpdating(false)});
  };

  const onDelete = (id) => {
    db.run(`DELETE FROM fs_ts_worker WHERE worker_id=?`, [id]);
  };

  const formatDateFromTimestamp = (timestamp) => {
    return format(new Date(timestamp), "yyyy-MM-dd");
  };

  const onUpdateButtonClick = (id) => {
    db.all(`SELECT *
           FROM fs_ts_worker
           WHERE worker_id  = ?`, id)
        .then((data) => {
              setPost({
                worker_id:data[0]["worker_id"],
                surname: data[0]["surname"],
                first_name: data[0]["first_name"],
                patronym: data[0]["patronym"],
                job: data[0]["job"],
                birth_date: formatDateFromTimestamp(data[0]["birth_date"]),
                phone_number: data[0]["phone_number"],
                team_id: data[0]["team_id"]
              });
              setRecordToUpdate({
                worker_id:data[0]["worker_id"],
                surname: data[0]["surname"],
                first_name: data[0]["first_name"],
                patronym: data[0]["patronym"],
                job: data[0]["job"],
                birth_date: formatDateFromTimestamp(data[0]["birth_date"]),
                phone_number: data[0]["phone_number"],
                team_id: data[0]["team_id"]
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
    db.all('SELECT * FROM fs_ts_worker')
        .then((data) => {
          setRows(data
              .map((item) => {
                return [
                  <tr key={item["worker_id"]}>
                    <td className="db-table-cell">{item["surname"]}</td>
                    <td className="db-table-cell">{item["first_name"]}</td>
                    <td className="db-table-cell">{item["patronym"]}</td>
                    <td className="db-table-cell">{format(new Date(item["birth_date"]), "dd.MM.yyyy")}</td>
                    <td className="db-table-cell">{"8" + item["phone_number"]}</td>
                    <td className="db-table-cell">{item["job"]}</td>
                    <td className="db-table-cell">{item["team_id"]}</td>
                    <td className="db-table-cell">
                      <button className="db-table-button"
                              onClick={() => onUpdateButtonClick(item["worker_id"])}>Редактировать
                      </button>
                      <button className="db-table-button" onClick={() => onDelete(item["worker_id"])}>Удалить</button>
                    </td>
                  </tr>
                ];
              }))
        })
  }, [setRows]);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Работники рыболовной станции</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={isUpdating ? onUpdate : onSubmit}>
            <label htmlFor="surname">Фамилия</label>
            <input
                className="input"
                type="text"
                name="surname"
                id="surname"
                placeholder="Фамилия"
                value={post.surname}
                onChange={e => setPost({ ...post, surname: e.target.value })}
            />
            <label htmlFor="first_name">Имя</label>
            <input
                className="input"
                type="text"
                name="first_name"
                id="first_name"
                placeholder="Имя"
                value={post.first_name}
                onChange={e => setPost({ ...post, first_name: e.target.value })} />
              <label htmlFor="patronym">Отчество</label>
              <input
                  className="input"
                  type="text"
                  name="patronym"
                  id="patronym"
                  placeholder="Отчество"
                  value={post.patronym}
                  onChange={e => setPost({ ...post, patronym: e.target.value })} />
            <label htmlFor="birth-date">Дата рождения</label>
            <input
                className="input"
                type="date"
                name="birth-date"
                id="birth-date"
                max={maxBirthDate}
                value={post["birth_date"]}
                onChange={e => {setPost({ ...post, "birth_date": e.target.value })}} />
            <label htmlFor="phone_number">Номер телефона</label>
            <input
                className="input"
                type="text"
                pattern="[0-9]*"
                name="phone_number"
                id="phone_number"
                maxlength="10"
                placeholder="Номер телефона, 10 цифр, вводится без 8"
                min={0}
                value={post.phone_number}
                onChange={e => setPost({ ...post, phone_number: e.target.value })} />
            <label htmlFor="job">Должность</label>
            <div className="select">
              <select size={2} id="job" name="job" onChange={e => setPost({ ...post, job: e.target.value })}>
                <option value="капитан">Капитан</option>
                <option value="рыболов">Рыболов</option>
              </select>
            </div>
            <label htmlFor="team">Команда</label>
            <div className="select">
              <select size={2} id="team" name="team" onChange={e => setPost({ ...post, team_id: e.target.value })}>
                {teams}
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
                  <th className="db-table-header">Фамилия</th>
                  <th className="db-table-header">Имя</th>
                  <th className="db-table-header">Отчетство</th>
                  <th className="db-table-header">Дата рождения</th>
                  <th className="db-table-header">Номер телефона</th>
                  <th className="db-table-header">Должность</th>
                  <th className="db-table-header">Команда</th>
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

export default Workers;
