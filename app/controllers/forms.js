/* eslint-disable handle-callback-err */
'use strict';
var Boom = require('boom');
var github = require('../services/github');
var formsService = require('../services/forms');
var config = require('../config');
var _ = require('lodash');

module.exports = {
  list: {
    handler: (request, reply) => {
      github.getContent('forms')
        .then((data) => {
          let forms = data.map((o) => { return {name: o.name.replace('.json', '')}; });
          reply({
            forms
          });
        })
        .catch((err) => {
          console.log('err', err);
          reply(Boom.notFound());
        });
    }
  },

  single: {
    handler: (request, reply) => {
      reply({
        form: request.params.formId,
        message: 'This is not the page you are looking for...',
        entries_url: `${config.connection.host}:${config.connection.port}/forms/${request.params.formId}/entries`
      });
    }
  },

  entries: {
    handler: (request, reply) => {
      Promise.all([
        github.getContent(`data/${request.params.formId}`),
        formsService.getEntriesIndex(request.params.formId)
      ])
        .then((data) => {
          let entriesList = data[0];
          let _index;
          if (data[1] !== null) {
            try {
              _index = JSON.parse((new Buffer(data[1].content, 'base64')).toString());
            } catch (e) {
              return reply(Boom.badImplementation('Resources were not valid JSON. ' + e.message));
            }
          }

          // Remove _index if it exists.
          entriesList = _.reject(entriesList, ['name', '_index.json']);

          let entries = entriesList.map((o) => {
            let _indexData = _.get(_index, o.name, {});
            _indexData.id = o.name.replace('.json', '');
            if (!_indexData.name) {
              _indexData.name = _indexData.id;
            }
            return _indexData;
          });

          reply({
            form: request.params.formId,
            entries
          });
        })
        .catch((err) => {
          console.log('err', err);
          reply(Boom.notFound());
        });
    }
  },

  entriesSingle: {
    handler: (request, reply) => {
      Promise.all([
        github.getMasterSHA(),
        github.getContent(`forms/${request.params.formId}.json`),
        github.getContent(`data/${request.params.formId}/${request.params.entryId}.json`)
      ])
        .then((data) => {
          let sha = data[0];
          let form = data[1];
          let entry = data[2];

          let formContent = (new Buffer(form.content, 'base64')).toString();
          let entryContent = (new Buffer(entry.content, 'base64')).toString();

          try {
            formContent = JSON.parse(formContent);
            entryContent = JSON.parse(entryContent);
          } catch (e) {
            return reply(Boom.badImplementation('Resources were not valid JSON. ' + e.message));
          }

          let res = {
            form: request.params.formId,
            entryName: entryContent.name,
            entry: request.params.entryId,
            meta: {
              masterSHA: sha,
              entrySHA: entry.sha,
              formSchemaVersion: formContent.version
            },
            schema: formContent,
            data: entryContent.results
          };

          reply(res);
        })
        .catch((err) => {
          console.log('err', err);
          reply(Boom.notFound());
        });
    }
  },

  entriesSingleUpdate: {
    handler: (request, reply) => {
      let branch = `${request.payload.form}-${request.payload.entry}-update-${Date.now()}`;

      let author = {
        name: _.get(request.payload.author, 'name', 'Anonymous'),
        email: _.get(request.payload.author, 'email', 'anonymous@example.com')
      };

      if (_.trim(author.name) === '') {
        author.name = 'Anonymous';
      }

      if (_.trim(author.email) === '') {
        author.email = 'anonymous@example.com';
      }

      Promise.all([
        github.getContent(`data/${request.params.formId}/${request.params.entryId}.json`),
        github.createBranch(branch, request.payload.meta.masterSHA)
      ])
        .then(data => {
          var entryContent = JSON.parse((new Buffer(data[0].content, 'base64')).toString());

          entryContent.results = request.payload.data;
          entryContent.meta.date = Date.now();

          return github.updateFile(
            `data/${request.params.formId}/${request.params.entryId}.json`,
            JSON.stringify(entryContent, null, '  '),
            request.payload.meta.entrySHA,
            branch,
            'Data update',
            author.name,
            author.email
          )
            .then(data => {
              return github.createPR(`Data update from ${author.name}`, branch)
                .then(data => {
                  reply({
                    statusCode: 200,
                    message: 'Pull request successfully created.'
                  });
                })
                .catch((err) => {
                  console.log('err', err);
                  reply(Boom.badImplementation());
                });
            })
              .catch((err) => {
                console.log('err', err);
                reply(Boom.badImplementation());
              });
        })
        .catch((err) => {
          console.log('err', err);
          reply(Boom.badImplementation());
        });
    }
  }
};
