var config = require('../config').xinGe;
var xinGe = new (require('../index').XinGe)(config);
require('should');

describe('XinGe', function() {
  describe('POST /push', function() {
    it('should be ok', function(done) {
      xinGe.push({
        method: 'all_device',
        'message_type': 1,
        'expire_time': 86400,
        message: JSON.stringify({
          title: '腾讯信鸽',
          content: '推送内容: 你好，腾讯信鸽～'
        })
      }, function(err, body) {
        if (err) {
          console.error(err);
          return done(err);
        }
        console.log(body);
        body['ret_code'].should.equal(0);
        done();
      });
    });
  });
});
