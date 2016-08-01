"use strict";
const express = require('express');
const cors = require('cors');
const authorized_hosts_1 = require('./authorized-hosts');
let port = process.env.PORT || 6132;
let app = express();
authorized_hosts_1.getAuthorizedHosts().then((hosts) => {
    app.use(cors(hosts));
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
