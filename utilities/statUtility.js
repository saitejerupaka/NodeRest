
var statUtility = function(){
	var lodash = require('lodash');
	var min = function(metricMeasurements){
		return lodash(metricMeasurements).min();
	}

	var max = function(metricMeasurements){
		return lodash(metricMeasurements).max();
	}

	var average = function(metricMeasurements){
		var average =  (lodash(metricMeasurements).sum())/metricMeasurements.length;
		return average.toFixed(3);
	}

	return {
		min : min,
		max: max,
		average: average
	}
}

module.exports = statUtility;