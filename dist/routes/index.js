"use strict";
const express = require('express');
const redploy_controller_1 = require('../controllers/redploy.controller');
let router = express.Router();
router.get('/redeploy/:name', redploy_controller_1.RedeployController.run);
