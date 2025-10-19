var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var config = require('../config');

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

        const client = new Client(config.DBClientCreds);

        function prepareQuery(queryText) {
            return '%' + queryText.split(' ').join('%') + '%';
        }

        const values = [
        ];

        var text = 'SELECT DISTINCT songs.song_id, songs.display_artist, display_album, artist_text, release_year, \n' +
                   'songs.display_title AS song_title, albums.display_title AS album_title FROM \n';
            
        if (req.query.title) {
            values.push(prepareQuery(req.query.title));
            text += '(SELECT * FROM songs WHERE display_title ILIKE $1) songs \n';
        } else {
            text += 'songs \n';
        }

        if (req.query.artist) {
            values.push(prepareQuery(req.query.artist));
            text += `JOIN (SELECT * FROM artists WHERE artist_text ILIKE ${'$' + values.length}) artists \n`;
        } else {
            text += 'LEFT JOIN artists \n';
        }

        text += 'ON songs.display_artist = artists.artist_id \n';

        if (req.query.album) {
            values.push(prepareQuery(req.query.album));
            text += `JOIN (SELECT * FROM albums WHERE display_title ILIKE ${'$' + values.length}) albums \n`;
        } else {
            text += 'LEFT JOIN albums \n';
        }

        text += 'ON songs.display_album = albums.album_id \n';

        if (req.query.tags) {
            text += 'WHERE song_id IN (SELECT song_id FROM song_tags JOIN (SELECT * FROM tags WHERE \n';
            for (var tagIndex in tagArray) {
                values.push(prepareQuery(tagArray[tagIndex]));
                if (tagIndex == 0) {
                    text += `tag_text ILIKE ${'$' + values.length} \n`;
                } else {
                    text += `OR tag_text ILIKE ${'$' + values.length} \n`;
                }
            }
            text += ') tags \n' +
                    `ON tags.tag_id = song_tags.tag_id GROUP BY song_id HAVING COUNT(song_id) = ${tagArray.length}) \n`;
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
            answer = {code: err.code};
            res.status(418);
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);

    });

module.exports = router;
