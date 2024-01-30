const lofcg = require("../leagueofcomicgeeks/index");

module.exports = function (app) {
    app.post("/api/getReadCount", (req, res) => {
        lofcg.readList.get(req.body.userId, { type: lofcg.types.ISSUE }, function (err, results) {
            if (err) console.error(err)
            res.json({ readCount: results.length - req.body.startCount });
        });
    });
}