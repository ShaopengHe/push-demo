var BaiduPush = require('baidu-push');

/**
 * Baidu
 * @class Baidu
 * @param {Object} options
 * @param {String} options.apiKey
 * @param {String} options.secretKey
 */
function Baidu(options) {
  this.apiKey = options.apiKey;
  this.secretKey = options.secretKey;
  this.timeout = options.timeout || 5000;

  this.client = BaiduPush.createClient({
    apiKey: this.apiKey,
    secretKey: this.secretKey,
    timeout: this.timeout
  });
}

/**
 * 推送消息
 * http://developer.baidu.com/wiki/index.php?title=docs/cplat/push/api/list#push_msg
 * @param {Object} option
 * @param {Function} callback (err, body)
 */
Baidu.prototype.push = function(option, callback) {
  this.client.pushMsg(option, function(err, body) {
    if (err) {
      return callback(err);
    }
    if (body && body['response_params'] && body['response_params']['success_amount']) {
      return callback(null, body);
    }
    return callback(new Error('success amount: 0'));
  });
};

/*
 * 推送类型
 */
Baidu.prototype.PUSH_TYPE = {
  SINGLE: 1,
  TAG: 2,
  ALL: 3
};

/*
 * 消息类型
 */
Baidu.prototype.MESSAGE_TYPE = {
  MESSAGE: 0,         // 消息（透传给应用的消息体）
  NOTIFICATION: 1     // 通知（对应设备上的消息通知）
};

/*
 * 设备类型
 */
Baidu.prototype.DEVICE_TYPE = {
  ANDROID: 3,
  IOS: 4
};

module.exports = Baidu;
