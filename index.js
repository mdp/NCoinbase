
var request = require('request'),
  Q = require('q'),
  Credentials = require('./lib/credentials').Credentials,
  Consumer = require('./lib/consumer').Consumer,
  Coinbase,
  querystring = require('querystring');

exports.Coinbase = Coinbase = function (config, adapter) {
  this.client_id = config.id;
  this.client_secret = config.secret;
  this.redirect_uri = config.redirect_uri;
  this.adapter = adapter || request;
}

Coinbase.CONFIG = {
  "base": "https://coinbase.com",
  "auth_path": "/oauth/authorize",
  "token_path": "/oauth/token"
};

Coinbase.Credentials = Credentials;

Coinbase.prototype.getAuthorizeUrl = function (params) {
  var url = Coinbase.CONFIG.base + Coinbase.CONFIG.auth_path;
  params = params || {};
  params['response_type'] = 'code';
  params['redirect_uri'] = this.redirect_uri;
  params['client_id'] = this.client_id;
  return url + '?' + querystring.stringify(params);
}


Coinbase.prototype._getToken = function (code, params, callback) {
  var deferred = Q.defer(),
    credentials, url;
  params['redirect_uri'] = this.redirect_uri;
  params['client_id'] = this.client_id;
  params['client_secret'] = this.client_secret;
  url = Coinbase.CONFIG.base + Coinbase.CONFIG.token_path;
  this.adapter({url: url, method: 'POST', qs: params, json: true}, function (err, resp, body) {
    if (err) {
      deferred.reject(err);
      if (callback) callback(err);
      return false;
    } else if (resp && resp.statusCode !== 200) {
      deferred.reject(body);
      if (callback) callback(body);
      return false;
    }
    credentials = Credentials.createFromApi(body);
    console.log(credentials.toJSON());
    deferred.resolve(credentials);
    if (callback) callback(null, credentials);
  });
  return deferred;
}

Coinbase.prototype.getAccessToken = function (code, params, callback) {
  var params = {
    'grant_type': 'authorization_code',
    'code': code
  };
  return this._getToken(code, params, callback);
}

Coinbase.prototype.refreshAccessTokens = function (code, callback) {
  var params = {
    'grant_type': 'refresh_token',
    'refresh_token': code
  };
  return this._getToken(code, params, callback);
}

Coinbase.prototype.createConsumer = function (credentials) {
  return new Consumer(credentials, this);
}

