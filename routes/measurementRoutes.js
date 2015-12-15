var express = require('express');

var routes = function(MeasurementModel){
	var measurementRouter = express.Router();
	var measurementController = require('../controllers/measurementController')(MeasurementModel);
	measurementRouter.route('/')
		.post(measurementController.post)
		.get(measurementController.get);

	var middleware = require('./middleware')(MeasurementModel);
	measurementRouter.put('/:time', middleware.findByRequestedTimeStamp);
	measurementRouter.patch('/:time', middleware.findByRequestedTimeStamp);
	measurementRouter.delete('/:time', middleware.findByRequestedTimeStamp);
	
	measurementRouter.route('/:time')
		.get(measurementController.getByTimeStamp)
		.put(measurementController.put)
		.patch(measurementController.patch)
		.delete(measurementController.deleteMeasurement);
	
	

	return measurementRouter;
}

module.exports = routes;