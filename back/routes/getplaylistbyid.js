var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* GET playlist by id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get playlist by id");

        if (!req.query.id) {
            return;
        }

        console.log(req.query.id);

        const client = new Client(DBClientCreds);

        const values = [
            req.query.id,
        ];

        var text = 'SELECT * FROM playlists WHERE playlist_id = $1;';

        const query = {
            text: text,
            values: values,
        };

        console.log(query);

        await client.connect();

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
