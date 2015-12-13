var constants = require('./constants')();
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

	return {
		validateMeasurement: validateMeasurement
	}
}

module.exports = controllerHelper;