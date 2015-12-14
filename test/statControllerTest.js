var should = require('chai').should();
var sinon = require('sinon');

describe('Statistics Controller Test', function(){
	beforeEach(function(){
		this.controller = require('../controllers/statController')();
	});
	it('should return empty array if no measurements found in range', function(){
		var req = {
			query:{
				stat: 'min',
				metric: 'temp'
			},
			measurementsInRange: []

		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		res.json.calledOnce.should.equal(true);
		res.json.calledWith([]).should.equal(true);
	})
	it('should return array(1)  if one stat, one metric given', function(){
		var req = {
			query:{
				stat: 'min',
				metric: 'temperature'
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : '33'
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34'
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = [{
			'metric': 'temperature',
			'stat': 'min',
			'value': '33'	
		}]
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.equal(true);
	})
	
	it('should return empty array if metric not found', function(){
		var req = {
			query:{
				stat: 'min',
				metric: 'dew'
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : ''
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34'
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = []
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.equal(true);
	})

	it('should return empty array if metric is timestamp', function(){
		var req = {
			query:{
				stat: 'min',
				metric: 'timestamp'
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : ''
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34'
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = []
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.equal(true);
	})

	it('should return array(1) even if sparsly populated', function(){
		var req = {
			query:{
				stat: 'min',
				metric: 'temperature'
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : ''
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34'
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = [{
			'metric': 'temperature',
			'stat': 'min',
			'value': '34'	
		}]
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.equal(true);
	})
	it('should return array(2) with two stats for one metric', function(){
		var req = {
			query:{
				stat: ['min','max'],
				metric: 'temperature'
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : ''
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34'
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = [{
			'metric': 'temperature',
			'stat': 'min',
			'value': '34'	
		},
		{
			'metric': 'temperature',
			'stat': 'max',
			'value': '35'	
		}]
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.equal(true);
	})
	it('should return array(4) with two stats and two metric', function(){
		var req = {
			query:{
				stat: ['average','min'],
				metric: ['temperature', 'dew']
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : '',
                        'dew': '18.2'
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34',
                        'dew': ' '
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35',
                        'dew': '-29'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = [{
			'metric': 'temperature',
			'stat': 'average',
			'value': '34.500'
		},
		{
			'metric': 'temperature',
			'stat': 'min',
			'value': '34'	
		},
		{
			'metric': 'dew',
			'stat': 'average',
			'value': '-5.400'

		},
		{
			'metric': 'dew',
			'stat': 'min',
			'value': '-29'	
		}]
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.eql(true);
	})
	it('should return array(4) with 2 stats & 3 metric, 1 metric is never saved', function(){
		var req = {
			query:{
				stat: ['average','min'],
				metric: ['temperature', 'dew', 'pre']
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : '',
                        'dew': '18.2'
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34',
                        'dew': ' '
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35',
                        'dew': '-29'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = [{
			'metric': 'temperature',
			'stat': 'average',
			'value': '34.500'
		},
		{
			'metric': 'temperature',
			'stat': 'min',
			'value': '34'	
		},
		{
			'metric': 'dew',
			'stat': 'average',
			'value': '-5.400'

		},
		{
			'metric': 'dew',
			'stat': 'min',
			'value': '-29'	
		}]
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.eql(true);
	})
	

	it('should return array(6) with 3 stats and 2 metric', function(){
		var req = {
			query:{
				stat: ['average','max', 'min'],
				metric: ['temperature', 'dew']
			},
			measurementsInRange: [{
                        'timestamp': '2015-09-01T16:40:00.000Z',
                        'temperature' : '',
                        'dew': '18.2'
                        },
                        {
                        'timestamp': '2015-09-01T16:00:00.000Z',
                        'temperature' : '34',
                        'dew': ' '
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '35',
                        'dew': '-29'
                        },
                        {
                        'timestamp': '2015-09-01T16:30:00.000Z',
                        'temperature' : '0',
                        'dew': '0.8'
                        }]
		};
		var res = {
			json: sinon.spy()
		}

		this.controller.get(req, res);

		var expected = [{
			'metric': 'temperature',
			'stat': 'average',
			'value': '23.000'
		},
		{
			'metric': 'temperature',
			'stat': 'max',
			'value': '35'	
		},
		{
			'metric': 'temperature',
			'stat': 'min',
			'value': '0'	
		},
		{
			'metric': 'dew',
			'stat': 'average',
			'value': '-3.333'

		},
		{
			'metric': 'dew',
			'stat': 'max',
			'value': '18.2'	
		},
		{
			'metric': 'dew',
			'stat': 'min',
			'value': '-29'	
		}]
		res.json.calledOnce.should.equal(true);
		res.json.calledWith(expected).should.eql(true);
	})
})