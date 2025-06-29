var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET songs by tag id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs by tag id");

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

//         select song_tags.song_id as song_id, songs.display_title as song_title, songs.display_artist, display_album,
// artist_text, albums.display_title as album_title
// from (select * from song_tags where tag_id = 'f94af0b6-1cdc-4897-b993-3f93fa013e49') song_tags
// join songs on songs.song_id = song_tags.song_id
// left join artists on display_artist = artists.artist_id
// left join albums on display_album = album_id;

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
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);

        // res.send('ok!');
    });

module.exports = router;
