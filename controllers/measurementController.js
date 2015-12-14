
var constants = require('../utilities/constants')();
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
			
			var controllerHelper = require('./controllerHelper')();
			if(!controllerHelper.validateMeasurement(measurement)){
				res.status(400);
				res.send(constants['InvalidValues']);
				return;
			}

			if(MeasurementModel.findByTimeStamp(measurement['timestamp'])){
				res.status(400);
				res.send(constants['DuplicateTimeStamp']);
				return;
			}

			var callback = function(){
				res.status(201);
				res.location('/measurements/'+measurement['timestamp']);
				res.send();
			}
			MeasurementModel.save(measurement, callback);
			
		};

	var get = function(req, res){
			res.json(MeasurementModel.getAll());
		};
	var getByTimeStamp = function(req, res){
			var requestParam = req.params.time;
			var measurements = MeasurementModel.getByDay(requestParam);
			if(requestParam.search('T') > 0){
					res.json(measurements[0]);
			}
			else{
				res.json(measurements);
			}
			
		};

	var put = function(req, res){
			var measurement = req.body;
			var controllerHelper = require('./controllerHelper')();
			if(!controllerHelper.validateMeasurement(measurement)){
				res.status(400);
				res.send(constants['InvalidValues']);
				return;
			}

			if(!measurement['timestamp'])
			{
				res.status(400);
				res.send(constants['TimeStampNotFound']);
				return;
			}

			if(req.params['time'] !== measurement['timestamp'])
			{
				res.status(409);
				res.send(constants['MismatchedTimeStamps']);
				return;
			}

			var callback = function(){
				res.status(204)
				res.send();
			}
			
			MeasurementModel.updateMeasurement(req.measurementRequestedId, measurement, callback());
			
		};

		var patch = function(req, res){
			var measurement = req.body;
			var controllerHelper = require('./controllerHelper')();
			if(!controllerHelper.validateMeasurement(measurement)){
				res.status(400);
				res.send(constants['InvalidValues']);
				return;
			}

			if(!measurement['timestamp'])
			{
				res.status(404);
				res.send(constants['TimeStampNotFound']);
				return;
			}

			if(req.params['time'] !== measurement['timestamp'])
			{
				res.status(409);
				res.send(constants['MismatchedTimeStamps']);
				return;
			}

			var callback = function(error) {
				if(error)
				{
					res.status(400)
					res.send(error);
				}
				else{
					res.status(204);
					res.send();
				}
			};
			MeasurementModel.updateMetric(req.measurementRequestedId, measurement, callback);

			
		}

		var deleteMeasurement = function(req, res){
			var callback = function() {
				res.status(204)
				res.json(req.measurement);
			};
			MeasurementModel.remove(req.params.time, callback);
		}

		return {
			post: post,
			get: get,
			getByTimeStamp: getByTimeStamp,
			put: put,
			patch: patch,
			deleteMeasurement: deleteMeasurement

		}


};

module.exports = measurementController;
