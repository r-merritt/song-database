var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET songs and albums by artist id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs and albums by artist id");

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

        // select song_id, songs.display_title as song_title, display_album, albums.display_title, release_year as album_title
        // from (select * from songs where display_artist = '3f79350e-61de-4412-ac98-1717bcbd4b5b') songs
        // left join albums on album_id = display_album;

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
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);

        // res.send('ok!');
    });

module.exports = router;
