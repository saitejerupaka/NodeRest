var should = require('chai').should();

describe("Measurement Model Test", function(){
	describe("get by timestamp", function(){
		beforeEach(function(){
			this.model = require('../models/measurementModel')();
			this.model.save({
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : 33
                        });

			this.model.save({
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                        });
			this.model.save({
                        'timestamp': '2015-10-01T16:40:00.000Z',
                        'temperature' : 45
                        });
			
			this.model.save({
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : 35
                        });
			
		})
		it('should get one with exact timestamp', function(){
			
			
			var measurements = this.model.findByTimeStamp('2015-09-01T16:00:00.000Z');

			var expected = {
				'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : 34
                    };
                   
             measurements.should.eql(expected);
			
		})
		it('should get 1 on a day', function(){
			
			
			var measurements = this.model.getByDay('2015-10-01');

			var expected = [{
                        'timestamp': '2015-10-01T16:40:00.000Z',
                        'temperature' : 45
                        }];
             measurements.should.eql(expected);
			
		})
		it('should get all  3 on a day', function(){
			
			
			var measurements = this.model.getByDay('2015-09-01');

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
})
