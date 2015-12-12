var should = require('chai').should();
var sinon = require('sinon');

describe('Measurement Controller Tests', function(){
	describe('Canary', function(){
		it('Canary Test', function(){
				true.should.equal(true);
		});
	});

	describe('Post Measurement', function(){
		before(function(){
			this.MeasurementModel = {save: function(arg){}};
			this.measurementController = require('../Controllers/MeasurementController')(this.MeasurementModel);

		});
		it('should save  one metric temperature', function(){

			var measurementController = this.measurementController;
			var req = {
					body: {
						'TimeStamp': '2015',
						'Metrics': {
							'Temperature' : 32
						}
					}
				};
			var res = {
				status : sinon.spy()
			}
			measurementController.post(req, res);
			res.status.calledWith(200).should.equal(true, 'Bad Status ' + res.status.args[0]);
		})


	})
});
