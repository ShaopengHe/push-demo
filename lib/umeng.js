var _ = require('underscore');
var crypto = require('crypto');
var request = require('request');

/**
 * UMeng
 * @class UMeng
 * @param {Object} options
 * @param {String} options.appKey
 * @param {String} options.appMasterSecret
 */
function UMeng(options) {
  this.appKey = options.appKey;
  this.appMasterSecret = options.appMasterSecret;
  this.host = 'http://msg.umeng.com';
  this.baseUrl = this.host + '/api';
}

/**
 * 推送消息
 * http://dev.umeng.com/push/android/api-doc#2
 * @param {Object} option
 * @param {Function} callback (err, body)
 */
UMeng.prototype.push = function(option, callback) {
  var url = this.baseUrl + '/send';
  this.__post(url, option, {}, callback);
};

/*
 * 推送类型
 */
UMeng.prototype.TYPE = {
  UNICAST: 'unicast',
  LISTCAST: 'listcast',
  FILECAST: 'filecast',
  BROADCAST: 'broadcast',
  GROUPCAST: 'groupcast',
  CUSTOMIZEDCAST: 'customizedcast'
};

/*
 * 消息类型
 */
UMeng.prototype.MESSAGE_TYPE = {
  NOTIFICATION: 'notification',
  MESSAGE: 'message'
};

/*
 * 点击"通知"的后续行为
 */
UMeng.prototype.AFTER_OPEN = {
  GO_APP: 'go_app',
  GO_URL: 'go_url',
  GO_ACTIVITY: 'go_activity',
  GO_CUSTOM: 'go_custom'
};

var sign = function(method, url, postBody, appMasterSecret) {
  var str = method.toUpperCase();
  str += url + JSON.stringify(postBody) + appMasterSecret;
  var md5sum = crypto.createHash('md5');
  md5sum.update(str, 'utf8');
  return md5sum.digest('hex');
};

UMeng.prototype.__post = function(url, data, options, callback) {
  options = _.defaults(options || {}, {});

  data = _.defaults(data || {}, {
    'appkey': this.appKey,
    'timestamp': Date.now()
  });

  var headers = {
    'Content-Type': options['Content-Type'] || 'application/json'
  };

  request({
    method: 'post',
    url: url,
    headers: headers,
    json: true,
    body: data,
    qs: {
      sign: sign('post', url, data, this.appMasterSecret)
    }
  }, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    if (!body) {
      return callback(new Error('NO RESPONSE'));
    }
    if (body.ret === 'FAIL') {
      var e = new Error(body.ret);
      e.code = body.data['error_code'];
      return callback(e);
    }
    return callback(null, body);
  });
};

module.exports = UMeng;
