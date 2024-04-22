const _ = require("lodash");
const queryString = require("query-string");
const request = require("./request");
const cheerio = require("cheerio");
const filter = require("./filter");
const config = require("../../config");

const getComicsUrl = "/comic/get_comics";
const getProfileUrl = "/profile/";

const getList = function(userId, listId, parameters, options, callback) {
  const viewType = {
    issue: "list",
    series: "thumbs"
  };
  const filterOptions = [].concat(options.filter || []);
  const listRefinement = _.includes(filterOptions, filter.FIRST_ISSUES)
    ? filter.FIRST_ISSUES
    : undefined;

  const type = options.type || config.defaultType;
  const urlParameters = _.extend(
    {
      list: listId,
      list_mode: type,
      list_refinement: listRefinement,
      user_id: userId
    },
    parameters
  );
  const urlParameterString = queryString.stringify(urlParameters, {
    arrayFormat: "bracket"
  });

  const proxy = process.env.PROXY_URL;
  const url = `${getComicsUrl}?${urlParameterString}`;
  makeRequest(url, proxy, callback).then(count => {
      callback(null, count);
  });
};

getRead = function(userName, callback) {
  const proxy = process.env.PROXY_URL;
  const url = `${getProfileUrl}${userName}`;

  request.get({uri: url, proxy}, (error, response, body) => {
    if (error) {
      return callback(error);
    }

    if (response && response.statusCode !== 200) {
      return callback(
        new Error(`Unexpected status code ${response.statusCode}`)
      );
    }

    const $ = cheerio.load(body);
    const countString = 
      $('a:contains("Read List")')
      .eq(0)
      .find(".badge")
      .text();

    callback(null, parseInt(countString, 10));
  });
}

const makeRequest = (url, proxy, callback, count = 0, lazy = false) => new Promise((resolve, reject) => {
    if (lazy) {
      url = url + `&list_extend=1&list_mode_offset=${count}`;
    }

    request.get({uri: url, proxy}, (error, response, body) => {
      if (error) {
        return callback(error);
      }
  
      if (response && response.statusCode !== 200) {
        return callback(
          new Error(`Unexpected status code ${response.statusCode}`)
        );
      }
  
      let responseJson;
      try {
        responseJson = JSON.parse(body);
      } catch (e) {
        return callback(new Error("Unable to parse response"));
      }
  
      if (!_.isObject(responseJson) || !_.isString(responseJson.list)) {
        return callback(new Error("Unknown response format"));
      }

      if (responseJson.count < 1) {
        return resolve(count);
      } else {
       resolve(makeRequest(url, proxy, callback, count + responseJson.count, true));
      }
    });
  });

module.exports = {
  get: getList,
  getProfile: getRead
};
