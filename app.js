const express = require("express");
const app = express();
const titleRouter = require("./router/titleRouter");

app.use("/I/want/title", titleRouter);
// Invalid request
app.use((req, res) => {
    res.status(404).json({ message: "Invalid route" });
});

module.exports = app;
