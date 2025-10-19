var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET add existing tag to song listing. */
router.get('/', async function(req, res, next) {
        console.log("Add existing tag to song");

        if (!req.query.songId || !req.query.tagId) {
            return;
        }

        console.log(req.query.songId);
        console.log(req.query.tagId);

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        const values = [
            req.query.songId,
            req.query.tagId,
        ];

        var text = 'INSERT INTO song_tags (song_id, tag_id) VALUES ($1, $2);';

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
            if (err.code == '23505') {
                res.status(400);
                answer.msg = 'Can\'t add duplicate tag';
            } else {
                res.status(418);
            }
            
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);
    });

module.exports = router;
