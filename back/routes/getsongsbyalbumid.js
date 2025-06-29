var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET songs by album id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs by album id");

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


        var text = 'SELECT song_id, songs.display_title as song_title, artist_text \n' +
                   'FROM (SELECT * FROM albums WHERE album_id = $1) albums \n' +
                   'JOIN LATERAL (SELECT * FROM songs WHERE songs.display_album = albums.album_id) songs \n' +
                   'ON songs.display_album = albums.album_id \n' +
                   'JOIN artists on artists.artist_id = songs.display_artist;';

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
