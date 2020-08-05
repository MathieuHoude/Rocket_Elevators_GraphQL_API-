const {Client} = require('pg')
var client = new Client({
    host: 'localhost',
    user: 'james',
    password: 'password',
    database: 'james'
});

console.log("connection pg")

function pgconnection() {
    return new Promise((resolve, reject) => {
        client.connect(function(err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result)
        })
    })
} 

function querypg(queryString) {
    return new Promise((resolve, reject) => {
        client.query(queryString,function(err, result){
            if (err) {
                return reject(err);
            }
            return resolve(result.rows);
        })
    })
}

module.exports = {
    querypg,
    pgconnection
}