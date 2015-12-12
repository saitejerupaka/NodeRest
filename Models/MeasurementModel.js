var lodash = require('lodash');
var MeasurementModel = function(){
	Measurement = [];
	var save = function(arguments)
	{
		Measurement.push(arguments);
		//console.log(Measurement);
	}

	var findByTimeStamp = function(arguments)
	{
		//console.log(arguments);
		var found = lodash(Measurement).find({ 'TimeStamp' : arguments });
		//console.log(found);
		return found;
	}

	var getAll = function(){
		return Measurement;
	}

	var getByTimeStamp = function(arguments){
		console.log(arguments);
		return Measurement[arguments];
	}

	var findRequestedTimeStampIndex = function(arguments)
	{
		var index = lodash(Measurement).findIndex({ 'TimeStamp' : arguments });
		console.log(index);
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


module.exports = MeasurementModel;