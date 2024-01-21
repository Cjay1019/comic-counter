const axios = require("axios");
const lofcg = require("../leagueofcomicgeeks/index");

module.exports = function (app) {
    app.get("/api/getReadCount", (req, res) => {
        lofcg.readList.get(process.env.USER_ID, { type: lofcg.types.ISSUE }, function (err, results) {
            if (err) console.error(err)
            res.json({ readCount: results.length - 218 });
        });
    });
}