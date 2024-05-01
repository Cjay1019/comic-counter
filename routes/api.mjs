import * as GetReadCount from "../lambdas/getReadCount.mjs";

export default function routes(app) {
    app.post("/api/getReadCount", async (req, res) => {
        console.log(req.body);
        const response = await GetReadCount.handler(req);
        res.json(response);
    });
}