var assert = require('assert');
var duck = require('../duck-type').namespace();

duck.type('Integer', function (value) {
	return duck(value).is(Number) && value % 1 === 0;
})

module.exports = duck.bind({
	test: function(value) {
		duck(value).is(Integer);
		console.log(111);
	},
})