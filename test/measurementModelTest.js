var should = require('chai').should();
var sinon = require('sinon');

describe("Measurement Model Test", function(){
	describe("get and updateMetric timestamp", function(){
		beforeEach(function(){
			this.model = require('../models/measurementModel')();
			var callback = function(){};
			this.model.save({
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 33
                        }, callback);

			this.model.save({
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                        }, callback);
			this.model.save({
                        'timestamp': '2015-10-01T16:40:00.000Z',
                        'temperature' : 45
                        }, callback);
			
			this.model.save({
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
                        },callback);
			
		})
		it('should find one with exact timestamp', function(){
			
			
			var measurements = this.model.findByTimeStamp('2015-09-01T16:00:00.000Z');

			var expected = {
				'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                    };
                   
             measurements.should.eql(expected);
			
		})
		it('should get empty array if no timestamp found', function(){
			
			var callback = sinon.spy();
			this.model.getByDay('2015-11-01T16:00:00.000Z', callback);

			var expected = [];
                   
             callback.calledWith(expected).should.eql(true);
			
		})
		it('should get 1 on a day', function(){
			
			var callback = sinon.spy();
			this.model.getByDay('2015-10-01T16:40:00.000Z', callback);

			var expected = [{
                        'timestamp': '2015-10-01T16:40:00.000Z',
                        'temperature' : 45
                        }];
             callback.calledWith(expected).should.eql(true);
			
		})
		it('should get all  3 on a day', function(){
			
			
			var callback = sinon.spy();
			this.model.getByDay('2015-09-01', callback);

			var expected = [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 33
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
                        }];
             callback.calledWith(expected).should.eql(true);
			
		})
		it('should update metric with timestamp', function(){
			var callback = function(){};
			var measurementValue = {
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 98
                        };
			this.model.updateMetric(0, measurementValue,callback);
			var measurements = this.model.getAll();
			var expected = [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 98
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                        },
                        {
                        'timestamp': '2015-10-01T16:40:00.000Z',
                        'temperature' : 45
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
                        }];
            measurements.should.eql(expected);
		})
		it('should remove measurement with timestamp', function(){
			var callback = function(){};
			this.model.remove('2015-10-01T16:40:00.000Z',callback);
			var measurements = this.model.getAll();
			var expected = [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 33
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
                        }];
            measurements.should.eql(expected);
		})

	})

	describe('find range of timestamp', function(){
		beforeEach(function(){
			this.model = require('../models/measurementModel')();
			var callback = function(){};
			this.model.save({
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 33
                        }, callback);

			this.model.save({
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                        }, callback);
			this.model.save({
                        'timestamp': '2015-10-01T16:40:00.000Z',
                        'temperature' : 45
                        }, callback);
			
			this.model.save({
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
                        }, callback);
			
		})
		it('should select values in Range returns no elements', function(){
			var from = '2016-10-01T16:40:00.000Z';
			var to = '2017-09-01T16:30:00.000Z'
			var measurements = this.model.findValuesInRange(from, to);
			var expected = [];
			expected.should.eql(measurements);


		})
		it('should select values in Range returns one element', function(){
			var from = '2015-05-01T16:40:00.000Z';
			var to = '2015-09-01T16:30:00.000Z'
			var measurements = this.model.findValuesInRange(from, to);
			var expected = [{
				'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
			}];
			expected.should.eql(measurements);


		})
		it('should select values in Range returns Two element', function(){
			var from = '2015-05-01T16:40:00.000Z';
			var to = '2015-09-01T16:40:00.000Z'
			var measurements = this.model.findValuesInRange(from, to);
			var expected = [{
				'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
			},
			{
				'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
			}];
			expected.should.eql(measurements);


		})
		it('should select values in Range returns all element', function(){
			var from = '2015-05-01T16:40:00.000Z';
			var to = '2016-09-01T16:40:00.000Z'
			var measurements = this.model.findValuesInRange(from, to);
			var expected = [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 33
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                        },
                        {
                        'timestamp': '2015-10-01T16:40:00.000Z',
                        'temperature' : 45
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
                        }];
			expected.should.eql(measurements);


		})
	})
})
