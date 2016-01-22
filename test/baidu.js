var config = require('../config').baidu;
var baidu = new (require('../index').Baidu)(config);
require('should');

describe('Baidu', function() {
  describe('POST /push', function() {
    it('should be ok', function(done) {
      baidu.push({
        'push_type': baidu.PUSH_TYPE.ALL,
        'message_type': baidu.MESSAGE_TYPE.NOTIFICATION,
        'device_type': baidu.DEVICE_TYPE.ANDROID,
        'messages': {
          title: 'Hello, Baidu',
          description: 'Baidu Push Demo',

          'custom_content': {
            myKey: 'myVal'
          }
        }
      }, function(err, body) {
        if (err) {
          console.error(err);
          return done(err);
        }
        body['response_params']['success_amount'].should.be.a.Number;
        done();
      });
    });
  });
});
