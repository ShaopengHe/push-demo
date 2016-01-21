var config = require('../config').leanCloud;
var leanCloud = new (require('../index').LeanCloud)(config);
require('should');

describe('LeanCloud', function() {
  describe('POST /push', function() {
    it('should be ok', function(done) {
      leanCloud.push({
        'push_time': new Date('2016-01-21 14:30:00').toISOString(),
        'expiration_interval': '86400',
        data: {
          alert: 'LeanCloud 向您问好！',
          node: 'js'
        }
      }, function(err, body) {
        if (err) {
          console.error(err);
          return done(err);
        }
        body.objectId.should.be.a.String;
        done();
      });
    });
  });
});
