var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET tags by playlist id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get tags by playlist id");

        if (!req.query.id) {
            return;
        }

        console.log(req.query.id);

        const client = new Client(config.DBClientCreds);

        const values = [
            req.query.id,
        ];

        var text = 'SELECT playlist_tags.tag_id, tag_type, tag_text FROM \n' +
                   '(SELECT * FROM playlist_tags WHERE playlist_id = $1) playlist_tags \n' +
                   'JOIN tags on tags.tag_id = playlist_tags.tag_id;';

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
