const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3');

const database = new sqlite3.Database('./public/db.sqlite3', (err) => {
  if (err) console.error('Database opening error: ', err);
});


ipcMain.on('asynchronous-message', (event, arg) => {
  database.all(arg, (err, rows) => {
    event.reply('asynchronous-reply', (err && err.message) || rows);
  });
});
