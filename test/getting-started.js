const server = require('../src/hello-server');
const fetch = require('node-fetch');
const assert = require('chai').assert;
const port = 4000;

describe('hello world', () => {
	before(done => server.listen(port,done)); // start server ( prershoulequisites);
	after(() => server.close());

	it('should respond', done => {
		fetch('http://localhost:'+ port+ '/').then(response => {
			assert(response.ok);  // expect server to be ok response (200) 
			done();
		})
	})
});