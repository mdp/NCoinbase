var assert = require("assert"),
  Credentials = require("../lib/credentials").Credentials;

describe('Credentials', function(){
  describe('#createFromApi()', function(){
    it('should normalize the keys', function(){
      var credentials = Credentials.createFromApi({
        'access_token': '1234',
        'refresh_token': 'abc',
        'expires_in': '7200'
      }).toJSON();
      assert.equal(credentials['accessToken'], '1234');
      assert.equal(credentials['access_token'], undefined);
      assert(credentials['expiresAt'] > Date.now());
    })
    it('should handle expiration', function(){
      var credentials = Credentials.createFromApi({
        'access_token': '1234',
        'refresh_token': 'abc',
        'expires_in': '0'
      });
      assert(credentials.isExpired());
    })
  })
})
