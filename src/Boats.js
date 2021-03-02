import React, { useState } from 'react';

import sendAsync from './renderer';
import './forms.css';

function Boats() {

  const [message, setMessage] = useState('SELECT * FROM boats');
  const [response, setResponse] = useState();

  function send(sql) {
    sendAsync(sql).then((result) => setResponse(result));
  }

  send(message);

  return (
      <div className="App-container">
        <header className="App-header">
          <h1>Катера</h1>
        </header>
        <div>
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
            <table><th>ff</th></table>
            <article>
              <p>Main process responses:</p>
              <br />
              <pre>
                    {(response && JSON.stringify(response, null, 2)) ||
                    'No query results yet!'}
              </pre>
            </article>
          </div>
        </div>
        <footer>Разработано Катковой А.А.</footer>
      </div>
  );
}

export default Boats;
