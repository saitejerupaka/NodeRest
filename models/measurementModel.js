var measurementModel = function() {
    var lodash = require('lodash');
    Measurement = [];

    var save = function(measurement, callback) {
        Measurement.push(measurement);
        callback();
    }

    var findByTimeStamp = function(timestamp) {
        var found = lodash(Measurement).find({
            'timestamp': timestamp
        });
        return found;
    }

    var getAll = function() {
        return Measurement;
    }

    var getByDay = function(timestamp, callback) {
        var response = [];
        var pushAllWithSameTimeStamp = function(element) {
            if (lodash(element['timestamp']).startsWith(timestamp)) {
                response.push(element);
            }
        }
        lodash(Measurement).forEach(pushAllWithSameTimeStamp).value();

       callback(response);


    };

    var findRequestedTimeStampIndex = function(timestamp) {
        var index = lodash(Measurement).findIndex({
            'timestamp': timestamp
        });
        return index;
    };

    var updateMeasurement = function(index, measurementValue, callback) {
        Measurement[index] = measurementValue;
        callback();
    };

    var updateMetric = function(index, measurementValue, callback) {
        if (measurementValue['timestamp']) {
            delete measurementValue['timestamp'];
        }
        for (var metric in measurementValue) {
            Measurement[index][metric] = measurementValue[metric];

        }

        callback();
    }

    var remove = function(timestamp, callback) {
        Measurement = lodash(Measurement).reject({
            'timestamp': timestamp
        }).value();
        callback();
    }

    var findValuesInRange = function(from, to) {
        var filterBy = function(element) {
            return element['timestamp'] >= from && element['timestamp'] < to;

		}
        return lodash(Measurement).filter(filterBy).value();


    }

    return {
        save: save,
        findByTimeStamp: findByTimeStamp,
        getAll: getAll,
        findRequestedTimeStampIndex: findRequestedTimeStampIndex,
        getByDay: getByDay,
        updateMeasurement: updateMeasurement,
        updateMetric: updateMetric,
        remove: remove,
        findValuesInRange: findValuesInRange
    }
}


module.exports = measurementModel;