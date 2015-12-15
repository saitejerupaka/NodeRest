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

app.use(logger('dev'));

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

var server = app.listen(port, host);
server.on('listening', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
server.on('error', function(res){
	console.log("Error starting server: " + res);
});


