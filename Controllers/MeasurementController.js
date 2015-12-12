
var measurementController = function(Measurements)
{
	var post = function(req, res){
			var measurement = req.body;
			Measurements.save(measurement);
			res.status(200);
		};

		return {
			post: post
		}
};

module.exports = measurementController;
