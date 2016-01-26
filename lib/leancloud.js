var _ = require('underscore');
var request = require('request');

/**
 * LeanCloud
 * @class LeanCloud
 * @param {Object} options
 * @param {String} options.appId
 * @param {String} options.appKey
 */
function LeanCloud(options) {
  this.appId = options.appId;
  this.appKey = options.appKey;
  this.host = 'https://leancloud.cn';
  this.v = '1.1';
  this.baseUrl = this.host + '/' + this.v;
}

/**
 * 推送消息
 * https://leancloud.cn/docs/push_guide.html#推送消息
 * @param {Object} data
 * @param {Function} callback (err, body)
 */
LeanCloud.prototype.push = function(data, callback) {
  var url = this.baseUrl + '/push';
  this.__post(url, data, {}, callback);
};

LeanCloud.prototype.__post = function(url, data, options, callback) {
  options = _.defaults(options || {}, {});

  var headers = {
    'X-LC-Id': this.appId,
    'X-LC-Key': this.appKey,
    'Content-Type': options['Content-Type'] || 'application/json'
  };

  request({
    method: 'post',
    url: url,
    headers: headers,
    json: true,
    body: data
  }, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    if (!body) {
      return callback(new Error('NO RESPONSE'));
    }
    if (body.error) {
      var e = new Error(body.error);
      e.code = body.code;
      return callback(e);
    }
    return callback(null, body);
  });
};

module.exports = LeanCloud;
