const express = require("express");
const axios = require("axios");
const http = require("http");
const app = express();
const cheerio = require("cheerio");
const { Observable } = require("rxjs");

/////////////////////////////
////////////////////////////
// ASYN AWAIT SOLUTION ////
//////////////////////////
/////////////////////////

// app.get("/I/want/title", async (req, res) => {
//     const { address } = req.query;
//     const urlRegex = /[a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
//     if (typeof address === "string") {
//         try {
//             if (!address) {
//                 throw { status: 400, message: "Address is empty" };
//             }
//             if (!address.match(urlRegex)) {
//                 throw { status: 406, message: "Invalid URL in address" };
//             }
//             const { data } = await axios.get(`http://${address}`);
//             const $ = cheerio.load(data);
//             const title = $("title").html();

//             res.status(200).send(`<html>
//             <head></head>
//             <body>

//                 <h1> Following are the titles of given websites: </h1>

//                 <ul>
//                 ${`<li>${title}</li>`}
//                 </ul>
//             </body>
//             </html>`);
//         } catch (err) {
//             res.status(err.status || 500).json(err.message || "Internal Server Error");
//         }
//         res.end();
//     } else {
//         try {
//             address.forEach((url) => {
//                 if (!url.match(urlRegex)) {
//                     throw { status: 404, message: "Invalid URL in address" };
//                 }
//             });
//             const response = address.map((ad) => {
//                 return axios.get(`http://${ad}`);
//             });
//             const data = await Promise.all(response);
//             const titles = [];
//             data.forEach((d) => {
//                 const $ = cheerio.load(d.data);
//                 const title = $("title").html();
//                 titles.push(title);
//             });
//             const content = titles.map((title) => {
//                 return `<li>${title}</li>`;
//             });
//             res.status(200).send(`<html>
//                 <head></head>
//                 <body>

//                     <h1> Following are the titles of given websites: </h1>

//                     <ul>
//                      ${content.toString().replace(/,/, "")}
//                     </ul>
//                 </body>
//                 </html>`);
//         } catch (err) {
//             res.status(err.staus || 500).send(err.message || "Internal Server Error");
//         }
//     }
// });

/////////////////////////////
////////////////////////////
// Promise.then SOLUTION ////
//////////////////////////
/////////////////////////

// app.get("/I/want/title", (req, res) => {
//     const { address } = req.query;
//     const urlRegex = /[a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
//     if (typeof address === "string") {
//         if (!address) {
//             res.status(400).send("Address is empty");
//         }
//         if (!address.match(urlRegex)) {
//             res.status(400).send("Invalid URL in address");
//         }

//         axios
//             .get(`http://${address}`)
//             .then((data) => {
//                 const $ = cheerio.load(data.data);
//                 const title = $("title").html();
//                 res.status(200).send(
//                     `<html>
//                      <head></head>
//                     <body>

//                       <h1> Following are the titles of given websites: </h1>

//                          <ul>
//                          ${`<li>${title}</li>`}
//                          </ul>
//                      </body>
//                      </html>`
//                 );
//             })
//             .catch((err) => {
//                 res.status(500).json(err.message);
//             });
//     } else {
//         address.forEach((url) => {
//             if (!url.match(urlRegex)) {
//                 res.status(404).send("Invalid URL in address");
//             }
//         });
//         const addPromises = address.map((ad) => {
//             return axios.get(`http://${ad}`);
//         });
//         Promise.all(addPromises)
//             .then((data) => {
//                 const titles = [];
//                 data.forEach((d) => {
//                     console.log(d);
//                     const $ = cheerio.load(d.data);
//                     const title = $("title").html();
//                     titles.push(title);
//                 });
//                 const content = titles.map((title) => {
//                     return `<li>${title}</li>`;
//                 });
//                 res.status(200).send(`<html>
//                 <head></head>
//                 <body>
//                     <h1> Following are the titles of given websites: </h1>
//                     <ul>
//                      ${content.toString().replace(/,/, "")}
//                     </ul>
//                 </body>
//                 </html>`);
//             })
//             .catch((err) => {
//                 res.status(500).send(err.message || "Internal server error");
//             });
//     }
// });

//////////////////////////////////
//////////////////////////////////
// Old School callback solution///
/////////////////////////////////
/////////////////////////////////

