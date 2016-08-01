"use strict";
const fs_extra_1 = require('fs-extra');
const path_1 = require('path');
function getAuthorizedHosts() {
    let cfg = path_1.join(__dirname, '../cfg/config.json');
    return new Promise((resolve, reject) => {
        fs_extra_1.readJSON(cfg, (err, config) => {
            if (err) {
                reject(err);
            }
            resolve(config);
        });
    });
}
exports.getAuthorizedHosts = getAuthorizedHosts;
