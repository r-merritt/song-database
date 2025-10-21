var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* GET songs and albums by artist id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs and albums by artist id");

        if (!req.query.id) {
            return;
        }

        console.log(req.query.id);

        const client = new Client(DBClientCreds);

        const values = [
            req.query.id,
        ];

        var text = 'SELECT song_id, songs.display_title AS song_title, display_album, albums.display_title AS album_title, release_year \n' +
                   'FROM (SELECT * FROM songs WHERE display_artist = $1) songs \n' +
                   'LEFT JOIN albums ON album_id = display_album;';

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
