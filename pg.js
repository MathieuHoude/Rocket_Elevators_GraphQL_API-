const {Client} = require('pg')
var client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'Samuel_Chabot'
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

function pgquery(queryString) {
    return new Promise((resolve, reject) => {
        client.query(queryString,function(err, result){
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
}

module.exports = {
    pgquery,
    pgconnection
}