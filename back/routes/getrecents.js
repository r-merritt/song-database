var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET recents listing. */
router.get('/', async function(req, res, next) {
        console.log("Get recents");

        const client = new Client(config.DBClientCreds);

        await client.connect();

        var text = 'SELECT * FROM recent_edits;';

        const query = {
            text: text,
        };

        console.log(query);

        var answer;

        try {
            answer = await client.query(query);
        } catch (err) {
            console.log(err);
            answer = {code: err.code};
            res.status(418);
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);
    });

module.exports = router;
