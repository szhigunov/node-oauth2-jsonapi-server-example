'use strict';
const jsonApi = require('jsonapi-server');

jsonApi.listen = (port, callback) => {
    jsonApi.setConfig({
        base: "rest",
  		port: 4000,
    });

    jsonApi.start();

    if (callback) {
        process.nextTick(callback);
    }

    jsonApi.define({
        resource: "articles",
        handlers: new jsonApi.MemoryHandler(),
        attributes: {
            title: jsonApi.Joi.string().required(),
            url: jsonApi.Joi.string().uri(),
            body: jsonApi.Joi.string().required(),
            publishedAt: jsonApi.Joi.date().iso() 
        },
        examples: [{ 
		   id: '11', // should be a string for memory handler
		   type: 'articles', // should be same as "resource"
		   title: 'Hello World',
		   body: 'Exciting'
		 }, {
		   id: '12', // should be a string for memory handler
		   type: 'articles', // should be same as "resource"
		   title: 'Fresh News',
		   body: 'Intresting'
		 }]
    });
}

module.exports = jsonApi;