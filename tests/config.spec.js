describe("Configuration setup", function(){
	it("should load local configurations", function(next){
		var config = require('../config.js')('local');
		expect(config.mode).toBe('local');
		next();
	});
});