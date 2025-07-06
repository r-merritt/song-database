import { StyleSheet, Text, View, Dimensions, ScrollView, TextInput } from 'react-native';
import { useState, useEffect, Fragment, useRef } from 'react'
import { useRouter } from 'expo-router';

import Input from './Input';
import ActionButton from './ActionButton';
import SongCard from './SongCard';
import VerifyArtistAndSongs from './VerifyArtistAndSongs';
import VerifyAlbumAndSongs from './VerifyAlbumAndSongs';

const { width } = Dimensions.get('window')

export default function AddSongFlow() {
  const router = useRouter();

  const [newTitle, setNewTitle] = useState<string>('');
  const [newArtist, setNewArtist] = useState<string>('');
  const [newAlbum, setNewAlbum] = useState<string>('');
  const [newAlbumYear, setNewAlbumYear] = useState<string>('');

  const [searchResults, setSearchResults] = useState<Array<Object>>([]);
  const [artistResults, setArtistResults] = useState<Array<Array<Object>>>([]);
  const [albumResults, setAlbumResults] = useState<Array<Array<Object>>>([]);

  const [showVerifySong, setShowVerifySong] = useState<boolean>(true);
  const [showSongList, setShowSongList] = useState<boolean>(false);
  const [showArtistList, setShowArtistList] = useState<boolean>(false);
  const [showAlbumList, setShowAlbumList] = useState<boolean>(false);
  const [showAlbumReleaseYear, setShowAlbumReleaseYear] = useState<boolean>(false);
  const [showUploadingSong, setShowUploadingSong] = useState<boolean>(false);

  const [matchedArtistId, setMatchedArtistId] = useState<string>('');
  const [matchedArtistText, setMatchedArtistText] = useState<string>('');
  const [matchedAlbumId, setMatchedAlbumId] = useState<string>('');
  const [matchedAlbumText, setMatchedAlbumText] = useState<string>('');
  const [matchedAlbumYear, setMatchedAlbumYear] = useState<string>('');

  const [newSongId, setNewSongId] = useState<string>('');
  const [showAreYouSure, setShowAreYouSure] = useState<boolean>(false);
  const [showNoArtistOrAlbumError, setShowNoArtistOrAlbumError] = useState<boolean>(false);

  const titleRef = useRef<TextInput>(null);
  const artistRef = useRef<TextInput>(null);
  const albumRef = useRef<TextInput>(null);
  const albumReleaseRef = useRef<TextInput>(null);

  function resetMatchedData() {
    setMatchedArtistId('');
    setMatchedAlbumId('');
    setMatchedArtistText('');
    setMatchedAlbumText('');
    setMatchedAlbumYear('');

    setShowUploadingSong(false);
    setShowVerifySong(true);
    setShowAreYouSure(false);
  }

  function resetTextFields() {
    setNewTitle('');
    setNewArtist('');
    setNewAlbum('');
    setNewAlbumYear('');
    
    setShowAlbumReleaseYear(false);

    titleRef.current?.clear();
    artistRef.current?.clear();
    albumRef.current?.clear();
    albumReleaseRef.current?.clear();
  }

  function onChangeText(type : string, text : string) {
    switch(type) {
      case 'title':
        setNewTitle(text);
        break;
      case 'artist':
        setNewArtist(text);
        break;
      case 'album':
        setNewAlbum(text);
        break;
      case 'albumYear':
        setNewAlbumYear(text);
        break;
    }
  }

  useEffect(() => {
    if (newAlbum) {
      setShowAlbumReleaseYear(true);
    } else {
      setShowAlbumReleaseYear(false);
    }
  }, [newAlbum])

  function uploadSong() {
    setShowUploadingSong(true);
    // we're finally here. Egypt.
    console.log('uploading new song');
    try {
      var body = {
        songTitle: newTitle,
        artistId: matchedArtistId? matchedArtistId : null,
        newArtistText: matchedArtistId? null : (newArtist? newArtist : null),
        albumId: matchedAlbumId? matchedAlbumId : null,
        newAlbumTitle: matchedAlbumId? null : (newAlbum? newAlbum : null),
        newAlbumYear: newAlbumYear? newAlbumYear : null}
      var request = new Request('http://localhost:3000/addsong', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetch(request)
      .then((result) => { return result.json(); })
      .then((data) => {
        console.log(data.rows[0]['insert_new_song']);
        console.log('song uploaded');
        setNewSongId(data.rows[0]['insert_new_song']);
        resetMatchedData();
        resetTextFields();
      });

    } catch (err) { console.log(err);
      setShowUploadingSong(false);
     }
  }

  function verifySongPress() {
    if (!newArtist && !newAlbum) {
      setShowNoArtistOrAlbumError(true);
    } else {
      setShowNoArtistOrAlbumError(false);
      try {
        fetch(`http://localhost:3000/findsongwithtitle?title=${newTitle}&artist=${newArtist}&album=${newAlbum}`)
        .then((result) => {return result.json();})
        .then((data) => {
          console.log('song result ', data.rows);

          var results = [];

          for (var result of data.rows) {
            if ((!result['artist_text']) && result['display_artist']) {
              // The artist didn't match search input
              continue;
            } else if ((!result['album_title']) && result['display_album']) {
              // The album didn't match search input
              continue;
            } else {
              results.push(result);
            }
          }

          setSearchResults(results);
          if (results.length > 0) {
            setShowSongList(true);
          } else {
            getArtist();
          }
          })
      } catch (err) { console.log(err); }
    }
  }

  function getArtist() {
      setShowSongList(false);
      if (!newArtist) {
        getAlbum();
      }
      try {
      fetch(`http://localhost:3000/getsongsbyartistname?name=${newArtist}&limit=5`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('artist results ', data.rows);
        const resultsObject = {};
        for (var row of data.rows) {
          var existing;
          if (!resultsObject[row.artist_id]) {
            resultsObject[row.artist_id] = {};
            resultsObject[row.artist_id].songs = [];
            resultsObject[row.artist_id].artist = row.artist_text;
          }
          
          existing = resultsObject[row.artist_id].songs;

          existing.push(row.display_title);

          resultsObject[row.artist_id].songs = existing;
        }

        const resultsArray = [];

        for (var obj of Object.entries(resultsObject)) {
          resultsArray.push(obj);
        }
        setArtistResults(resultsArray);
        if (resultsArray.length > 0) {
          setShowArtistList(true);
        } else {
          getAlbum();
        }
        })
    } catch (err) { console.log(err); }
  }

function getAlbum() {
      if (!newAlbum) {
        setShowAreYouSure(true);
        setShowVerifySong(false);
      }
      try {
      fetch(`http://localhost:3000/getsongsbyalbumname?name=${newAlbum}&limit=5`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('album results ', data.rows);
        const resultsObject = {};
        for (var row of data.rows) {
          var existing;
          if (!resultsObject[row.album_id]) {
            resultsObject[row.album_id] = {};
            resultsObject[row.album_id].songs = [];
            resultsObject[row.album_id].artist = row.artist_text;
            resultsObject[row.album_id].title = row.album_title;
            resultsObject[row.album_id].year = row.release_year;
          }
          
          existing = resultsObject[row.album_id].songs;

          existing.push(row.song_title);

          resultsObject[row.album_id].songs = existing;
        }

        const resultsArray = []
        
        for (var obj of Object.entries(resultsObject)) {
          resultsArray.push(obj);
        }

        setAlbumResults(resultsArray);
        if (resultsArray.length > 0) {
          setShowAlbumList(true);
        } else {
          setShowAreYouSure(true);
          setShowVerifySong(false);
        }
      })
    } catch (err) { console.log(err); }
  }

  function onSongMatch(songId: string) {
    resetMatchedData();
    resetTextFields();
    setShowSongList(false);
    console.log('matched song ', songId);
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  function artistVerify(artist) {
    setMatchedArtistId(artist[0]);
    setMatchedArtistText(artist[1].artist);
    setShowArtistList(false);
    getAlbum();
  }

  function albumVerify(album) {
    setMatchedAlbumId(album[0]);
    setMatchedAlbumText(album[1].title);
    setMatchedAlbumYear(album[1].year);
    setShowAlbumList(false);
    setShowAreYouSure(true);
    setShowVerifySong(false);
  }

  function noSongMatch() {
    getArtist();
    setShowSongList(false);
  }

  function noArtistMatch() {
    setShowArtistList(false);
    getAlbum();
  }

  function noAlbumMatch() {
    setShowAlbumList(false);
    setShowAreYouSure(true);
    setShowVerifySong(false);
  }

  function goToSong() {
      router.navigate({
        pathname: '/song/[id]',
        params: { id: newSongId }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a song</Text>

      <Text style={styles.label}>Title:</Text>
      <Input
          ref={titleRef}
          placeholder='title'
          type='title'
          onChangeText={onChangeText}
      />
      <Text style={styles.label}>Artist:</Text>
      <Input
          ref={artistRef}
          placeholder='artist'
          type='artist'
          onChangeText={onChangeText}
      />
      <Text style={styles.label}>Album:</Text>
      <Input
          ref={albumRef}
          placeholder='album'
          type='album'
          onChangeText={onChangeText}
      />
      { showAlbumReleaseYear && 
        <Fragment>
          <Text style={styles.label}>Album Release Year:</Text>
          <Input
              ref={albumReleaseRef}
              placeholder='album'
              type='albumYear'
              onChangeText={onChangeText}
          />
        </Fragment>
      }
      { showVerifySong &&
        <View style={styles.button}>
          <ActionButton title='Verify song' onPress={verifySongPress}/>
        </View>
      }
      { showNoArtistOrAlbumError && 
        <Text>The song must have an artist or album</Text>
      }
      { showUploadingSong &&
        <Text style={styles.matchText}>Okay, uploading new song...</Text>
      }
      {showSongList &&
        ( <View style={styles.songsContainer}>
            <Text style={styles.matchText}>Do any of these results match your song?</Text>
            { searchResults.map((result, key) => {
              return (
                  <SongCard
                    key={key}
                    title={result['song_title']}
                    artist={result['artist_text']}
                    album={result['album_title']}
                    onVerify={() => onSongMatch(result['song_id'])}/>
              );
            })
           }
           <View style={styles.button}>
            <ActionButton title='No, none of these match' onPress={noSongMatch} />
           </View>
        </View>
      ) 
      }

      { showArtistList &&
          (
            <View style={styles.artistListContainer}>
            <Text style={styles.matchText}>Are any of these artists the {newArtist} you intended?</Text>
            <View style={styles.artistsContainer}>
              { artistResults.map((result, key) => {
                return (
                  <VerifyArtistAndSongs
                    key={key}
                    artist={result[1].artist}
                    songs={result[1].songs}
                    onVerify={() => artistVerify(result)} />
                );
              })

              }
            </View>
              <ActionButton title='No, none of these match' onPress={noArtistMatch} />
            </View>
          )
      }

      { showAlbumList &&
          (
            <View style={styles.artistListContainer}>
            <Text style={styles.matchText}>Are any of these albums the {newAlbum} you intended?</Text>
            <View style={styles.artistsContainer}>
              { albumResults.map((result, key) => {
                return (
                  <VerifyAlbumAndSongs
                    key={key}
                    album={result[1].title}
                    artist={result[1].artist}
                    songs={result[1].songs}
                    year={result[1].year}
                    onVerify={() => albumVerify(result)} />
                );
              })

              }
            </View>
              <ActionButton title='No, none of these match' onPress={noAlbumMatch} />
            </View>
          )
      }
      { showAreYouSure && (
        <View style={styles.container}>
          <Text>Add song with the following information?</Text>
          <Text>Please make sure everything is spelled and capitalized correctly!</Text>
          <Text>Title: {newTitle}</Text>
          {(matchedArtistText || newArtist) &&
            <Text>Artist: {matchedArtistText ? matchedArtistText : newArtist}</Text>
          }
          {(matchedAlbumText || newAlbum) && 
            <Text>Album: {matchedAlbumText ? matchedAlbumText : newAlbum}</Text>
          }
          {(matchedAlbumYear || newAlbumYear) &&
            <Text>Release year: {matchedAlbumYear ? matchedAlbumYear : newAlbumYear}</Text>
          }
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <ActionButton title='Yes, add!' onPress={uploadSong} />
            </View>
            <View style={styles.button}>
              <ActionButton title={'No, don\'t add'} onPress={resetMatchedData} />
            </View>
          </View>
        </View>
      )}
      { newSongId &&
        <ActionButton title='Go to added song' onPress={goToSong} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  songsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: '90%',
  },
  artistListContainer: {
    width: '90%',
  },
  artistsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    maxWidth: '100%',
    width: width - (width/3),
  },
  title: {
    fontSize: 32,
    margin: 20,
    color: 'gray',
  },
  button: {
    padding: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  matchText: {
    fontSize: 24,
    color: 'gray',
    textAlign: 'center',
  },
  label: {
    padding: 12,
    fontSize: 18,
    width: width - (width/4),
    maxWidth: '85%',
    color: 'gray',
  },
});