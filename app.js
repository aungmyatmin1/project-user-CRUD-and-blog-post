var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')
require('dotenv/config')


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var blogRouter = require('./routes/blog')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({secret:process.env.SESSION_SECRET, saveUninitialized:false, resave:false}))


app.use('/', indexRouter);
app.use('/blog', blogRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//db connection 

mongoose.connect(process.env.MD_URL, {useNewUrlParser: true, useUnifiedTopology:true})
.then (()=>{
  console.log("DB Connect")
}).catch((error)=>{
  console.log(error)
})
module.exports = app;
