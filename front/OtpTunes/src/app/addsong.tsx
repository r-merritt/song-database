import { StyleSheet, Text, View, Dimensions, ScrollView, TextInput } from 'react-native';
import { useState, useEffect, Fragment, useRef } from 'react'
import { useRouter } from 'expo-router';

import Input from '../components/Input';
import ActionButton from '../components/ActionButton';
import SongCard from '../components/SongCard';
import VerifyArtistAndSongs from '../components/VerifyArtistAndSongs';
import VerifyAlbumAndSongs from '../components/VerifyAlbumAndSongs';

const { width } = Dimensions.get('window')

export default function AddSong() {
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
  const [matchedAlbumId, setMatchedAlbumId] = useState<string>('');

  const [newSongId, setNewSongId] = useState<string>('');

  const titleRef = useRef<TextInput>(null);
  const artistRef = useRef<TextInput>(null);
  const albumRef = useRef<TextInput>(null);
  const albumReleaseRef = useRef<TextInput>(null);

  function resetFields() {
    setNewTitle('');
    setNewArtist('');
    setNewAlbum('');
    setNewAlbumYear('');

    setMatchedArtistId('');
    setMatchedAlbumId('');

    setShowUploadingSong(false);
    setShowAlbumReleaseYear(false);
    setShowVerifySong(true);

    titleRef.current?.clear();
    artistRef.current?.clear();
    albumRef.current?.clear();
    albumReleaseRef.current?.clear();
  }

  useEffect(() => {
    if (matchedAlbumId && showUploadingSong) {
      uploadSong();
    }
  }, [matchedAlbumId, showUploadingSong]);

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
        resetFields();
      });

    } catch (err) { console.log(err);
      setShowUploadingSong(false);
     }
  }

  function verifySongPress() {
    try {
      fetch(`http://localhost:3000/findsongwithtitle?title=${newTitle}&artist=${newArtist}&album=${newAlbum}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('song result ', data.rows);
        setSearchResults(data.rows);
        if (data.rows.length > 0) {
          setShowSongList(true);
        } else {
          getArtist();
        }
        })
    } catch (err) { console.log(err); }
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
        uploadSong();
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
          setShowUploadingSong(true);
          uploadSong();
        }
      })
    } catch (err) { console.log(err); }
  }

  function onSongMatch(songId: string) {
    console.log('matched song ', songId);
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  function artistVerify(artistId : string) {
    setMatchedArtistId(artistId);
    setShowArtistList(false);
    getAlbum();
  }

  function albumVerify(albumId : string) {
    setMatchedAlbumId(albumId);
    setShowAlbumList(false);
    setShowUploadingSong(true);
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
    setShowUploadingSong(true);
    uploadSong();
  }

  function goToSong() {
      router.navigate({
        pathname: '/song/[id]',
        params: { id: newSongId }
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>It's OTPTunes!</Text>

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
        <ActionButton title='Verify song' onPress={verifySongPress}/>
      }
      { showUploadingSong &&
        <Text style={styles.matchText}>Okay, uploading new song...</Text>
      }
      { newSongId &&
        <ActionButton title='Go to added song' onPress={goToSong} />
      }
      {showSongList &&
        ( <View style={styles.songsContainer}>
            <Text style={styles.matchText}>Do any of these results match your song?</Text>
            { searchResults.map((result, key) => {

              // The artist didn't match search input
              if ((!result['artist_text']) && result['display_artist']) {
                return (<Fragment key={key}></Fragment>);
              }

              // The album didn't match search input
              if ((!result['album_title']) && result['display_album']) {
                return (<Fragment key={key}></Fragment>);
              }

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
                    onVerify={() => artistVerify(result[0])} />
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
                    onVerify={() => albumVerify(result[0])} />
                );
              })

              }
            </View>
            <ActionButton title='No, none of these match' onPress={noAlbumMatch} />
            </View>
          )
      }
    </ScrollView>
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