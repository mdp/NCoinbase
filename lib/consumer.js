var Q = require('q'),
  events = require("events"),
  apiMethods = require("./api_methods"),
  util = require("util");

function addApiMethods (Obj) {
  var self = this, fn;
  function addMethod (name, fn) {
    Obj.prototype[name] = fn;
  }
  for (var name in apiMethods) {
    if (apiMethods.hasOwnProperty(name)) {
      fn = apiMethods[name];
      addMethod(name, fn);
    }
  }
}

var Consumer = exports.Consumer = function (credentials, client) {
  this.credentials = credentials;
  this.client = client;
  this.adapter = client.adapter;
  events.EventEmitter.call(this);
}
util.inherits(Consumer, events.EventEmitter);
addApiMethods(Consumer);

Consumer.BASE = "https://coinbase.com/api/v1/"

Consumer.prototype._buildUrl = function (path) {
  return Consumer.BASE + path;
}

// Listen for the updatedCredentials event and save them.
Consumer.prototype._updateCredentials = function (credentials) {
  this.credentials = credentials;
  this.emit('updatedCredentials', credentials);
}

Consumer.prototype._withUpdatedTokens = function (callback) {
  var self = this;
  if (this.credentials.isExpired()) {
    this.client.refreshAccessTokens(this.credentials.get('refreshToken'), function (err, credentials) {
      if (err) {
        callback(err)
        return false;
      }
      self._updateCredentials(credentials);
      callback(null);
    });
  } else {
    setImmediate(callback)
  }
}

Consumer.prototype.get = function (path, callback) {
  return this.request('GET', path, null, callback);
}

Consumer.prototype.post = function (path, body, callback) {
  return this.request('POST', path, body, callback);
}

Consumer.prototype.put = function (path, body, callback) {
  return this.request('PUT', path, body, callback);
}

Consumer.prototype.del = function (path, body, callback) {
  return this.request('DELETE', path, body, callback);
}

Consumer.prototype.request = function (method, path, body, callback) {
  var deferred = Q.defer(),
    params,
    self = this,
    url = this._buildUrl(path);
  this._withUpdatedTokens(function (err) {
    if (err) {
      deferred.reject(err);
      if (callback) callback(err);
      return false;
    }
    params = { access_token: self.credentials.get('accessToken') };
    self.adapter({url: url, qs: params, method: method, body: body, json: true}, function (err, resp, body) {
      if (err) {
        deferred.reject(err);
        if (callback) callback(err);
        return false;
      } else if (resp && resp.statusCode !== 200) {
        var error = new Error(resp.statusCode.toString() + ": " + body)
        deferred.reject(error);
        if (callback) callback(error);
        return false;
      }
      deferred.resolve(body);
      if (callback) callback(null, body);
    });
  });
  return deferred.promise;
}

