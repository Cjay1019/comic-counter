const _ = require("lodash");
const cheerio = require("cheerio");
const config = require("../../config");
const sort = require("./sort");

const sortList = function(list, sortBy = sort.ASCENDING) {
  if (sortBy === sort.ASCENDING || sortBy === sort.DESCENDING) {
    return _.orderBy(list, "name", sortBy);
  }
  if (sortBy === sort.MOST_PULLED) {
    return _.orderBy(list, "userMetrics.pulled", "desc");
  }
  if (sortBy === sort.PICK_OF_THE_WEEK) {
    return _.orderBy(list, "userMetrics.pickOfTheWeekRating", "desc");
  }
  if (sortBy === sort.CONSENSUS_RATING) {
    return _.orderBy(list, "userMetrics.consensusRating", "desc");
  }
  return list;
};

const getVote = (piece, boundary) =>
  parseFloat(piece.match(new RegExp(`${boundary}([^%]+)%`))[1].trim());
const getVotes = function($el) {
  const consensus = "consensus:";
  const potw = "potw:";

  const toolbarPieces = $el
    .find(".comic-list-toolbar-text")
    .text()
    .trim()
    .replace(/·/g, "")
    .split("    ")
    .map(value => value.trim().toLowerCase())
    .filter(value => value !== "");

  return toolbarPieces.reduce(
    function(votes, piece) {
      if (piece.includes(consensus))
        return _.extend({}, votes, {
          consensusRating: getVote(piece, consensus)
        });
      if (piece.includes(potw))
        return _.extend({}, votes, {
          pickOfTheWeekRating: getVote(piece, potw)
        });
      return votes;
    },
    { consensusRating: null, pickOfTheWeekRating: null }
  );
};

const getCollectionStats = function($, $el) {
  const collectionStats = $el
    .find(".comic-list-stats a")
    .map(function() {
      const $statButton = $(this);
      const actionText = $statButton
        .find(".text")
        .text()
        .toLowerCase();
      const counterValue = parseInt($statButton.find(".counter").text(), 10);

      if (actionText.startsWith("add")) return { added: counterValue };
      if (actionText.startsWith("pull")) return { pulled: counterValue };
      return {};
    })
    .get();

  return _.extend(
    {
      pulled: null,
      added: null
    },
    ...collectionStats
  );
};

const issueExtractor = function(response, options) {
  const $ = cheerio.load(response.list);

  const extractIssueData = function() {
    const $el = $(this);
    const url = $el
      .find(".title a")
      .attr("href")
      .trim();
    const name = $el
      .find(".title a")
      .text()
      .trim();
    return {
      url,
      name
    };
  };

  return sortList(
    $("li")
      .map(extractIssueData)
      .get(),
    options.sort
  );
};

const extractionHandler = {
  issue: issueExtractor
};

module.exports = function(response, options) {
  const handler =
    extractionHandler[options.type] || extractionHandler[config.defaultType];
  return handler(response, options);
};
