var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET album by id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get album by id");

        if (!req.query.id) {
            return;
        }

        console.log(req.query.id);

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        const values = [
            req.query.id,
        ];

        var text = 'SELECT display_title, display_artist, release_year, artist_text \n' +
                    'FROM (SELECT * FROM albums WHERE album_id = $1) albums \n' +
                    'LEFT JOIN artists ON display_artist = artist_id;';

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
