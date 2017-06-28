var app = require('./express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');

require('dotenv').config();

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    // secret: "secret",
    resave:true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');

app.use(app.express.static(__dirname + '/public'));
// require('./public/app');
// require('./public/mongo/app');
require("./server/app");
app.listen(process.env.PORT || 5555);