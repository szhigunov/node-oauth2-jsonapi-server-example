const server = require('../src/server/jsonapi-server');
const authServer = require('../src/auth/');

const fetch = require('node-fetch');
const co = require('co');
const assert = require('chai').assert;
const port = 4000;

//Test should be stupid

describe('REST API', () => {
    before(done => server.listen(port, done)); // start server ( prerequisites);
    after(() => server.close());

    it('/articles', co.wrap(function*() {
        var response = yield fetch('http://localhost:' + port + '/rest/articles');
        assert(response.ok, 'REST API response');
        var json = yield response.json();
        // console.log('length: '+ json.data.length)
        assert(json.data.length >= 1, 'has data');
    }));

    describe('Auth', () => {
        before(done => authServer.listen(6000, done));
        after(() => authServer.close());

        it('should authorize', co.wrap(function*() {
            const authResponse = yield fetch('http://localhost:6000/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // real-life OAuth2 requests are conducted over HTTPS only
                    'Authorization': 'Basic ' + new Buffer('thom:nightworld').toString('base64')
                },
                body: 'grant_type=password&username=thomseddon&password=nightworld'
            });

            assert( authResponse.ok, '/login response');
            const authJson = yield authResponse.json(); // all methods in generators are async 
            assert( authJson.access_token, 'no tokent was sent');

            const articleResponse = yield fetch('http://localhost:6000/rest/articles/11',{
            	headers: {
            		'Authorization': 'Bearer ' + authJson.access_token
            	}
            });
            console.log(articleResponse);
            assert(articleResponse.ok , 'response from articles/11');
            const articleJson = yield articleResponse.json(); // all methods in generators are async 
            assert(articleJson.data.id === '11', 'should have data');
        }));
    });
});
