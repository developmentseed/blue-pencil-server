var _ = require('lodash');

// Prod settings act as base.
var config = require('./config/production');

// Staging overrides
if (process.env.OC_ENV === 'staging') {
  _.merge(config, require('./config/staging'));
}

// local config overrides everything when present.
try {
  var localConfig = require('./config/local');
  _.merge(config, localConfig);
} catch (e) {
  // Local file is not mandatory.
}

// Overrides by ENV variables:
config.ghToken = process.env.GH_TOKEN || config.ghToken;
config.debug = process.env.OC_DEBUG || config.debug;
config.connection.port = process.env.PORT || config.connection.port;
config.connection.host = process.env.HOST || config.connection.host;

if (config.ghToken === null) {
  throw new Error('GH token is not defined. Set it in the config file or using env var GH_TOKEN');
}

module.exports = config;