app.get("/I/want/title", (req, res) => {
    const { address } = req.query;
    const urlRegex = /[a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
    if (typeof address === "string") {
        if (!address) {
            res.status(400).send("Address is empty");
        }
        if (!address.match(urlRegex)) {
            res.status(400).send("Invalid URL in address");
        }

        const requestFunction = (callback, error) => {
            let data = "";
            const request = http
                .get(`http://${address}`, (res) => {
                    res.on("data", (body) => {
                        data += body;
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
                res.status(error.status || 500).send(err.message || "Internal server error");
            }
        );
    } else {
        address.forEach((url) => {
            if (!url.match(urlRegex)) {
                res.status(404).send("Invalid URL in address");
            }
        });
        const requestFunction = (callback) => {
            var data = [];
            for (var i = 0; i < address.length; i++) {
                http.get(`http://${address[i]}`, function (res) {
                    var body = "";
                    res.on("data", function (chunk) {
                        body += chunk;
                    });
                    res.on("end", function () {
                        data.push(body);
                        callback(data);
                    });
                }).on("error", function (e) {
                    console.log("Error: ", e.message);
                });
            }
        };
        let contentData = [];
        requestFunction((data) => {
            contentData.push(...data);
            console.log(data);
            // const titles = [];
            // data.forEach((d) => {
            //     const $ = cheerio.load(d);
            //     const title = $("title").html();
            //     titles.push(title);
            // });
            // content = titles.map((title) => {
            //     return `<li>${title}</li>`;
            // });
        });

        console.log(contentData);

        // res.status(200).send(`<html>
        // <head></head>
        // <body>
        //     <h1> Following are the titles of given websites: </h1>
        //  <ul>
        //      ${content.toString().replace(/,/, "")}
        //     </ul>
        // </body>
        // </html>`);
    }
});

//

//////////////////////////////////
//////////////////////////////////
// BONUES RXJS SOLUTION //////////
/////////////////////////////////
/////////////////////////////////

// app.get("/I/want/title", (req, res) => {
//     const { address } = req.query;
//     const urlRegex = /[a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
//     if (typeof address === "string") {
//         if (!address) {
//             res.status(400).send("Address is empty");
//         }
//         if (!address.match(urlRegex)) {
//             res.status(400).send("Invalid URL in address");
//         }
//         const observable = new Observable((subscriber) => {
//             axios
//                 .get(`http://${address}`)
//                 .then((data) => {
//                     subscriber.next(data);
//                 })
//                 .catch((err) => {
//                     subscriber.error(err);
//                 });
//         });
//         const subscription = observable.subscribe(
//             (data) => {
//                 const $ = cheerio.load(data.data);
//                 const title = $("title").html();

//                 res.status(200).send(
//                     `<html>
//                    <head></head>
//                   <body>

//                  <h1> Following are the titles of given websites: </h1>

//                  <ul>
//                  ${`<li>${title}</li>`}
//                  </ul>
//                 </body>
//                   </html>`
//                 );
//             },
//             (err) => {
//                 res.status(err.status || 500).send(err.message || "Internal server error");
//             }
//         );
//         setTimeout(() => {
//             subscription.unsubscribe;
//         });
//     } else {
//         address.forEach((url) => {
//             if (!url.match(urlRegex)) {
//                 res.status(400).send("Invalid URL in Address");
//             }
//         });
//         const addPromises = address.map((ad) => {
//             return axios.get(`http://${ad}`);
//         });
//         const observable = new Observable((subscriber) => {
//             Promise.all(addPromises)
//                 .then((data) => {
//                     subscriber.next(data);
//                 })
//                 .catch((err) => {
//                     subscriber.error(err);
//                 });
//         });

//         const subscription = observable.subscribe(
//             (data) => {
//                 const titles = [];
//                 data.forEach((d) => {
//                     console.log(d);
//                     const $ = cheerio.load(d.data);
//                     const title = $("title").html();
//                     titles.push(title);
//                 });
//                 const content = titles.map((title) => {
//                     return `<li>${title}</li>`;
//                 });
//                 res.status(200).send(`<html>
//                      <head></head>
//                         <body>
//                      <h1> Following are the titles of given websites: </h1>
//                          <ul>
//                          ${content.toString().replace(/,/, "")}
//                              </ul>
//                                 </body>
//                              </html>`);
//             },
//             (err) => {
//                 res.status(err.status || 500).send(err.message || "Internal server error");
//             }
//         );
//         setTimeout(() => {
//             subscription.unsubscribe;
//         });
//     }
// });

// Invalid request
app.use((req, res) => {
    res.status(404).json({ message: "Invalid route" });
});

module.exports = app;
