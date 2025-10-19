var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET all songs listing. */
router.get('/', async function(req, res, next) {
        console.log("Get all songs");

        const client = new Client(config.DBClientCreds);

        await client.connect();

        const query = await client.query('SELECT * FROM songs');

        await client.end();

        res.contentType = 'application/json';
        res.send(query);
    });

module.exports = router;
