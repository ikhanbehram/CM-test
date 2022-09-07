const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
    getTitle: async (req, res) => {
        const { address } = req.query;
        const urlRegex = /[a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
        if (typeof address === "string") {
            try {
                if (!address) {
                    throw { status: 400, message: "Address is empty" };
                }
                if (!address.match(urlRegex)) {
                    throw { status: 406, message: "Invalid URL in address" };
                }
                const { data } = await axios.get(`http://${address}`);
                const $ = cheerio.load(data);
                const title = $("title").html();

                res.status(200).send(`<html>
            <head></head>
            <body>

                <h1> Following are the titles of given websites: </h1>

                <ul>
                ${`<li>${title}</li>`}
                </ul>
            </body>
            </html>`);
            } catch (err) {
                res.status(err.status || 500).json(err.message || "Internal Server Error");
            }
            res.end();
        } else {
            try {
                address.forEach((url) => {
                    if (!url.match(urlRegex)) {
                        throw { status: 404, message: "Invalid URL in address" };
                    }
                });
                const response = address.map((ad) => {
                    return axios.get(`http://${ad}`);
                });
                const data = await Promise.all(response);
                const titles = [];
                data.forEach((d) => {
                    const $ = cheerio.load(d.data);
                    const title = $("title").html();
                    titles.push(title);
                });
                const content = titles.map((title) => {
                    return `<li>${title}</li>`;
                });
                res.status(200).send(`<html>
                <head></head>
                <body>

                    <h1> Following are the titles of given websites: </h1>

                    <ul>
                     ${content.toString().replace(/,/, "")}
                    </ul>
                </body>
                </html>`);
            } catch (err) {
                res.status(err.staus || 500).send(err.message || "Internal Server Error");
            }
        }
    }
};