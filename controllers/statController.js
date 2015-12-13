var lodash = require('lodash');
var statController = function(){
	var get = function(req, res){
			var stats = [];
			stats.push(req.query.stat);
			stats = lodash(stats).flattenDeep().value();

			var metrics = [];
			metrics.push(req.query.metric);
			metrics = lodash(metrics).flattenDeep().value();
			
			var measurementsInRange = req.measurementsInRange;
			if(measurementsInRange.length <= 0){
			 	res.json([]);
			 	return;
			}

			//Remove Metric if not saved previously
			var metricsFilter = function(metric){
				var savedMetrics = lodash(measurementsInRange[0]).keys().value();
				var foundAt = lodash(savedMetrics).findIndex(function(element){
					return element === metric;
				});
				if(foundAt === -1){
					return false;
				}
				return true;
			}

			metrics = lodash(metrics).filter(metricsFilter).value();
			if(metrics.length <= 0){
				res.json([]);
				return;
			}


			var statUtility = require('../utilities/statUtility')();

			var measureStats = function(metric){
				var isEmpty = function(element){
					var floatRegex = /^[+-]?\d+(\.\d+)?$/;
					return element.length !== 0 && floatRegex.test(element);
				}
				var metricMeasurements = lodash(measurementsInRange).pluck(metric).filter(isEmpty).value();
			
				var measureStatForMetric = function(statistic)
				{	
					var value = statUtility[statistic](metricMeasurements);
					return {
						'metric': metric,
						'stat': statistic,
						'value': value
					};
				};
				return lodash(stats).map(measureStatForMetric).value();
			}

			res.json(lodash(metrics).map(measureStats).flattenDeep().value());

			
		};

		return {
			get:get
		}
}

module.exports = statController;