var MeasurementModel = function(){
	Measurement = [];
	var save = function(arguments)
	{
		Measurement.push(arguments);
	}

	return {
		save : save
	}
}


module.exports = MeasurementModel;