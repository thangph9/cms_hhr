const express = require('express'); // eslint-disable-line
// const https = require('https');
// const http = require('http');
const bodyParser = require('body-parser'); // eslint-disable-line
const path = require('path');
// const fs = require('fs');

const api = require('./api');
const images = require('./api/images');
const upload = require('./api/upload');

const app = express();
/*
const privateKey = fs.readFileSync('./ssl_cert/hhr.key', 'utf8');
const certificate = fs.readFileSync('./ssl_cert/hhr.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
*/
// Use the default path '/' (Not recommended)
// app.use(mockjs(path.join(__dirname, 'mocks')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));
// Use a custom path '/api'

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  //
  // Pass to next layer of middleware
  next();
});
app.use('/api', api);
app.use(images);
app.use(upload);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});
//  Here you can add any code.
/*
const server = https.createServer(credentials, app);
*/
if (!module.parent) {
  /*
  server.listen(443, () => {
    console.log('server running at https://henhoradio.net/');
  });

  http
    .createServer((req, res) => {
      res.writeHead(301, { Location: 'https://'.concat(req.headers.host, req.url) });
      res.end();
    })
    .listen(80);
  */
  app.listen(8080, () => {
    console.log('server dev running port 8000');
  });
}
