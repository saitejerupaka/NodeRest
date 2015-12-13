
var constants = require('./constants')();
var measurementController = function(MeasurementModel)
{
	var post = function(req, res){
			var measurement = req.body;
			
			if(!measurement['timestamp'])
			{
				res.status(400);
				res.send(constants['TimeStampNotFound']);
				return;
			}
			if(MeasurementModel.findByTimeStamp(measurement['timestamp'])){
				res.status(400);
				res.send(constants['DuplicateTimeStamp']);
				return;
			}

			for(var metric in measurement)
			{
				if(metric  === 'timestamp') {
					continue;
				}
				var floatRegex = /^[+-]?\d+(\.\d+)?$/;
				if(!floatRegex.test(measurement[metric]))
				{
					res.status(400);
					res.send(constants['InvalidRequestParam']);
					return;
				}
			}

			MeasurementModel.save(measurement);
			res.status(200);
			res.send();
		};

	var get = function(req, res){
			res.json(MeasurementModel.getAll());
		};
	var getByTimeStamp = function(req, res){
			var requestParam = req.params.time;
			var measurements = MeasurementModel.getByTimeStamp(requestParam);
			if(requestParam.search('T') > 0){
					res.json(measurements[0]);
			}
			else{
				res.json(measurements);
			}
			
		}

		return {
			post: post,
			get: get,
			getByTimeStamp: getByTimeStamp
		}


};

module.exports = measurementController;
