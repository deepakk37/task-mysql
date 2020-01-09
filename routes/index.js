var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    res.redirect("/tasks/add")
})
module.exports = app;