const express = require('express');
const bodyParser = require('body-parser');
const url  = require('url');
const oauthserver = require('oauth2-server');
const proxy = require('proxy-middleware');

const model = require('../models/AuthModel');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = oauthserver({
  model, // See below for specification
  grants: ['password'],
  debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.all('*', app.oauth.authorise(), proxy('http://localhost:4000'));

app.use(app.oauth.errorHandler());
// express doesn' have close() method
module.exports = require('http').createServer(app);