import * as lofcg from "./leagueofcomicgeeks/index.js";

export async function handler(event, context) {
    console.log(event.body);
    const data = JSON.parse(event.body);

    const response = await new Promise((resolve) => {
        lofcg.readList.getProfile(data.userName, function (err, results) {
            if (err) {
                console.error(err);
                resolve(0);
            };

            if (!results) {
                results = []
            }
            
            resolve({ readCount: results - data.startCount});
        });
    });

    return response;
};