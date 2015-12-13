var express = require('express');

var route = function(MeasurementModel){
	var statsRouter = express.Router();

	var middleware = require('./middleware')(MeasurementModel);
	statsRouter.use('/', middleware.findMeasurementsInRange);
	
	statsRouter.route('/').get(function(req, res){
			console.log(req.query);
		});
	return statsRouter;

}
module.exports = route;