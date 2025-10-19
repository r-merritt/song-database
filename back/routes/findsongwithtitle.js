var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET find song with title (and artist and/or album) listing. */
router.get('/', async function(req, res, next) {
        console.log("Find song with title");

        if (!req.query.title) {
            return;
        }

        console.log(req.query.title);
        console.log(req.query.artist);
        console.log(req.query.album);

        function prepareQuery(queryText) {
            return '%' + queryText.split(' ').join('%') + '%';
        }

        const client = new Client(config.DBClientCreds);

        const values = [
            prepareQuery(req.query.title),
        ];

        var text = 'SELECT song_id, songs.display_title AS song_title, songs.display_artist, songs.display_album, artist_text, release_year, albums.display_title AS album_title \n' + 
                   'FROM (SELECT * FROM songs WHERE display_title ILIKE $1) songs \n';

        if (req.query.artist) {
            values.push(prepareQuery(req.query.artist));
            text = text + 'LEFT JOIN (SELECT * FROM artists WHERE artist_text ILIKE $2) artists ON songs.display_artist = artists.artist_id \n';
        } else {
            text += 'LEFT JOIN artists ON songs.display_artist = artists.artist_id \n';
        }

        if (req.query.album) {
            values.push(prepareQuery(req.query.album));
            text += `LEFT JOIN (SELECT * FROM albums WHERE display_title ILIKE ${'$' + values.length}) albums \n` +
                    'ON songs.display_album = albums.album_id;';
        } else {
            text += 'LEFT JOIN albums ON songs.display_album = albums.album_id; \n';
        }

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
