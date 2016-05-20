var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();


var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/auctions-bids");


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, "./client")));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use("/", require("./routes/users"));
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auctions'));


var server = app.listen(3000, function () {
	console.log("$$ time to bid on port 3000 $$")
});