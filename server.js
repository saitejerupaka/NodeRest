var express = require('express');
var bodyParser = require('body-parser');
var commandLineArgs = require('command-line-args');

var app = express();
var definition = [
  { name: 'host', type: String, description: 'Takes the host address'},
  { name: 'port', type: Number, description: 'Takes port Number' }
];
var cli = commandLineArgs(definition); //TO-Do check errors here 

var options = cli.parse();

var port = options.port || 3000;

var host = options.host || localhost;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


var Measurements = [
{
	'Time': '2015',
	WeatherParams: {
		Temperature: '30',
		Dew : '20'
	}

},
{
	'Time': '2014',
	WeatherParams: {
		Temperature: '20',
		Dew : '40'
	}
}
];

measurementRouter = require('./Routes/measurementRoutes')(Measurements);

app.use('/api/measurements', measurementRouter);

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


