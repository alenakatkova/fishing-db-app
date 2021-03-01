import './App.css';

function App() {
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
      <footer>Разработано Катковой А.А.</footer>
    </div>
  );
}

export default App;
