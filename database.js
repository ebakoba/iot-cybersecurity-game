
const sqlite3 = require('sqlite3').verbose()

function prepareDatabase (defaultUserPassword) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(':memory:')
    db.serialize(() => {
      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        hash TEXT NOT NULL);`)

      db.run(`INSERT INTO users (username, hash) VALUES ('admin', '${defaultUserPassword}')`)
      resolve(db)
    })
  })
}

module.exports = {
  prepareDatabase
}
