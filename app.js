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

//test route
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Christian Connect Api"
    })
})


module.exports = app;