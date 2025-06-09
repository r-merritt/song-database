var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET search songs listing. */
router.get('/', async function(req, res, next) {
        console.log("Search songs");

        if (!(req.query.title || req.query.artist || req.query.album || req.query.tags)) {
            return;
        }

        console.log(req.query.title);
        console.log(req.query.artist);
        console.log(req.query.album);
        console.log(req.query.tags);

        const tagsSplit = req.query.tags.split(',');
        const tagArray = tagsSplit.map((tag) => tag.trim());
        console.log(tagArray);

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        const values = [
        ];

        var text = 'SELECT DISTINCT songs.song_id, songs.display_artist, display_album, artist_text, release_year, \n' +
                   'songs.display_title AS song_title, albums.display_title AS album_title FROM \n';
            
        if (req.query.title) {
            values.push(req.query.title);
            text += '(SELECT * FROM songs WHERE UPPER(display_title) = UPPER($1)) songs \n';
        } else {
            text += 'songs \n';
        }

        if (req.query.artist) {
            values.push(req.query.artist);
            text += `JOIN (SELECT * FROM artists WHERE UPPER(artist_text) = UPPER(${'$' + values.length})) artists \n`;
        } else {
            text += 'LEFT JOIN artists \n';
        }

        text += 'ON songs.display_artist = artists.artist_id \n';

        if (req.query.album) {
            values.push(req.query.album);
            text += `JOIN (SELECT * FROM albums WHERE UPPER(display_title) = UPPER(${'$' + values.length})) albums \n`;
        } else {
            text += 'LEFT JOIN albums \n';
        }

        text += 'ON songs.display_album = albums.album_id \n';

        if (req.query.tags) {
            text += 'JOIN (SELECT * FROM (SELECT * FROM tags WHERE \n';
            for (var tagIndex in tagArray) {
                values.push(tagArray[tagIndex]);
                if (tagIndex == 0) {
                    text += `UPPER(tag_text) = UPPER(${'$' + values.length}) \n`;
                } else {
                    text += `OR UPPER(tag_text) = UPPER(${'$' + values.length}) \n`;
                }
            }
            text += ') tags \n' +
                    'JOIN song_tags ON song_tags.tag_id = tags.tag_id) song_tags ON song_tags.song_id = songs.song_id \n';
        }

        text += ';'

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
