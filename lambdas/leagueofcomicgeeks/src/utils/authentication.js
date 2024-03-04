const _ = require("lodash");
const request = require("request");
const cookie = require("cookie");
const config = require("../../config");

const cookieJar = request.jar();
let user = null;

const getSession = function() {
  const cookieString = cookieJar.getCookieString(config.rootUrl);
  return cookie.parse(cookieString)[config.sessionKey];
};

module.exports = {
  isAuthenticated() {
    return _.isObject(user) && _.isString(getSession());
  },
  cookieJar
};