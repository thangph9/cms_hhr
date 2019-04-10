/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-var */
var express = require('express');
var router = express.Router();
router.use('/user', require('./user'));
router.use('/upload', require('./upload'));
router.use('/track', require('./track'));
router.use('/question', require('./question'));
router.use('/group', require('./group'));
router.use('/members', require('./members'));
router.use('/menu', require('./menu'));
router.use('/menuItem', require('./menuItem'));
router.use('/rule', require('./rule'));
module.exports = router;
