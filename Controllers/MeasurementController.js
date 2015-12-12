
var constants = require('./Constants')();
var measurementController = function(MeasurementModel)
{
	var post = function(req, res){
			var measurement = req.body;
			
			if(!measurement['TimeStamp'])
			{
				res.status(500);
				res.send(constants['TimeStampNotFound']);
				return;
			}
			if(MeasurementModel.findByTimeStamp(measurement['TimeStamp'])){
				res.status(500);
				res.send(constants['DuplicateTimeStamp']);
				return;
			}

			MeasurementModel.save(measurement);
			res.status(200);
			res.send();
		};

	var get = function(req, res){
			res.json(MeasurementModel.getAll());
		};
	var getByTimeStamp = function(req, res){
			
			res.json(MeasurementModel.getByTimeStamp(req.measurementRequestedId));
		}

		return {
			post: post,
			get: get,
			getByTimeStamp: getByTimeStamp
		}


};

module.exports = measurementController;
