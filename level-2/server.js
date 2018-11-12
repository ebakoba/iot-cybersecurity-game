console.log('hello from server 1')
const forge = require('node-forge')
const prepareDatabase = require('../database').prepareDatabase

prepareDatabase('789c75724608ed258736322b0d780ca0b6ce23458610ec6687cfd471a34c8a5220d34a83248099c9815bcab86cb97b97c54331c10b23ef07251938ebf9cbac35').then((database) => {
  console.log('database', database)
  database.each("SELECT * FROM users", function(err, row) {
    console.log(row);
  });
  const messageDigest = forge.md.sha512.create()
  messageDigest.update('Strong87Secret09')
  console.log(messageDigest.digest().toHex())
  console.log('more')
})
