
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

	var getByTimeStamp = function(timestamp){
		var response = [];
		var pushAllWithSameTimeStamp = function(element){
			if(lodash(element['timestamp']).startsWith(timestamp))
			{	
				response.push(element);
			}
		}
		lodash(Measurement).forEach(pushAllWithSameTimeStamp).value();

		return response;

		
	}

	var findRequestedTimeStampIndex = function(timestamp)
	{
		var index = lodash(Measurement).findIndex({ 'timestamp' : timestamp });
		return index;
	}

	return {
		save : save,
		findByTimeStamp : findByTimeStamp,
		getAll: getAll,
		findRequestedTimeStampIndex : findRequestedTimeStampIndex,
		getByTimeStamp: getByTimeStamp
	}
}


module.exports = measurementModel;