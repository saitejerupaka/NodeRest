var should = require('chai')
    .should();
var sinon = require('sinon');
var constants = require('../utilities/constants')();

describe('Measurement Controller Tests', function () {
    before(function () {
        this.controllerPath = '../controllers/measurementController';
    })
    describe('Canary', function () {
        it('Canary Test', function () {
            true.should.equal(true);
        });
    });

    describe('Post Measurement', function () {
        before(function () {
            var testContext = this;
            testContext.MeasurementModel = {
                save: function (measurement, callback) {
                    callback();
                },
                findByTimeStamp: function (args) {
                    return false;
                }
            };
            testContext.measurementController = require('../controllers/measurementController')(testContext.MeasurementModel);

        });
        it('should save a metric temperature with value 32', function () {

            var measurementController = this.measurementController;
            var req = {
                body: {
                    'timestamp': '2015',
                    'temperature': '32'
                }
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy(),
                location: sinon.spy()
            }
            var locationHeader = '/measurements/2015'
            measurementController.post(req, res);
            res.status.calledWith(201)
                .should.equal(true, 'Bad Status ' + res.status.args[0]);
            res.location.calledWith(locationHeader)
                .should.equal(true);
            res.send.calledWith()
                .should.equal(true);
            res.send.calledOnce.should.equal(true);

        });
        it('should save a metric with value 32.32', function () {

            var measurementController = this.measurementController;
            var req = {
                body: {
                    'timestamp': '2015',
                    'temperature': '32.32'
                }
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy(),
                location: sinon.spy()
            }
            var locationHeader = '/measurements/2015'
            measurementController.post(req, res);
            res.status.calledWith(201)
                .should.equal(true, 'Bad Status ' + res.status.args[0]);
            res.location.calledWith(locationHeader)
                .should.equal(true);
            res.send.calledWith()
                .should.equal(true);
            res.send.calledOnce.should.equal(true);
        });
        it('should not save on same timestamp', function () {
            this.MeasurementModel = {
                measurement: [{
                    'timestamp': '2015',
                    'temperature': 32
                }],
                save: function (arg) {},
                findByTimeStamp: function (args) {
                    return true;
                }
            }
            var measurementController = require('../controllers/measurementController')(this.MeasurementModel);
            var req = {
                body: {
                    'timestamp': '2015',
                    'temperature': '32'
                }
            }
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }

            measurementController.post(req, res);

            res.status.calledWith(400)
                .should.equal(true, 'Status responded is not correct' + res.status.args[0]);
            res.send.calledWith(constants['DuplicateTimeStamp'])
                .should.equal(true);
            res.send.calledOnce.should.equal(true);
        })
        it('should save a metric with value -273.30', function () {

            var measurementController = this.measurementController;
            var req = {
                body: {
                    'timestamp': '2015',
                    'temperature': '-273.30'
                }
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy(),
                location: sinon.spy()
            }
            var locationHeader = '/measurements/2015'
            measurementController.post(req, res);
            res.status.calledWith(201)
                .should.equal(true, 'Bad Status ' + res.status.args[0]);
            res.location.calledWith(locationHeader)
                .should.equal(true);
            res.send.calledWith()
                .should.equal(true);
            res.send.calledOnce.should.equal(true);
        });
        it('should not save if no timestamp', function () {
            var req = {
                body: {
                    'temperature': 32
                }
            }
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }

            this.measurementController.post(req, res);

            res.status.calledWith(400)
                .should.equal(true, 'Status responded is not correct-' + res.status.args[0]);
            res.send.calledWith(constants['TimeStampNotFound'])
                .should.equal(true);
            res.send.calledOnce.should.equal(true);
        })

        it('should not save if timestamp value is invalid', function () {
            var req = {
                body: {
                    'timestamp': '20111',
                    'temperature': 32
                }
            }
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }

            this.measurementController.post(req, res);

            res.status.calledWith(400)
                .should.equal(true, 'Status responded is not correct-' + res.status.args[0]);
            res.send.calledWith(constants['TimeStampNotFound'])
                .should.equal(true);
            res.send.calledOnce.should.equal(true);
        })

        it('should not save if metrics are not float values', function () {
            var req = {
                body: {
                    'timestamp': '2015-10-01',
                    'temperature': 'sa'
                }
            }
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }

            this.measurementController.post(req, res);

            res.status.calledWith(400)
                .should.equal(true, 'Status responded is not correct-' + res.status.args[0]);
            res.send.calledWith(constants['InvalidValues'])
                .should.equal(true);
            res.send.calledOnce.should.equal(true);
        })
    })

    describe('Get Measurements', function () {
        before(function () {
            var testContext = this;
            testContext.MeasurementModel = {
                getAll: function () {
                    var Measurement = [{
                        'timestamp': '2015',
                        'temperature': 32
                    }];
                    return Measurement;
                }
            };
            testContext.measurementController =
                require('../controllers/measurementController')(testContext.MeasurementModel);
            testContext.req = {};
            testContext.res = {
                json: sinon.spy()
            };

        });
        it('should get empty array if no measurements', function () {
            var MeasurementModel = {
                getAll: function () {
                    var Measurement = [];
                    return Measurement;
                }
            };
            var measurementController =
                require('../controllers/measurementController')(MeasurementModel);
            measurementController.get(this.req, this.res);
            this.res.json.calledWith([])
                .should.equal(true);
        })

        it('should get all measurements', function () {

            this.measurementController.get(this.req, this.res);
            var expected = [{
                'timestamp': '2015',
                'temperature': 32
            }];
            this.res.json.calledWith(expected)
                .should.equal(true);
        });
    })

    describe('Get Measurement by TimeStamp', function () {
        it('should send invalid timestamp', function(){
            var req = {
                params: {
                    time: '000Z'
                }
            }
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            var MeasurementModel = {

                getByDay: function (args) {
                    return [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature': 33
                    }];
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);
            measurementController.getByTimeStamp(req, res);
           
            res.status.calledWith(400).should.equal(true, 'Status set is mismatched' + res.status.args[0]);
            res.send.calledWith()
                .should.equal(true, "Measurement is not equals expected");
            res.send.calledOnce.should.equal(true);
        })
        it('should send 404 if timestamp not found', function(){
            var req = {
                params: {
                    time: '2015-09-01T16:40:00.000Z'
                }
            }
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            var MeasurementModel = {

                getByDay: function (args) {
                    return [];
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);
            measurementController.getByTimeStamp(req, res);
            
            res.status.calledWith(404).should.equal(true, 'Status set is mismatched' + res.status.args[0]);
            res.send.calledWith()
                .should.equal(true, "Measurement is not equals expected");
            res.send.calledOnce.should.equal(true);
        })
        it('should get  one measurement for timestamp 2015-09-01T16:00:00.000Z', function () {
            var req = {
                params: {
                    time: '2015-09-01T16:00:00.000Z'
                }
            }
            var res = {
                status: sinon.spy(),
                json: sinon.spy()
            }
            var MeasurementModel = {

                getByDay: function (args) {
                    return [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature': 33
                    }];
                }
            }
            var measurementController = require(this.controllerPath)(MeasurementModel);
            measurementController.getByTimeStamp(req, res);
            var expected = {
                'timestamp': '2015-09-01T16:40:00.000Z',
                'temperature': 33
            };

            res.json.calledWith(expected)
                .should.equal(true, "Measurement is not equals expected");

        })
        it('should get  all measurements for timestamp 2015-09-01', function () {
            var req = {
                params: {
                    time: '2015-09-01'
                }
            }
            var res = {
                status: sinon.spy(),
                json: sinon.spy()
            }
            var MeasurementModel = {

                getByDay: function (args) {
                    return [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature': 33
                    }, {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature': 34
                    }, {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature': 35
                    }];
                }
            }
            var measurementController = require(this.controllerPath)(MeasurementModel);
            measurementController.getByTimeStamp(req, res);
            var expected = [{
                'timestamp': '2015-09-01T16:40:00.000Z',
                'temperature': 33
            }, {
                'timestamp': '2015-09-01T16:00:00.000Z',
                'temperature': 34
            }, {
                'timestamp': '2015-09-01T16:30:00.000Z',
                'temperature': 35
            }];

            res.json.calledWith(expected)
                .should.equal(true, "Measurement is not equals expected");

        })
    })

    describe('Put Measurement by TimeStamp', function () {
        it('should replace measurement with given', function () {
            var MeasurementModel = {
                updateMeasurement: function (index, value, callback) {callback()}
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'timestamp': '2015',
                    'temperature': '32'
                },
                measurementRequestedId: 1,
                params: {
                    'time': '2015'
                },
                is: function(){return true;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy(),

            }
            measurementController.put(req, res);
            res.status.calledWith(204)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith()
                .should.equal(true);
        })
        it('should not replace if timestamp is different', function () {
            var MeasurementModel = {
                updateMeasurement: function (index, value, callback) {
                    callback();
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'timestamp': '2015-10-13',
                    'temperature': '32'
                },
                measurementRequestedId: 1,
                params: {
                    'time': '2015-10-12'
                },
                is: function(){return true;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            measurementController.put(req, res);
            res.status.calledWith(409)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith(constants['MismatchedTimeStamps'])
                .should.equal(true);
        })
        it('should not replace if metrics are invalid', function () {
            var MeasurementModel = {
                updateMeasurement: function (index, value) {}
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'timestamp': '2015-10-13',
                    'temperature': '32C'
                },
                measurementRequestedId: 1,
                params: {
                    'time': '2015-10-12'
                },
                is: function(){return true;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            measurementController.put(req, res);
            res.status.calledWith(400)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith(constants['InvalidValues'])
                .should.equal(true);
        })
        it('should not change measurement if request doesnt have content type', function () {
            var MeasurementModel = {
                updateMeasurement: function (index, value) {
                    
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'timestamp': '2015-09-02T16:00:00.000Z',
                    'temperature': '32'
                },
                measurementRequestedId: 1,
                params: {
                    'time': '2015-09-02T16:00:00.000Z'
                },
                is: function(){return false;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            measurementController.put(req, res);
            res.status.calledWith(406)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith()
                .should.equal(true);
        })
    })

    describe('Patch Measurement by TimeStamp', function () {
        it('should change metric value', function () {
            var MeasurementModel = {
                updateMetric: function (index, value, callback) {
                    callback();
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'timestamp': '2015-09-02T16:00:00.000Z',
                    'temperature': '32'
                },
                measurementRequestedId: 1,
                params: {
                    'time': '2015-09-02T16:00:00.000Z'
                },
                is: function(){return true;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            measurementController.patch(req, res);
            res.status.calledWith(204)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith()
                .should.equal(true);
        })
        it('should not change metric if request doesnt have content type', function () {
            var MeasurementModel = {
                updateMetric: function (index, value, callback) {
                    callback();
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'timestamp': '2015-09-02T16:00:00.000Z',
                    'temperature': '32'
                },
                measurementRequestedId: 1,
                params: {
                    'time': '2015-09-02T16:00:00.000Z'
                },
                is: function(){return false;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            measurementController.patch(req, res);
            res.status.calledWith(406)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith()
                .should.equal(true);
        })
        
        it('should not change metric with invalid values', function () {
            var MeasurementModel = {
                updateMetric: function (index, value, callback) {
                    callback();
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'temperature': '32C'
                },
                measurementRequestedId: 1,
                measurement: {
                    'timestamp': '2015-09-02T16:00:00.000Z',
                    'temperature': '32'
                },
                params: {
                    'time': '2015-09-02T16:00:00.000Z'
                },
                is: function(){return true;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            }

            measurementController.patch(req, res);
            res.status.calledWith(400)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith(constants['InvalidValues'])
                .should.equal(true);
        })

        it('should not change metric if timestamp mismatch', function () {
            var MeasurementModel = {
                updateMetric: function (index, value, callback) {}
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'timestamp': '2015-09-02T16:40:00.000Z',
                    'temperature': '32'
                },
                measurementRequestedId: 1,
                measurement: {
                    'timestamp': '2015-09-02T16:00:00.000Z',
                    'temperature': '32'
                },
                params: {
                    'time': '2015-09-02T16:00:00.000Z'
                },
                is: function(){return true;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            }
            measurementController.patch(req, res);
            res.status.calledWith(409)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith(constants['MismatchedTimeStamps'])
                .should.equal(true);
        })

        it('should not change if timestamp not found', function () {
            var MeasurementModel = {
                updateMetric: function (index, value, callback) {}
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                body: {
                    'temperature': '32'
                },
                measurementRequestedId: 1,
                measurement: {
                    'timestamp': '2015-09-02T16:00:00.000Z',
                    'temperature': '32'
                },
                params: {
                    'time': '2015-09-02T16:00:00.000Z'
                },
                is: function(){return true;}
            };
            var res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            }
            measurementController.patch(req, res);
            res.status.calledWith(404)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.send.calledOnce.should.equal(true);
            res.send.calledWith(constants['TimeStampNotFound'])
                .should.equal(true);
        })
    })
    describe('Delete Measurement', function () {
        it('should delete the measurement by timestamp', function () {
            var MeasurementModel = {
                remove: function (value, callback) {
                    callback();
                }
            };
            var measurementController = require(this.controllerPath)(MeasurementModel);

            var req = {
                measurement: {
                    'timestamp': '2015-09-02T16:00:00.000Z',
                    'temperature': '32'
                },
                params: {
                    'time': '2015-09-02T16:00:00.000Z'
                }
            };
            var res = {
                status: sinon.spy(),
                json: sinon.spy()
            }
            var expected = {
                'timestamp': '2015-09-02T16:00:00.000Z',
                'temperature': '32'
            };
            measurementController.deleteMeasurement(req, res);
            res.status.calledWith(204)
                .should.equal(true, "Status is not as expected - " + res.status.args[0]);
            res.json.calledOnce.should.equal(true);
            res.json.calledWith(expected)
                .should.equal(true);
        })
    })
});