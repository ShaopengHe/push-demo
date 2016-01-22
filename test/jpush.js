var config = require('../config').jPush;
var jPush = new (require('../index').JPush)(config);
require('should');

describe('JPush', function() {
  describe('POST /push', function() {
    it('should be ok', function(done) {
      jPush.push({
        platform: jPush.PLATFORM.ALL,
        audience: jPush.AUDIENCE.ALL,
        notification: {
          alert: 'Hello, JPush'
        }
      }, function(err, body) {
        if (err) {
          console.error(err);
          return done(err);
        }
        body['msg_id'].should.be.a.String;
        done();
      });
    });
  });
});
