const sqlite3 = window.require('sqlite3');

class Database {
  constructor(dbFilePath) {
    console.log("constuctor database");
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    });
  }

  createTable(sql) {
    return this.run(sql);
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      //this.db.run(sql, params);
      this.db.run(sql, params, (err, row) => {
        if (err) {
          console.log('Error running sql ' + sql);
          console.log(err);
          reject(err)
        }
        else {
          resolve(row);
        }
      })
    })
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}
export const db = new Database('././public/db.sqlite3');
//export Database;