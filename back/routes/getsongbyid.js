var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET get song by id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get song by id");

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


        var text = 'SELECT song_id, songs.display_artist AS song_artist_id, songs.display_album AS song_album_id, show_artist_or_album, \n' +
                   'albums.display_artist AS album_artist_id, songs.display_title AS song_title, albums.display_title AS album_title, a1.artist_text AS song_artist, \n' +
                   'a2.artist_text AS album_artist, albums.release_year \n' +
                   'FROM (SELECT * FROM songs WHERE song_id = $1) songs \n' +
                   'LEFT JOIN albums ON songs.display_album = albums.album_id \n' +
                   'LEFT JOIN artists AS a1 ON songs.display_artist = a1.artist_id \n' +
                   'LEFT JOIN artists AS a2 ON albums.display_artist = a2.artist_id;';

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
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);

        // res.send('ok!');
    });

module.exports = router;
