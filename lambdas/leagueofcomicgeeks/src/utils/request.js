const request = require("request");
const authentication = require("./authentication");
const config = require("../../config");

module.exports = request.defaults({
  jar: authentication.cookieJar,
  baseUrl: config.rootUrl,
  headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"} 
});
