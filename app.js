const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const cors = require('cors')
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')



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

//Setup body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


//SETUP FILEUPLOAD
app.use(fileUpload({
  useTempFiles: true,
}));

//API Documentation ROUTE
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ADMINS ROUTE
const adminRouter = require('./routes/admins')
app.use('/api/v1', adminRouter)

//USER AUTH ROUTE
const usersAuthRouter = require('./routes/usersAuth')
app.use('/api/v1', usersAuthRouter)

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

//SEARCH ROUTE
const searchRouter = require('./routes/search')
app.use('/api/v1', searchRouter)

//ADMIN DASHBOARD EXTRA ROUTE
const adminDashboard = require('./routes/adminDashboard')
app.use('/api/v1', adminDashboard)

//ADMIN AUTH ROUTE
const adminAuthRouter = require('./routes/adminAuth')
app.use('/api/v1', adminAuthRouter)


// Friend Request Route {@OluwmayowaF}
const requestsRouter = require('./routes/requests')
app.use('/api/v1', requestsRouter)

// Posts Route {@OluwmayowaF}
const postsRouter = require('./routes/posts')
app.use('/api/v1', postsRouter)


//Home route
app.get('/api/v1/', (req, res) => {
  res.json({
      message: "Welcome to Christian Connect API"
  })
})

module.exports = app;