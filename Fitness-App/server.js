//npm run devstart x
//Currently - x = 192.168.0.10
//Find by running ipcofig in terminal and copy IPv4 data

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


/*Profile Section*/
app.get("/steps-info", function(req, resp) {
    console.log('Get Sent!')
    connection.query("SELECT * FROM steps ORDER BY Date ASC", function(err, data, fields) {
        if (err) throw err;
        resp.send(data).status(200)
    });
})

app.post("/steps-info", function(req, resp) {

})

app.get("/workouts-info", function(req, resp) {
    console.log("Get Sent!")
    connection.query("SELECT * FROM schedule INNER JOIN workout on schedule.Workout_ID = workout.workout_ID", function (err, data, fields) {
        if (err) throw err;
        resp.send(data).status(200)
      });
})


/*Lifting Section*/
app.get("/workout-input", function(req, resp) {
    console.log("Get Sent!")
    connection.query("SELECT * FROM workout", function (err, data, fields) {
        if (err) throw err;
        resp.send(data).status(200)
      });
})

app.get("/workout-input", function(req, resp) {
    console.log("Get Sent!")
    connection.query("SELECT * FROM workout", function (err, data, fields) {
        if (err) throw err;
        resp.send(data).status(200)
      });
})

app.get("/schedule-input", function(req, resp) {
    console.log("Get Sent!")
    let month = req.query.month
    let year = req.query.year
    connection.query("SELECT * FROM schedule INNER JOIN workout on schedule.Workout_ID = workout.workout_ID", function (err, data, fields) {
        if (err) throw err;
        let returnData = []
        for (let i = 0; i < data.length; ++i) {
            let value = data[i].Date.split('/')
            console.log(value)
            console.log(month)
            console.log(year)
            if ((value[0] == month) && (value[2] == year)) {
                returnData.push(data[i])
            }
        }
        console.log(returnData)
        resp.send(returnData).status(200)
      });
})

//Inserts values in user workout inputs to workout table.
app.post("/workout-input", function(req, resp) {
    connection.query('INSERT INTO workout(Name, Reps, Sets, Weight) VALUES("'+req.body.name+'", '+req.body.reps+', '+req.body.sets+', '+req.body.weight+')')
    console.log("Post Sent!")
})

app.post("/schedule-input", function(req, resp) {
    req.body.dateValues.forEach((date) => {
        req.body.workoutValues.forEach((workout) => {
            connection.query('INSERT INTO schedule(Date, Workout_ID) VALUES ("'+date+'", '+workout.Workout_ID+')')
        })
    })
    console.log("Post Sent!")
})

app.listen(3000, function() {
    console.log("The server is running on port 3000.")
})