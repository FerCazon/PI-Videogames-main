const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const cors = require('cors');
const axios = require('axios');

require('./db.js');

const server = express();
server.use(cors())
server.name = 'API';

server.use(morgan("dev"))



server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', routes);

function fetchAndSave() {
  setTimeout(() => {
    axios.get('http://localhost:3001/fetchandsave')
      .then((response) => {
        console.log('Data fetched and saved successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching and saving data:', error);
      });
  }, 5000);
}

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

fetchAndSave();

module.exports = server;
