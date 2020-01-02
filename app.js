const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors')
const app = express();

//Setup body-parser middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//CORS - This allows access from different origin to my API
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Home route
app.get('/api/v1/', (req, res) => {
    res.json({
        message: "Welcome to Christian Connect Api"
    })
})



// ADMINS ROUTE
const adminRouter = require('./routes/admins')
app.use('/api/v1', adminRouter)

//MUSIC ROUTE
const musicRouter = require('./routes/music')
app.use('/api/v1', musicRouter)

//VIDEO ROUTE
const videoRouter = require('./routes/video')
app.use('/api/v1', videoRouter)

//LYRIC ROUTE
const lyricRouter = require('./routes/lyric')
app.use('/api/v1', lyricRouter)

//EVENT ROUTE
const eventRouter = require('./routes/event')
app.use('/api/v1', eventRouter)

//JOB ROUTE
const jobRouter = require('./routes/jobs')
app.use('/api/v1', jobRouter)

//ADMIN DASHBOARD EXTRA ROUTE
const adminDashboard = require('./routes/adminDashboard')
app.use('/api/v1', adminDashboard)

//ADMIN AUTH ROUTE
const adminAuthRouter = require('./routes/adminAuth')
app.use('/api/v1', adminAuthRouter)

module.exports = app;