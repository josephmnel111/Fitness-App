const express = require('express')

const app = express()

app.get("/", function(req, resp) {
    console.log("Get Sent!")
})

app.post("/input", function(req, resp) {
    console.log("Post Sent!")
})

app.listen(3000, function() {
    console.log("The server is running on port 3000.")
})