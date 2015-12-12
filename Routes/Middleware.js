var constants = require('../Controllers/Constants')();
var Middleware = function(MeasurementModel){
	var findByRequestedTimeStamp= function(req, res, next){
		// do validations  on request param before searching 
		var index = MeasurementModel.
										findRequestedTimeStampIndex(req.params.time);
        if(index === -1)
        {
        	res.status(404);
        	res.send(constants['TimeStampNotFound']);
        	return;
        }

		req.measurementRequestedId = index;
		next();
	}
	return {
		findByRequestedTimeStamp: findByRequestedTimeStamp
	}
}

module.exports = Middleware;