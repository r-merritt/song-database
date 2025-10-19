var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET add existing tag to playlist listing. */
router.get('/', async function(req, res, next) {
        console.log("Add existing tag to playlist");

        if (!req.query.playlistId || !req.query.tagId) {
            return;
        }

        console.log(req.query.playlistId);
        console.log(req.query.tagId);

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        const values = [
            req.query.playlistId,
            req.query.tagId,
        ];

        var text = 'INSERT INTO playlist_tags (playlist_id, tag_id) VALUES ($1, $2);';

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
