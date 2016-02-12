'use strict';
var forms = require('../controllers/forms');

module.exports = [
  { method: 'GET', path: '/forms', config: forms.list },
  { method: 'GET', path: '/forms/{formId}', config: forms.single },
  { method: 'GET', path: '/forms/{formId}/entries', config: forms.entries },
  { method: 'GET', path: '/forms/{formId}/entries/{entryId}', config: forms.entriesSingle },
  { method: 'PUT', path: '/forms/{formId}/entries/{entryId}', config: forms.entriesSingleUpdate }
];
