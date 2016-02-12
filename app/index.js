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


























// VV   Will be deleted very very soon!   VV

// app.get('/', function (req, res) {
// //

//   var branchName = 'data-update-' + Date.now();
//   var masterSha = null;
//   var fileSha = null;

//   github.gitdata.getReference({
//     user: 'danielfdsilva',
//     repo: 'vigilant-octo-succotash',
//     ref: 'heads/master'
//   }, function (err, data) {
//     if (err) { console.log('err', err); throw err; }

//     masterSha = data.object.sha;
//     console.log('masterSha', masterSha);

//     github.repos.getContent({
//       user: 'danielfdsilva',
//       repo: 'vigilant-octo-succotash',
//       path: 'data/pt.json'
//     }, function (err, file) {
//       if (err) { console.log('err', err); throw err; }

//       fileSha = file.sha;
//       console.log('fileSha', fileSha);
//       console.log('------------------');
//       console.log((new Buffer(file.content, 'base64').toString('ascii')));
//       console.log('------------------');

//       console.log('');
//       console.log('Edit would be done here');
//       console.log('');

//       github.gitdata.createReference({
//         user: 'danielfdsilva',
//         repo: 'vigilant-octo-succotash',
//         ref: 'refs/heads/' + branchName,
//         sha: masterSha
//       }, function (err, data) {
//         if (err) { console.log('err', err); throw err; }

//         console.log('Branch created', branchName);

//         github.repos.updateFile({
//           user: 'danielfdsilva',
//           repo: 'vigilant-octo-succotash',
//           path: 'data/pt.json',
//           message: 'data update through form!',
//           sha: fileSha,
//           content: (new Buffer('this is the new file content - ' + Date.now()).toString('base64')),
//           branch: branchName,
//           author: {
//             name: 'devseedgit',
//             email: 'dev@developmentseed.org'
//           }
//         },
//         function (err, file) {
//           if (err) { console.log('err', err); throw err; }

//           console.log('File updated');

//           github.pullRequests.create({
//             user: 'danielfdsilva',
//             repo: 'vigilant-octo-succotash',
//             title: 'Data update',
//             body: 'This is nice\nbut does it work?',
//             base: 'master',
//             head: branchName
//           },
//           function (err, pr) {
//             if (err) { console.log('err', err); throw err; }

//             console.log('pr created', pr.html_url);

//             res.send('we are done!');
//           });
//         });

//       });

//     });

//   });

// });
