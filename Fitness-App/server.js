const express = require('express')
const bp = require('body-parser')
const mysql = require('mysql')

const config = {
    host    : 'localhost',
    user    : 'root',
    password: 'Password',
    database: 'fitness_app'
  };

const connection = mysql.createConnection(config)

const app = express()

app.use(bp.json())
app.use(bp.urlencoded({extended: true}))

app.get("/input", function(req, resp) {
    console.log("Get Sent!")
    connection.query("SELECT * FROM workout", function (err, data, fields) {
        if (err) throw err;
        resp.send(data).status(200)
      });
})

//Inserts values in user workout inputs to workout table.
app.post("/input", function(req, resp) {
    console.log("Post Sent!")
    connection.query('INSERT INTO workout(Name, Reps, Sets, Weight) VALUES("'+req.body.name+'", '+req.body.reps+', '+req.body.sets+', '+req.body.weight+')')

})

app.listen(3000, function() {
    console.log("The server is running on port 3000.")
})