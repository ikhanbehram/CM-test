const express = require("express");
const router = express.Router();
const thenController = require("../controllers/getTitle.then");
const awaitController = require("../controllers/getTitle.await");
const rxjsController = require("../controllers/getTitle.rxjs");
const callbackRouter = require("../controllers/getTitle.callback");

router.get("/then", thenController.getTitle);
router.get("/await", awaitController.getTitle);
router.get("/rxjs", rxjsController.getTitle);
router.get("/callback", callbackRouter.getTitle);

module.exports = router;
