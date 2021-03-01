const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3');

const database = new sqlite3.Database('./public/db.sqlite3', (err) => {
  if (err) console.error('Database opening error: ', err);
});

const sqlQueries = [ "CREATE TABLE IF NOT EXISTS boats (passport TEXT NOT NULL, name TEXT NOT NULL, construction_date TEXT, weight INTEGER, power INTEGER)" ];


database.serialize(() => {
  // Queries scheduled here will be serialized.
  database.run(sqlQueries[0])
      .run('INSERT INTO boats(passport, name, construction_date, weight, power) VALUES(?, ?, ?, ?, ?)', ['Raiko',"faiko","11.11",56,45]);
});

// close the database connection


ipcMain.on('asynchronous-message', (event, arg) => {
  const sql = arg;
  database.all(sql, (err, rows) => {
    event.reply('asynchronous-reply', (err && err.message) || rows);
  });
});