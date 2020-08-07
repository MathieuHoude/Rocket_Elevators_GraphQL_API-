var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: 'codeboxx',
    password: 'Codeboxx1!',
    database: 'OlivierGodbout'    

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

module.exports = {connection, query }