var express = require("express");
var router = express.Router();

//404 error
router.use(function (req, res, next) {
    return res.status(404).send("The page you were looking does not exist. :(");
});

//500 error
router.use(function (err, req, res, next) {
    return res.status(500).send(err);
});

module.exports = router;