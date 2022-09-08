const http = require("http");
const cheerio = require("cheerio");
const { urlRegex } = require("../utils/index");

module.exports = {
    getTitle: (req, res) => {
        const { address } = req.query;
        if (!address) {
            return res.status(400).send("Address is empty");
        }
        if (typeof address === "string") {
            if (!address.match(urlRegex)) {
                return res.status(400).send("Invalid URL in address");
            }

            const requestFunction = (callback, error) => {
                let data = "";
                const request = http
                    .get(`http://${address}`, (res) => {
                        res.on("data", (chunk) => {
                            data += chunk;
                        });

                        res.on("end", () => {
                            return callback(data);
                        });
                    })
                    .on("error", (err) => {
                        error(err);
                    });
                request.end();
            };
            requestFunction(
                (data) => {
                    const $ = cheerio.load(data);
                    const title = $("title").html();
                    res.status(200).send(
                        `<html>
                          <head></head>
                            <body>
                                <h1> Following are the titles of given websites: </h1>

                                 <ul>
                                    ${`<li>${title}</li>`}
                                 </ul>
                             </body>
                     </html>`
                    );
                },
                (error) => {
                    res.status(error.status || 500).send(error.message || "Internal server error");
                }
            );
        } else {
            address.forEach((url) => {
                if (!url.match(urlRegex)) {
                    return res.status(404).send("Invalid URL in address");
                }
            });
            let data = [];
            let count = address.length;
            const requestFunction = (callback, error) => {
                address.forEach((url) => {
                    http.get(`http://${url}`, (res) => {
                        let body = "";
                        res.on("data", (chunk) => {
                            body += chunk;
                        });
                        res.on("end", () => {
                            count -= 1;
                            data.push({ body });
                            if (count === 0) {
                                callback(data);
                            }
                        });
                    }).on("error", function (err) {
                        error(err);
                    });
                });
            };

            requestFunction(
                (data) => {
                    const titles = [];
                    data.forEach((d) => {
                        if (d) {
                            const $ = cheerio.load(d.body);
                            const title = $("title").html();
                            titles.push(title);
                        }
                    });

                    content = titles.map((title) => {
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
                },
                (error) => {
                    res.status(error.status || 500).send(error.message || "Internal server error");
                }
            );
        }
    }
};
