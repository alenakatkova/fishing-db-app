import React, { useState } from 'react';
import { Link } from "react-router-dom";
import sendAsync from './renderer';
import './forms.css';
import './tables.css';

function Boats() {
  const [message, setMessage] = useState('SELECT * FROM boats');
  const [response, setResponse] = useState();

  function send(sql) {
    sendAsync(sql)
        .then((result) => setResponse(result
            .map((item, i) => [
                <tr key={i}>
                  <td>{item["PASSPORT"]}</td>
                  <td>{item["NAME"]}</td>
                  <td>{item["CONSTRUCTION_DATE"]}</td>
                  <td>{item["WEIGHT"]}</td>
                  <td>{item["POWER"]}</td>
                  <td>
                    <button>Редактировать</button>
                    <button>Удалить</button>
                  </td>
                </tr>
            ])));
  }

  send(message);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Катера</h1>
        </header>
        <div>
          <Link exact to="/" className="menu-link">HOME</Link>
          <form className="form-container">
            <label htmlFor="passport">Паспорт №</label>
            <input type="text" name="passport" id="passport" placeholder="Номер паспорта" />
            <label htmlFor="name">Название</label>
            <input type="text" name="name" id="name" placeholder="Название катера" />
            <label htmlFor="construction-date">Дата постройки</label>
            <input type="date" name="construction-date" id="construction-date" placeholder="Дата постройки" />
            <label htmlFor="weight">Вес</label>
            <input type="text" name="weight" id="weight" placeholder="дд.мм.гггг" />
            <label htmlFor="power">Мощность двигателя</label>
            <input type="text" name="power" id="power" placeholder="Мощность двигателя" />
          </form>
          <div className="table-container">
            <table>
              <tr>
                <th>Номер паспорта</th>
                <th>Название</th>
                <th>Дата постройки</th>
                <th>Вес</th>
                <th>Мощность двигателя</th>
                <th>Кнопки управления</th>
              </tr>
              {(response && response)}
            </table>
            <article>
              <p>Main process responses:</p>
              <br />
            </article>
          </div>
        </div>
        <footer>Разработано Катковой А.А.</footer>
      </div>
  );
}

export default Boats;
