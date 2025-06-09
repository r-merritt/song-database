var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET tags by song id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get tags by song id");

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

        var text = 'SELECT song_tags.tag_id, tag_type, tag_text FROM \n' +
                   '(SELECT * FROM song_tags WHERE song_id = $1) song_tags \n' +
                   'JOIN songs ON songs.song_id = song_tags.song_id \n' +
                   'JOIN tags on tags.tag_id = song_tags.tag_id;';

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
