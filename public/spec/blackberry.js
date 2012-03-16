describe("blackberry", function() {
	it('should exist', function () {
		expect(blackberry).toBeDefined();
	});
});

describe("blackberry extensions", function() {
	it('app should exist', function () {
		expect(blackberry.app).toBeDefined();
	});

	it('invoke should exist', function () {
		expect(blackberry.invoke).not.toBeDefined();
	});
});

describe("webworks", function() {
	it('should exist', function () {
		expect(webworks).toBeDefined();
	});
});