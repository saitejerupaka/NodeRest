
var measurementModel = function(){
	var lodash = require('lodash');
	Measurement = [];

	var save = function(arguments)
	{
		Measurement.push(arguments);
		//console.log(Measurement);
	}

	var findByTimeStamp = function(timestamp)
	{
		//console.log(arguments);
		var found = lodash(Measurement).find({ 'timestamp' : timestamp });
		//console.log(found);
		return found;
	}

	var getAll = function(){
		return Measurement;
	}

	var getByDay = function(timestamp){
		var response = [];
		var pushAllWithSameTimeStamp = function(element){
			if(lodash(element['timestamp']).startsWith(timestamp))
			{	
				response.push(element);
			}
		}
		lodash(Measurement).forEach(pushAllWithSameTimeStamp).value();

		return response;

		
	};

	var findRequestedTimeStampIndex = function(timestamp)
	{
		var index = lodash(Measurement).findIndex({ 'timestamp' : timestamp });
		return index;
	};

	var updateMeasurement = function(index, measurementValue){
		Measurement[index] = measurementValue;	
	};

	var updateMetric = function(index, measurementValue, callback){
		if(measurementValue['timestamp'])
			{
				delete measurementValue['timestamp'];
			}
		for(var metric in measurementValue)
		{
			Measurement[index][metric] = measurementValue[metric];
		
		}

		callback();
	}

	var remove = function(timestamp, callback){
		Measurement = lodash(Measurement).reject({'timestamp': timestamp}).value();
		callback();
	}

	return {
		save : save,
		findByTimeStamp : findByTimeStamp,
		getAll: getAll,
		findRequestedTimeStampIndex : findRequestedTimeStampIndex,
		getByDay: getByDay,
		updateMeasurement: updateMeasurement,
		updateMetric: updateMetric,
		remove: remove
	}
}


module.exports = measurementModel;