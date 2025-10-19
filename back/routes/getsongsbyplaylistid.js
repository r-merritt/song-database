var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET songs by playlist id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs by playlist id");

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

        var text = 'SELECT songs.song_id, song_order, commentary, songs.display_title AS song_title, show_artist_or_album, artist_text, \n' +
                   'albums.display_title AS album_title \n' +
                   'FROM (SELECT * FROM playlist_songs WHERE playlist_id = $1) playlists \n' +
                   'JOIN songs on playlists.song_id = songs.song_id \n' +
                   'JOIN artists on artists.artist_id = songs.display_artist \n' +
                   'JOIN albums ON albums.album_id = songs.display_album;';

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
