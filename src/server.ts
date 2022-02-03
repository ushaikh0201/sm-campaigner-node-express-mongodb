import bodyParser from "body-parser";
import express, { Response, NextFunction } from "express";
import passport from "passport";
import session from "express-session";
import path from "path";
import connectDB from "../config/database";
import auth from "./routes/api/auth";
import Request from "./types/Request";
import https from "https";
import http from "http";
import fs from "fs";
import User from "./models/User";
// import user from "./routes/api/user";
// import profile from "./routes/api/profile";

const app = express();

// Connect to MongoDB
connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// passport setup
app.use(
  session({
    secret: "s3cr3t",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// @route   GET /
// @desc    Test Base API
// @access  Public
// app.get("/", (_req, res) => {
//   res.send("API Running");
// });
app.get("/", (_req, res) => {
  res.render("login");
});

app.use("/api/auth", auth);
// app.use("/api/user", user);
// app.use("/api/profile", profile);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  next(err);
});

// error handler
app.use(function (err:any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

passport.serializeUser(function (user, done) {
  // done(null, user._id);
  // if you use Model.id as your idAttribute maybe you'd want
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err:any, user:any) {
    done(err, user);
  });
});

// const port = app.get("port");
// const server = app.listen(port, () =>
//   console.log(`Server started on port ${port}`)
// );

http.createServer(app).listen(3000);

// ### TO RUN LOCAL ON HTTPS ###
const localKey = path.join(__dirname, "../../", "local-key.pem");
const localCert = path.join(__dirname, "../../", "local-cert.pem");

const options = {
  key: fs.readFileSync(localKey),
  cert: fs.readFileSync(localCert),
};

const server = https.createServer(options, app).listen(5000);

export default server;

// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
// var passport = require('passport');
// var session = require('express-session');

// var index = require('./routes/index');
// var users = require('./routes/users');
// var auth = require('./routes/auth');

// var app = express();

// mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost/node-passport-social', { useMongoClient: true })
//   .then(() =>  console.log('connection successful'))
//   .catch((err) => console.error(err));

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   secret: 's3cr3t',
//   resave: true,
//   saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/', index);
// app.use('/users', users);
// app.use('/auth', auth);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
