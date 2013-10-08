var Credentials = require("../../lib/credentials").Credentials;

exports.valid = function () {
  return Credentials.createFromApi({
    'access_token': '1234',
    'refresh_token': 'abc',
    'expires_in': '7200'
  });
}

exports.expired = function () {
  return new Credentials({
    'accessToken': '1234',
    'refreshToken': 'abc',
    'expiresAt': '1'
  });
}
