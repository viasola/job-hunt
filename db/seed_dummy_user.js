const { Client } = require('pg')
const bcrypt = require('bcrypt')

const db = new Client ({
    database: 'findajob'
})

const email = 'testing@ga.co'
const myPlaintextPassword = 'test'

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(myPlaintextPassword, salt, (err, passwordDigest) => {
        db.connect()

        const sql = `INSERT INTO users (email, password_digest)
            VALUES ('${email}', '${passwordDigest}');`
        db.query(sql, (err, res) => {
            console.log(err)
            db.end()
        })
    });
});


