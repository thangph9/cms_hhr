/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-var */
var express = require('express');
var router = express.Router();
router.use('/user', require('./user'));
router.use('/upload', require('./upload'));
module.exports = router;
