const accessList = require("./list-access");
const optionalOptions = require("./optional-options");


module.exports = function(listId) {
  const getList = function(userId, options, callback) {
    const parameters = {};
    return accessList.get(userId, listId, parameters, options, callback);
  };

  const getReadProfile = function(userName, callback) {
    return accessList.getProfile(userName, callback);
  };

  return {
    get: optionalOptions(getList),
    getProfile: getReadProfile
  };
};
