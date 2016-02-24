'use strict';
var github = require('./github');

module.exports.getEntriesIndex = function (formId) {
  return new Promise((fulfill, reject) => {
    github.getContent(`data/${formId}/_index.json`)
      .then(fulfill)
      .catch(err => {
        if (err.code !== 404) {
          return reject(err);
        }
        return fulfill(null);
      });
  });
};
