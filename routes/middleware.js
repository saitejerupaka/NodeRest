var constants = require('../utilities/constants')();
var middleware = function(MeasurementModel){
	var findByRequestedTimeStamp= function(req, res, next){
		// do validations  on request param before searching 
		var re = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
		if(!re.test(req.params.time))
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