var should = require('chai').should();
var sinon = require('sinon');
var constants = require('../controllers/constants')();

describe('MiddleWare Tests', function(){
	before(function(){
		var testContext = this;
		testContext.req = {
			params: {
				time: '2015–09–01T16:00:00.000Z'
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
	it('should find indexof requested by timestamp and add to request object', function(){
		var testContext = this;
		testContext.req = {
			params: {
				time: '2015–09–01T16:00:00.000Z'
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
		this.middleware.findByRequestedTimeStamp(this.req, this.res, this.next);


		this.req['measurementRequestedId'].should.equal(1);
		this.next.calledOnce.should.equal(true);
	})

	it('should send error if timestamp not found', function(){
		var testContext = this;
		testContext.req = {
			params: {
				time: '9090'
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
})