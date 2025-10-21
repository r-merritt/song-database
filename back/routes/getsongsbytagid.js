var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* GET songs by tag id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs by tag id");

        if (!req.query.id) {
            return;
        }

        console.log(req.query.id);

        const client = new Client(DBClientCreds);

        const values = [
            req.query.id,
        ];

        var text = 'SELECT song_tags.song_id AS song_id, songs.display_title AS song_title, songs.display_artist, display_album, \n' +
                    'artist_text, albums.display_title AS album_title, release_year \n' +
                    'FROM (SELECT * FROM song_tags WHERE tag_id = $1) song_tags \n' +
                    'JOIN songs ON songs.song_id = song_tags.song_id \n' +
                    'LEFT JOIN artists ON display_artist = artists.artist_id \n' +
                    'LEFT JOIN albums ON display_album = album_id;';

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
