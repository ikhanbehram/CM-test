const axios = require("axios");
const cheerio = require("cheerio");
const { urlRegex } = require("../utils/index");

module.exports = {
    getTitle: (req, res) => {
        const { address } = req.query;
        if (typeof address === "string") {
            if (!address) {
                res.status(400).send("Address is empty");
            }
            if (!address.match(urlRegex)) {
                res.status(400).send("Invalid URL in address");
            }

            axios
                .get(`http://${address}`)
                .then((data) => {
                    const $ = cheerio.load(data.data);
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
                })
                .catch((err) => {
                    res.status(500).json(err.message);
                });
        } else {
            address.forEach((url) => {
                if (!url.match(urlRegex)) {
                    res.status(404).send("Invalid URL in address");
                }
            });
            const promises = address.map((ad) => {
                return axios.get(`http://${ad}`);
            });
            Promise.all(promises)
                .then((data) => {
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
                })
                .catch((err) => {
                    res.status(500).send(err.message || "Internal server error");
                });
        }
    }
};
