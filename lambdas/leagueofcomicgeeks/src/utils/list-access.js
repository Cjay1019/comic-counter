const _ = require("lodash");
const queryString = require("query-string");
const request = require("./request");
const extractDataFrom = require("./extract-data-from");
const getPublisherIds = require("./get-publisher-ids");
const filter = require("./filter");
const config = require("../../config");

const getComicsUrl = "/comic/get_comics";

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
      list_option: type,
      list_refinement: listRefinement,
      user_id: userId,
      view: viewType[type] || "thumbs",
      order: options.sort || "alpha-asc",
      publisher: getPublisherIds(options.publishers)
    },
    parameters
  );
  const urlParameterString = queryString.stringify(urlParameters, {
    arrayFormat: "bracket"
  });

  const proxy = process.env.PROXY_URL;
  const url = `${getComicsUrl}?${urlParameterString}`;
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

    const list = extractDataFrom(responseJson, options);
    return callback(null, list);
  });
};

module.exports = {
  get: getList
};
