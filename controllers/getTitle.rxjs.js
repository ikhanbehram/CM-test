const axios = require("axios");
const cheerio = require("cheerio");
const { Observable } = require("rxjs");

module.exports = {
    getTitle: (req, res) => {
        const { address } = req.query;
        const urlRegex = /[a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
        if (typeof address === "string") {
            if (!address) {
                res.status(400).send("Address is empty");
            }
            if (!address.match(urlRegex)) {
                res.status(400).send("Invalid URL in address");
            }
            const observable = new Observable((subscriber) => {
                axios
                    .get(`http://${address}`)
                    .then((data) => {
                        subscriber.next(data);
                    })
                    .catch((err) => {
                        subscriber.error(err);
                    });
            });
            const subscription = observable.subscribe(
                (data) => {
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
                },
                (err) => {
                    res.status(err.status || 500).send(err.message || "Internal server error");
                }
            );
            setTimeout(() => {
                subscription.unsubscribe;
            });
        } else {
            address.forEach((url) => {
                if (!url.match(urlRegex)) {
                    res.status(400).send("Invalid URL in Address");
                }
            });
            const promises = address.map((ad) => {
                return axios.get(`http://${ad}`);
            });
            const observable = new Observable((subscriber) => {
                Promise.all(promises)
                    .then((data) => {
                        subscriber.next(data);
                    })
                    .catch((err) => {
                        subscriber.error(err);
                    });
            });

            const subscription = observable.subscribe(
                (data) => {
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
                },
                (err) => {
                    res.status(err.status || 500).send(err.message || "Internal server error");
                }
            );
            setTimeout(() => {
                subscription.unsubscribe;
            });
        }
    }
};
