var should = require('chai').should();
var sinon = require('sinon');
var constants = require('../Controllers/Constants')();

describe('Measurement Controller Tests', function(){
	describe('Canary', function(){
		it('Canary Test', function(){
				true.should.equal(true);
		});
	});

	describe('Post Measurement', function(){
		before(function(){
			var testContext = this;
			testContext.MeasurementModel = {
                save: function(arg){},
                findByTimeStamp: function(args){
                    return false;
                }};
			testContext.measurementController = require('../Controllers/MeasurementController')(testContext.MeasurementModel);

		});
		it('should save a metric', function(){

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
				status : sinon.spy(),
                send: sinon.spy()
			}
			measurementController.post(req, res);
			res.status.calledWith(200).should.equal(true, 'Bad Status ' + res.status.args[0]);
            res.send.calledWith().should.equal(true);
		});
		it('should not save on same timestamp', function(){
            this.MeasurementModel = {
                measurement :[{
                        'TimeStamp': '2015',
                        'Metrics': {
                            'Temperature' : 32
                            }
                        }],
                save : function(arg){},
                findByTimeStamp: function(args){
                    return true;
                }
            }
            var measurementController = require('../Controllers/MeasurementController')(this.MeasurementModel);
            var req = {
                body: {
                        'TimeStamp': '2015',
                        'Metrics': {
                            'Temperature' : 22
                        }
                    }
                }
            var res = {
                status : sinon.spy(),
                send: sinon.spy()
            }

            measurementController.post(req, res);

            res.status.calledWith(500).should.equal(true, 'Status responded is not correct' + res.status.args[0]);
            res.send.calledWith(constants['DuplicateTimeStamp']).should.equal(true);
		})

        it('should not save if no timestamp', function(){
            var req = {
                body: {
                        'Metrics': {
                            'Temperature' : 22
                        }
                    }
                }
            var res = {
                status : sinon.spy(),
                send: sinon.spy()
            }

            this.measurementController.post(req, res);

            res.status.calledWith(500).should.equal(true, 'Status responded is not correct-' + res.status.args[0]);
            res.send.calledWith(constants['TimeStampNotFound']).should.equal(true);
        })
	})
    
    describe('Get Measurements', function(){
        before(function(){
            var testContext = this;
            testContext.MeasurementModel = {
                getAll: function(){
                    var Measurement  = [{
                        'TimeStamp': '2015',
                        'Metrics': {
                            'Temperature' : 32
                        }
                    }];
                    return Measurement;
                }
            };
            testContext.measurementController =
                         require('../Controllers/MeasurementController')(testContext.MeasurementModel);
            testContext.req = {};
            testContext.res = {
                json: sinon.spy()
            };

        });
        it('should get empty array if no measurements', function(){
            var MeasurementModel = {
                getAll: function(){
                    var Measurement  = [];
                    return Measurement;
                }
            };
            var measurementController =
                         require('../Controllers/MeasurementController')(MeasurementModel);
            measurementController.get(this.req, this.res);
            this.res.json.calledWith([]).should.equal(true);
        })

        it('should get all measurements', function(){
            
            this.measurementController.get(this.req, this.res);
            var expected = [{
                        'TimeStamp': '2015',
                        'Metrics': {
                            'Temperature' : 32
                        }
                    }];
            this.res.json.calledWith(expected).should.equal(true);
        });
    })



});
