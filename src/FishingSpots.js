import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {db} from "./database/database";
import './forms.css';
import './tables.css';

function FishingSpots() {
  const [response, setResponse] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [post, setPost] = useState({
    fishing_spot_id:"",
    name: ""
  });

  const onSubmit = (e) => {
    e.preventDefault();
    db
        .run(`INSERT INTO fs_ts_fishing_spot(
            name) 
            VALUES(?)`,
            [post.name]);
  };

  const onUpdate = (e) => {
    e.preventDefault();
    const sql = `UPDATE fs_ts_fishing_spot 
        SET 
            name = ?
        WHERE 
            fishing_spot_id = ?`;
    db.run(sql, [post["name"], post["fishing_spot_id"]]).then(() => {setIsUpdating(false)});
  };

  const onDelete = (id) => {
    db.run(`DELETE FROM fs_ts_fishing_spot WHERE fishing_spot_id=?`, [id]);
  };

  const onUpdateButtonClick = (id) => {
    db.all(`SELECT *
           FROM fs_ts_fishing_spot
           WHERE fishing_spot_id  = ?`, id)
        .then((data) => {
              setPost({
                fishing_spot_id:data[0]["fishing_spot_id"],
                name: data[0]["name"]
              });
              setIsUpdating(true);
    })
  };

  useEffect(() => {
    db.all('SELECT * FROM fs_ts_fishing_spot')
        .then((data) => {
          setResponse(data
              .map((item) => {
                return [
                  <tr key={item["fishing_spot_id"]}>
                    <td className="db-table-cell">{item["fishing_spot_id"]}</td>
                    <td className="db-table-cell">{item["name"]}</td>
                    <td className="db-table-cell">
                      <button className="db-table-button"
                              onClick={() => onUpdateButtonClick(item["fishing_spot_id"])}>Редактировать
                      </button>
                      <button className="db-table-button" onClick={() => onDelete(item["fishing_spot_id"])}>Удалить</button>
                    </td>
                  </tr>
                ];
              }))
        })
  }, [setResponse]);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Рыболовные точки</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">Вернуться на главную</Link>
          <form className="form-container" onSubmit={isUpdating ? onUpdate : onSubmit}>
            <label htmlFor="name">Название рыболовной точки</label>
            <input
                className="input"
                type="text"
                name="name"
                id="name"
                placeholder="Название рыболовной точки"
                value={post.name}
                onChange={e => setPost({ ...post, name: e.target.value })}
            />
            {isUpdating
                ? <input className="submit" type="submit" value="Внести изменения" />
                : <input className="submit" type="submit" value="Отправить" />}
          </form>

          <div className="table-container">
            <table className="db-table">
              <thead>
                <tr className="db-table-row">
                  <th className="db-table-header">Идентификатор рыболовной точки</th>
                  <th className="db-table-header">Название рыболовной точки</th>
                  <th className="db-table-header">Кнопки управления</th>
                </tr>
              </thead>
              <tbody>
                {response}
              </tbody>
            </table>
          </div>
        </div>
        <footer>Разработано Катковой А.А.</footer>
      </div>
  );
}

export default FishingSpots;
