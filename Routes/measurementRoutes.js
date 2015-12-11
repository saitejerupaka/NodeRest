var express = require('express');
var _ = require('lodash');

var routes = function(Measurements){
	var measurementRouter = express.Router();

	measurementRouter.route('/')
		.post(function(req, res){
			var measurement = req.body;
			Measurements.push(measurement);
		})
		.get(function(req, res){
			res.json(Measurements);
		});

	measurementRouter.use('/:time', function(req, res, next){
		// do validations  on request param before searching 
		var measurementRequestedId = _(Measurements).findIndex(function(element){
				return element.Time === req.params.time;
			});
		req.measurementRequestedId = measurementRequestedId;
		next();
		//if error finding send error here 
	});

	measurementRouter.route('/:time')
		.get(function(req, res){
			
			res.json(Measurements[req.measurementRequestedId]);
		})
		.put(function(req, res){
			Measurements[req.measurementRequestedId].WeatherParams.Temperature = req.body.WeatherParams.Temperature;
			Measurements[req.measurementRequestedId].WeatherParams.Dew = req.body.WeatherParams.Dew;
			res.status(200).send();
		})
		.patch(function(req, res){
			Measurements[req.measurementRequestedId].WeatherParams.Temperature = req.body.WeatherParams.Temperature;
			res.status(200).send();
		});
		
	return measurementRouter;
}

module.exports = routes;