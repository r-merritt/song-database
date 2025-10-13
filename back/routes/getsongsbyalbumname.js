var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET songs by album name listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs by album name");

        if (!req.query.name) {
            return;
        }

        console.log(req.query.name);

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        function prepareQuery(queryText) {
            return '%' + queryText.split(' ').join('%') + '%';
        }

        const values = [
            prepareQuery(req.query.name),
        ];


        if (req.query.limit) {
            values.push(req.query.limit);
        } else {
            values.push(5);
        }

        var text = 'SELECT album_id, release_year, songs.display_title as song_title, albums.display_title as album_title, artist_text \n' +
                   'FROM (SELECT * FROM albums WHERE display_title ILIKE $1) albums \n' +
                   'JOIN LATERAL (SELECT * FROM songs WHERE songs.display_album = albums.album_id LIMIT $2) songs \n' +
                   'ON songs.display_album = albums.album_id \n' +
                   'LEFT JOIN artists on artists.artist_id = albums.display_artist;';

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
