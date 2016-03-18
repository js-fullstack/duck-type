describe('match test', function() {
    var schema = duckType.create();
    
    it('happy path',function() {
    	schema(Number).match(1);
    	schema.assert(1).is(Number);
    });

    it('multiple arguments path',function() {
    	schema(Number,String).match(1,'hello');
    	schema.assert(1,'hello').are(Number,String);

    	assert.throws(function() {
    		schema(Number,String).match(1,1);
    	});

    	assert.throws(function() {
    		schema.assert(1 ,1).are(Number,String);
    	});
    });
});