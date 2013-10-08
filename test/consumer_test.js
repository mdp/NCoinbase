var assert = require("assert"),
  Consumer = require("../lib/consumer").Consumer,
  mockCredentials = require("./mocks/credentials").valid();

describe('Consumer', function(){
  describe('api methods', function(){
    var consumer = new Consumer(mockCredentials, {});
    it('should correctly add methods from the api methods file', function(){
      assert(typeof consumer.account_balance === 'function');
      assert(typeof consumer.sell === 'function');
      assert(typeof consumer.buy === 'function');
      assert(typeof consumer.user_list === 'function');
    })
  })
})
