'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://120.55.76.182:8060/api/"',
  BASE_URL: '"http://localhost"',
  BASE_PORT: 9000
});
