var constants = function (){
	return {
	'DuplicateTimeStamp' : 'Cannot save for same timestamp, use put/patch for update',
	'TimeStampNotFound': 'TimeStamp not found in request',
	'InvalidRequestParam': 'Invalid Request Parameters',
	'InvalidValues': 'Invalid values for metrics',
	'MismatchedTimeStamps': 'TimeStamps are mismatched in update request and values'
	};
}

module.exports = constants;