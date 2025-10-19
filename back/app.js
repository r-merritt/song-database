var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var getallsongsRouter = require('./routes/getallsongs');
var addSongRounter = require('./routes/addsong');
var findSongWithTitleRouter = require('./routes/findsongwithtitle');
var getSongsByArtistNameRouter = require ('./routes/getsongsbyartistname');
var getSongsByAlbumNameRouter = require ('./routes/getsongsbyalbumname');
var getSongByIdRouter = require ('./routes/getsongbyid');
var getTagsBySongIdRouter = require ('./routes/gettagsbysongid');
var addNewTagToSongRouter = require('./routes/addnewtagtosong');
var addExistingTagToSongRouter = require('./routes/addexistingtagtosong');
var getTagByTextRouter = require('./routes/gettagbytext');
var searchSongsRouter = require('./routes/searchsongs');
var getArtistByIdRouter = require('./routes/getartistbyid');
var getSongsAndAlbumsByArtistIdRouter = require('./routes/getsongsandalbumsbyartistid');
var getTagByIdRouter = require('./routes/gettagbyid');
var getSongsByTagIdRouter = require('./routes/getsongsbytagid');
var getAlbumByIdRouter = require('./routes/getalbumbyid');
var getSongsByAlbumIdRouter = require('./routes/getsongsbyalbumid');
var searchPlaylistsByTagsRouter = require('./routes/searchplaylistsbytags');
var getPlaylistByIdRouter = require('./routes/getplaylistbyid');
var getSongsByPlaylistIdRouter = require ('./routes/getsongsbyplaylistid');
var getTagsByPlaylistIdRouter = require ('./routes/gettagsbyplaylistid');
var addExistingTagToPlaylistRouter = require('./routes/addexistingtagtoplaylist');
var addNewTagToPlaylistRouter = require('./routes/addnewtagtoplaylist');
var editRecentsRouter = require('./routes/editrecents');
var getRecentsRouter = require('./routes/getrecents');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/getallsongs', getallsongsRouter);
app.use('/addsong', addSongRounter);
app.use('/findsongwithtitle', findSongWithTitleRouter);
app.use('/getsongsbyartistname', getSongsByArtistNameRouter);
app.use('/getsongsbyalbumname', getSongsByAlbumNameRouter);
app.use('/getsongbyid', getSongByIdRouter);
app.use('/gettagsbysongid', getTagsBySongIdRouter);
app.use('/addnewtagtosong', addNewTagToSongRouter);
app.use('/addexistingtagtosong', addExistingTagToSongRouter);
app.use('/gettagbytext', getTagByTextRouter);
app.use('/searchsongs', searchSongsRouter);
app.use('/getartistbyid', getArtistByIdRouter);
app.use('/getsongsandalbumsbyartistid', getSongsAndAlbumsByArtistIdRouter);
app.use('/gettagbyid', getTagByIdRouter);
app.use('/getsongsbytagid', getSongsByTagIdRouter);
app.use('/getalbumbyid', getAlbumByIdRouter);
app.use('/getsongsbyalbumid', getSongsByAlbumIdRouter);
app.use('/searchplaylistsbytags', searchPlaylistsByTagsRouter);
app.use('/getplaylistbyid', getPlaylistByIdRouter);
app.use('/getsongsbyplaylistid', getSongsByPlaylistIdRouter);
app.use('/gettagsbyplaylistid', getTagsByPlaylistIdRouter);
app.use('/addexistingtagtoplaylist', addExistingTagToPlaylistRouter);
app.use('/addnewtagtoplaylist', addNewTagToPlaylistRouter);
app.use('/editrecents', editRecentsRouter);
app.use('/getrecents', getRecentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
