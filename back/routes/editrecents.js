var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* POST edit recents listing. */
router.post('/', async function(req, res, next) {
        console.log("Edit recents");

        console.log(req.body.id);

        const client = new Client(DBClientCreds);

        await client.connect();

        var text = 'SELECT edit_recents($1);';

        const values = [
            req.body.id
        ];

        const query = {
            text: text,
            values: values,
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
