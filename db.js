const mysql = require('mysql')
const config = require('config');
const connection = mysql.createConnection(config.get('db'))

connection.connect((error) =>{
    if (error){
        return console.log(error)

    }
})
module.exports = connection
