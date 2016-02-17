'use strict';
var Hapi = require('hapi');
var config = require('./config');

var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    }
  },
  debug: config.debug ? {
    log: [ 'error' ],
    request: [ 'error', 'received', 'response' ]
  } : false
});

server.connection(config.connection);

// Bootstrap Hapi Server Plugins, passes the server object to the plugins.
require('./services/plugins')(server, function (err) {
  if (err) {
    throw err;
  }

  // Add the server routes.
  server.route(require('./services/routes'));

  // https://medium.com/the-spumko-suite/testing-hapi-services-with-lab-96ac463c490a
  // The if (!module.parent) {…} conditional makes sure that if the script is
  // being required as a module by another script, we don’t start the server.
  // This is done to prevent the server from starting when we’re testing it.
  // With Hapi, we don’t need to have the server listening to test it.
  if (!module.parent) {
    // Start the server.
    server.start(() => {
      // Log to the console the host and port info.
      console.log('Server started at: ' + server.info.uri);
    });
  }
});

module.exports = server;
