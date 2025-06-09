var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET find song with title listing. */
router.get('/', async function(req, res, next) {
        console.log("Find song with title");

        if (!req.query.title) {
            return;
        }

        console.log(req.query.title);
        console.log(req.query.artist);
        console.log(req.query.album);


        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        const values = [
            req.query.title,
        ];

        var text = 'SELECT song_id, songs.display_title AS song_title, songs.display_artist, songs.display_album, artist_text, release_year, albums.display_title AS album_title \n' + 
                   'FROM (SELECT * FROM songs WHERE UPPER(display_title) = UPPER($1)) songs \n';

        if (req.query.artist) {
            values.push(req.query.artist);
            text = text + 'LEFT JOIN (SELECT * FROM artists WHERE UPPER(artist_text) = UPPER($2)) artists ON songs.display_artist = artists.artist_id \n';
        } else {
            text += 'LEFT JOIN artists ON songs.display_artist = artists.artist_id \n';
        }

        if (req.query.album) {
            values.push(req.query.album);
            text += `LEFT JOIN (SELECT * FROM albums WHERE UPPER(display_title) = UPPER(${'$' + values.length})) albums \n` +
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
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);

        // res.send('ok!');
    });

module.exports = router;
