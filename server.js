var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');

var app = express();

//Read host and port from command line with npm start 
var definition = [
  { name: 'host', type: String, description: 'Takes the host address'},
  { name: 'port', type: Number, description: 'Takes port Number' }
];
var cli = commandLineArgs(definition); //To-Do check errors here 
var arguments = cli.parse();

var port = arguments.port || 3000;
var host = arguments.host || 'localhost';

app.use(logger('dev'));// log level dev 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var measurementModel = require('./models/measurementModel')();

var measurementRouter = require('./routes/measurementRoutes')(measurementModel);


var statRouter = require('./routes/statsRouter')(measurementModel);

app.use('/stats',statRouter);

app.use('/measurements', measurementRouter);

app.get('/', function(req, res){
	res.send("Welcome! New app");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Exception handler - doesn't send complete stack trace as response
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

var server = app.listen(port, host);
server.on('listening', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
  console.log('Logs-format')
  console.log(':method :url :status :response-time ms - :res[content-length]')
});
server.on('error', function(res){
	console.log("Error starting server: " + res);
});



