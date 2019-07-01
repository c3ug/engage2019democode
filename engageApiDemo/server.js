
var cors = require('cors');
var express = require('express');
const http = require('http');

app = express().use('*', cors());
port = process.env.PORT || 8081;
bodyParser = require('body-parser');
expressValidator = require('express-validator');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

var routes = require('./api/routes/surveyRoutes'); //importing route
routes(app);

app.listen(port);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

console.log('Q! - a survey app - RESTful API server started on: ' + port);
