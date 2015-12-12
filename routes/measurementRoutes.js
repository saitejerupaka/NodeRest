var express = require('express');
var _ = require('lodash');

var routes = function(MeasurementModel){
	var measurementRouter = express.Router();
	var measurementController = require('../controllers/measurementController')(MeasurementModel);
	measurementRouter.route('/')
		.post(measurementController.post)
		.get(measurementController.get);

	var middleware = require('./middleware')(MeasurementModel);
	measurementRouter.use('/:time', middleware.findByRequestedTimeStamp);

	measurementRouter.route('/:time')
		.get(measurementController.getByTimeStamp)
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