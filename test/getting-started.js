const server = require('../src/server/hello-server');

const fetch = require('node-fetch');
const co = require('co');
const assert = require('chai').assert;
const port = 4000;

//Test should be stupid
describe('hello world', () => {
	before(done => server.listen(port,done)); // start server ( prerequisites);
	after(() => server.close());

	it('should respond', co.wrap( function* () {
		var response = yield fetch('http://localhost:'+ port+ '/');
		assert(response.ok, 'hello world response');
		var text = yield response.text();
		assert(text === 'Hello World', 'Hello World string');
	}));

});