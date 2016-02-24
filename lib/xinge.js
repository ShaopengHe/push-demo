var _ = require('underscore');
var crypto = require('crypto');
var request = require('request');

/**
 * XinGe
 * @class XinGe
 * @param {Object} options
 * @param {String} options.accessId
 * @param {String} options.appKey
 */
function XinGe(options) {
  this.accessId = options.accessId;
  this.secretKey = options.secretKey;
  this.host = 'http://openapi.xg.qq.com';
  this.v = 'v2';
  this.baseUrl = this.host + '/' + this.v;
}

/**
 * 推送消息
 * http://developer.qq.com/wiki/xg/
 * @param {Object} data
 * @param {Function} callback (err, body)
 */
XinGe.prototype.push = function(data, callback) {
  var method = data.method || 'all_device';
  var url = this.baseUrl + '/push/' + method;

  this.__post(url, data, {}, callback);
};

var sign = function(method, url, postBody, secretKey) {
  var str = method.toUpperCase() + url.replace('http://', '').replace('https://', '');
  var keys = _.keys(postBody);
  keys.sort().forEach(function(k) {
    str += k + '=' + postBody[k];
  });
  str += secretKey;
  var md5sum = crypto.createHash('md5');
  md5sum.update(str, 'utf8');
  return md5sum.digest('hex');
};

XinGe.prototype.__post = function(url, data, options, callback) {
  options = _.defaults(options || {}, {});

  var headers = {
    'Content-Type': options['Content-Type'] || 'application/x-www-form-urlencoded'
  };

  data = _.defaults(data || {}, {
    'access_id': this.accessId,
    timestamp: Math.floor(Date.now() / 1000)
  });

  var s = sign('POST', url, data, this.secretKey);
  data.sign = s;

  request({
    method: 'post',
    url: url,
    headers: headers,
    form: data
  }, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    if (!body) {
      return callback(new Error('NO RESPONSE'));
    }
    try {
      body = JSON.parse(body);
    } catch (e) {
      return callback(new Error('RESPONSE NOT JSON'));
    }
    if (body['ret_code']) {
      var e = new Error(body['err_msg']);
      e.code = body['ret_code'];
      return callback(e);
    }
    return callback(null, body);
  });
};

module.exports = XinGe;
