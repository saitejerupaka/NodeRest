var express = require('express');

var route = function(measurementModel){
	var statsRouter = express.Router();

	var middleware = require('./middleware')(measurementModel);
	statsRouter.use('/', middleware.findMeasurementsInRange);
	
	var statController = require('../controllers/statController')();
	statsRouter.route('/').get(statController.get);
	return statsRouter;

}
module.exports = route;