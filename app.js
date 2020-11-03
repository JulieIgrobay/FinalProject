const express = require('express');
const eventRouter = require('./routers/eventRouter');
const attendanceRouter = require('./routers/attendanceRouter');
const memberRouter = require('./routers/memberRouter');
const dotenv = require('dotenv');
const connect = require('./db');

const app = express();

dotenv.config({ path: './config/config.env' });

connect();

const port = process.env.port || 3000;


app.use(express.json());
app.use('/events', eventRouter);
app.use('/attendance', attendanceRouter);
app.use('/members', memberRouter);


app.get('/', (req, res, next) => {
    res.redirect('/events')
  });
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.send({
      result: 'Internal Error',
      errorMessage: err.message,
      errorStack: err.stack
    });
});

app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${port}`);
});
