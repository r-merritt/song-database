var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* GET search playlists by tags listing. */
router.get('/', async function(req, res, next) {
        console.log("Search playlists by tags");

        if (!req.query.tags) {
            return;
        }
        console.log(req.query.tags);

        const tagsSplit = req.query.tags.split(',');
        const tagArray = tagsSplit.map((tag) => tag.trim());
        console.log(tagArray);

        const client = new Client(DBClientCreds);

        function prepareQuery(queryText) {
            return '%' + queryText.split(' ').join('%') + '%';
        }

        const values = [];

        var text = 'SELECT * FROM playlists WHERE playlist_id IN \n' +
                    '(SELECT playlist_id FROM playlist_tags JOIN \n' +
                    '(SELECT * FROM tags WHERE \n';

        for (var tagIndex in tagArray) {
            values.push(prepareQuery(tagArray[tagIndex]));
            if (tagIndex == 0) {
                text += `tag_text ILIKE ${'$' + values.length} \n`;
            } else {
                text += `OR tag_text ILIKE ${'$' + values.length} \n`;
            }
        }

        text += ') tags \n' +
                `ON playlist_tags.tag_id = tags.tag_id GROUP BY playlist_id HAVING COUNT(playlist_id) >= ${tagArray.length}) \n`;

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
