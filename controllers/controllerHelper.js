var constants = require('../utilities/constants')();
var controllerHelper = function()
{
	var validateMeasurement = function(measurement){
		var isValid = true;
		for(var metric in measurement){
			if(metric  === 'timestamp') {
				continue;
			}
			var floatRegex = /^[+-]?\d+(\.\d+)?$/;
			if( measurement[metric] && measurement[metric].length !== 0 && !floatRegex.test(measurement[metric]))
			{
				isValid = false;
				break;
			}
		}
		return isValid;
	}

	var validateTimeStamp = function(timestamp){
		var dateTimeRegex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
		if(!dateTimeRegex.test(timestamp))
		{
			return false;
		}
		return true;
	}

	return {
		isValidMeasurement: validateMeasurement,
		isValidTimeStamp: validateTimeStamp
	}
}

module.exports = controllerHelper;