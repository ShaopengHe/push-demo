var config = require('../config').uMeng;
var umeng = new (require('../index').UMeng)(config);
require('should');

describe('UMeng', function() {
  describe('#push', function() {
    this.timeout('5000');
    it('should be success', function(done) {
      umeng.push({
        type: umeng.TYPE.BROADCAST,
        payload: {
          'display_type': umeng.MESSAGE_TYPE.NOTIFICATION,
          body: {
            ticker: 'Hello, UMeng',
            title: '你好，友盟',
            text: 'UMeng Demo',
            'after_open': umeng.AFTER_OPEN.GO_APP
          }
        }
      }, function(err, body) {
        if (err) {
          console.error(err);
          return done(err);
        }
        body.ret.should.be.equal('SUCCESS');
        console.log(body);
        done();
      });
    });
  });
});
