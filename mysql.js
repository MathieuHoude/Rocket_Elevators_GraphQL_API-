

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'rocketApp_development'    

});
connection.connect();





function query(queryString) {
    return new Promise((resolve, reject) => {
        connection.query(queryString, function(err, result) {
            if (err) {
                return reject(err);
            } 
            return resolve(result)
        })
    })
}

module.exports = query
