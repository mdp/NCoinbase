var assert = require("assert"),
  Consumer = require("../lib/consumer").Consumer,
  apiMethods = require("../lib/api_methods"),
  mockCredentials = require("./mocks/credentials").valid(),
  mockExpiredCredentials = require("./mocks/credentials").expired();

describe('Consumer', function(){
  describe('api methods', function(){
    var consumer = new Consumer(mockCredentials, {});
    it('should correctly add methods from the api methods file', function(){
      for (var name in apiMethods) {
        if (apiMethods.hasOwnProperty(name)) {
          assert(typeof consumer[name] === 'function');
        }
      }
    })
  })

  describe('working with credentials', function(){
    it('should refresh expired tokens on action', function(done){
      var client = {
          refreshAccessTokens: function(token, callback) {
            assert(true);
            done();
          },
          adapter: function () {
            assert(false, "Didn't refresh expired token")
            done();
          }
        },
        consumer = new Consumer(mockExpiredCredentials, client);
      consumer.get('api_method/me');
    })

    it('should fire a refresh token event', function(done){
      var client = {
          refreshAccessTokens: function(token, callback) {
            assert(true);
            callback(null, mockCredentials);
          },
          adapter: function () {
          }
        },
        consumer = new Consumer(mockExpiredCredentials, client);
      consumer.on('updatedCredentials', function (creds) {
        assert.equal(creds, mockCredentials)
        done();
      });
      consumer.get('api_method/me');
    })
  })
})
