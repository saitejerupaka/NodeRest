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
			if(!floatRegex.test(measurement[metric]))
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