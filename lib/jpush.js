var _ = require('underscore');
var request = require('request');

/**
 * JPush
 * @class JPush
 * @param {Object} options
 * @param {String} options.appKey
 * @param {String} options.masterSecret
 */
function JPush(options) {
  this.appKey = options.appKey;
  this.masterSecret = options.masterSecret;
  this.host = 'https://api.jpush.cn';
  this.v = 'v3';
  this.baseUrl = this.host + '/' + this.v;
}

/**
 * 推送消息
 * http://docs.jpush.io/server/rest_api_v3_push/#_1
 * @param {Object} data
 * @param {Function} callback (err, body)
 */
JPush.prototype.push = function(data, callback) {
  var url = this.baseUrl + '/push';
  this.__post(url, data, {}, callback);
};

/*
 * 推送平台
 */
JPush.prototype.PLATFORM = {
  ALL: 'all',
  IOS: 'ios',
  ANDROID: 'android'
};

/*
 * 设备对象
 */
JPush.prototype.AUDIENCE = {
  ALL: 'all',
  TAG: function(tags) {
    tags = [].concat(tags);
    return {
      tag: tags
    };
  }
};

JPush.prototype.__post = function(url, data, options, callback) {
  options = _.defaults(options || {}, {});

  var headers = {
    'Content-Type': options['Content-Type'] || 'application/json'
  };

  request({
    method: 'post',
    url: url,
    headers: headers,
    auth: {
      user: this.appKey,
      pass: this.masterSecret
    },
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
      var e = new Error(body.error.message);
      e.code = body.error.code;
      return callback(e);
    }
    return callback(null, body);
  });
};

module.exports = JPush;
