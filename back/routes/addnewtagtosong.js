var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* GET add new tag to song listing. */
router.get('/', async function(req, res, next) {
        console.log("Add new tag to song");

        if (!req.query.id || !req.query.tag || !req.query.type) {
            return;
        }

        console.log(req.query.id);

        const client = new Client(DBClientCreds);

        const values = [
            req.query.id,
            req.query.tag,
            req.query.type,
        ];

        var text = 'SELECT add_tag_to_song($1, $2, $3)';

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
