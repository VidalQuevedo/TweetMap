describe("MongoDB setup", function(){
	it("there should be a server running", function(next){
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect('mongodb://127.0.0.1:27017/tweetmap', function(err, db){
			expect(err).toBe(null);
			expect(db).toBeDefined();
			next();
		});
	});
});