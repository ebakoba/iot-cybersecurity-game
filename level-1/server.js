console.log('hello from server 1')

const prepareDatabase = require('../database').prepareDatabase

prepareDatabase('secret-password').then((database) => {
  console.log('database', database)
  database.each("SELECT * FROM users", function(err, row) {
    console.log(row);
  });
  console.log('more')
})
