const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const blogsRouter = require('./routes/blogs');
const collaboratorRouter = require('./routes/collaborators');
const sponsorsRouter = require('./routes/sponsors');
const landingRouter = require('./routes/landing');
const ambassadorRouter = require('./routes/ambassador');
const dashboardRouter = require('./routes/dashboard');
const app = express();

app.use(cors());

/**DB Connection */
require('./utils/dbConnect'); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({
  limit: '100mb',
  extended: false
}));
app.use(express.urlencoded({
  limit: '100mb',
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/app/v1/health', (req, res) => {
  res.send('API OKAY!');
});
app.use('/app/v1/users', usersRouter);
app.use('/app/v1/auth', authRouter);
app.use('/app/v1/blogs', blogsRouter);
app.use('/app/v1/collaborators', collaboratorRouter);
app.use('/app/v1/sponsors', sponsorsRouter);
app.use('/app/v1/landing', landingRouter);
app.use('/app/v1/ambassadors', ambassadorRouter);
app.use('/app/v1/dashboard', dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;