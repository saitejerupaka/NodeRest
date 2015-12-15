var constants = require('../utilities/constants')();
var middleware = function(MeasurementModel){
	var findByRequestedTimeStamp= function(req, res, next){

		// do validations  on request param before searching 
		var controllerHelper = require('../controllers/controllerHelper')();
		if(!controllerHelper.isValidTimeStamp(req.params.time))
		{
			res.status(400);
        	res.send(constants['InvalidRequestParam']);
        	return;
		}


		var index = MeasurementModel.findRequestedTimeStampIndex(req.params.time);
		if(index === -1)
        {
        	res.status(404);
        	res.send(constants['TimeStampNotFound']);
        	return;
        }
        var measurement = MeasurementModel.findByTimeStamp(req.params.time);
        req.measurement = measurement;

        req.measurementRequestedId = index;
		next();
	}

	var findMeasurementsInRange = function(req, res, next){

		var fromDateTime = req.query.fromDateTime;
		var toDateTime = req.query.toDateTime;
		
		var measurements = MeasurementModel.findValuesInRange(fromDateTime, toDateTime);
		req.measurementsInRange = measurements;
		next();

	}
	return {
		findByRequestedTimeStamp: findByRequestedTimeStamp,
		findMeasurementsInRange : findMeasurementsInRange
	}
}

module.exports = middleware;