var should = require('chai').should();
var sinon = require('sinon');
var constants = require('../utilities/constants')();

describe('MiddleWare Tests', function(){
	before(function(){
		this.middlewarePath = '../routes/middleware';
	})
	describe('Measurement Tests', function(){
		before(function(){
			var testContext = this;
			testContext.req = {
				params: {
					time: '2015-09-01T16:00:00.000Z'
				}
			};
			testContext.res = {};
			testContext.next = sinon.spy();
			testContext.MeasurementModel = {
				findRequestedTimeStampIndex : function(args){
					return 1;
				}
			}
			testContext.middleware = require('../routes/middleware')(testContext.MeasurementModel);
		});
		it('should find measurement requested by timestamp and add to request object', function(){
			var testContext = this;
			testContext.req = {
				params: {
					time: '2015-09-01T16:00:00.000Z'
				}
			};
			testContext.res = {};
			testContext.next = sinon.spy();
			testContext.MeasurementModel = {
				findRequestedTimeStampIndex : function(args){
					return 1;
				},
				findByTimeStamp: function(args){
					return{
						'timestamp': '2015-09-01T16:00:00.000Z',
						'temperature': '32'
					}
				}
			}
			testContext.middleware = require('../routes/middleware')(testContext.MeasurementModel);
			this.middleware.findByRequestedTimeStamp(this.req, this.res, this.next);

			var expected = {
						'timestamp': '2015-09-01T16:00:00.000Z',
						'temperature': '32'
					};
			this.req['measurement'].should.eql(expected);
			this.req['measurementRequestedId'].should.equal(1);
			this.next.calledOnce.should.equal(true);
		})

		it('should send error if timestamp not found', function(){
			var testContext = this;
			testContext.req = {
				params: {
					time: '2015-09-01T16:00:00.000Z'
				}
			};
			testContext.res = {
				status: sinon.spy(),
				send: sinon.spy()
			};
			testContext.next = sinon.spy();
			testContext.MeasurementModel = {
				findRequestedTimeStampIndex : function(args){
					return -1;
				}
			}
			testContext.middleware = require('../routes/middleware')(testContext.MeasurementModel);
			this.middleware.findByRequestedTimeStamp(this.req, this.res, this.next);

			this.res.status.calledWith(404).should.equal(true);
			this.res.send.calledWith(constants['TimeStampNotFound']).should.equal(true);
		})

		it('should raise error if request parameters are invalid', function(){
			var req = {
				params: {
					time: 'sa'
				}
			};
			var res = {
				status: sinon.spy(),
				send: sinon.spy()
			};
			var next = sinon.spy();
			var MeasurementModel = {
				findRequestedTimeStampIndex : function(args){
					return 1;
				}
			}
			var middleware = require('../routes/middleware')(MeasurementModel);
			middleware.findByRequestedTimeStamp(req, res, next);

			res.status.calledWith(400).should.equal(true, "Status is wrong-" + res.status.args[0]);
			res.send.calledWith(constants['InvalidRequestParam']).should.equal(true, "Wrong Message sent");
		})
		
	})
	
	describe('Statistics Tests', function(){
		it('should get all values in fromDate to toDate', function(){
			var MeasurementModel = {
				findValuesInRange: function(from, to){
					return [];
				}
			}
			var middleware = require(this.middlewarePath)(MeasurementModel);

			var req = {
				query:{
					fromDate: '2014-09-01T16:40:00.000Z',
					toDate: '2015-09-01T16:40:00.000Z'
				}
			};
			var res = {};
			var next = sinon.spy();
			middleware.findMeasurementsInRange(req, res, next);

			req['measurementsInRange'].should.eql([]);
			next.calledOnce.should.equal(true);

		})
	})
})