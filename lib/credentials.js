var Credentials;

var EXPIRES_PADDING = 120 * 1000 // 120 Second padding to ensure expiration

exports.Credentials = Credentials = function (attrs) {
  this.attributes = attrs;
}

Credentials.ATTR_KEYS = ['accessToken', 'refreshToken', 'expiresAt']

Credentials.createFromApi = function (attrs) {
  // Give us a little headroom and refresh them one minute before expire
  attrs.expiresAt = Date.now() + attrs.expires_in * 1000 - EXPIRES_PADDING;
  attrs.accessToken = attrs.access_token;
  attrs.refreshToken = attrs.refresh_token;
  return new Credentials(attrs);
}

// Getter
Credentials.prototype.get = function (attr) {
  return this.attributes[attr];
}

// Prepare for serialization. This is all we
// need to remember
Credentials.prototype.toJSON = function () {
  var attrs = {}, key, i;
  for (i=0; Credentials.ATTR_KEYS.length > i; i++) {
    key = Credentials.ATTR_KEYS[i];
    attrs[key] = this.attributes[key];
  }
  return attrs;
}

Credentials.prototype.serialize = function () {
  JSON.stringify(this.toJSON());
}

// is Expired?
Credentials.prototype.isExpired = function () {
  return this.attributes.expiresAt < Date.now();
}
