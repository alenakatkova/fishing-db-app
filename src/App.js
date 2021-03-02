import React, { useState } from 'react';
import sendAsync from './renderer';

import Boats from "./Boats";
import './App.css';

function App() {
  const [message, setMessage] = useState('SELECT * FROM boats');
  const [response, setResponse] = useState();

  function send(sql) {
    sendAsync(sql).then((result) => setResponse(result));
  }

  return (
    <div className="App-container">
      <header className="App-header">
        <h1>База данных рыболовной станции</h1>
      </header>
      <div className="content-container">
        <section className="subsection">
          <h2>Просмотр и редактирование</h2>
          <ul className="menu">
            <li><a className="menu-link">Флотилия</a></li>
            <li><a className="menu-link">Сотрудники</a></li>
            <li><a className="menu-link">Команды</a></li>
            <li><a className="menu-link">Выходы на лов</a></li>
          </ul>
        </section>
        <section className="subsection">
          <h2>Формирование отчетов</h2>
          <ul className="menu">
            <li><a className="menu-link">Катера по году постройки</a></li>
            <li><a className="menu-link">Катера по количеству выходов на лов</a></li>
            <li><a className="menu-link">Катера по мощности</a></li>
            <li><a className="menu-link">Сотрудники с наибольшим уловом</a></li>
          </ul>
        </section>

      </div>
      <article>
        <p>
          Say <i>ping</i> to the main process.
        </p>
        <input
            type="text"
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
        />
        <button type="button" onClick={() => send(message)}>
          Send
        </button>
        <br />
        <p>Main process responses:</p>
        <br />
        <pre>
                    {(response && JSON.stringify(response, null, 2)) ||
                    'No query results yet!'}
                </pre>
      </article>
      <Boats/>
      <footer>Разработано Катковой А.А.</footer>
    </div>
  );
}

export default App;
