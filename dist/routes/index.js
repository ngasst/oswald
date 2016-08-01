"use strict";
const express = require('express');
const redeploy_controller_1 = require('../controllers/redeploy.controller');
let router = express.Router();
router.get('/redeploy/:repo/:service/:compose', redeploy_controller_1.RedeployController.run);
exports.routes = router;
