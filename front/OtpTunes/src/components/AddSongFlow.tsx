import { StyleSheet, Text, View, Dimensions, ScrollView, TextInput } from 'react-native';
import { useState, useEffect, Fragment, useRef } from 'react'
import { useRouter } from 'expo-router';

import Input from './Input';
import ActionButton from './ActionButton';
import SongCard from './SongCard';
import VerifyArtistAndSongs from './VerifyArtistAndSongs';
import VerifyAlbumAndSongs from './VerifyAlbumAndSongs';

import { Dictionary } from '../util/types';
import { apiAddrs } from '../util/api';

const { width } = Dimensions.get('window')

type ArtistResult = {
  id: string;
  songs: Array<string>;
  artist: string;
};

type AlbumResult = {
  id: string;
  songs: Array<string>;
  artist: string;
  title: string;
  year: number;
};

type SongResult = {
  album_title: string;
  artist_text: string;
  display_album: string;
  display_artist: string;
  release_year: number;
  song_id: string;
  song_title: string;
};

export default function AddSongFlow() {
  const router = useRouter();

  const [newTitle, setNewTitle] = useState<string>('');
  const [newArtist, setNewArtist] = useState<string>('');
  const [newAlbum, setNewAlbum] = useState<string>('');
  const [newAlbumYear, setNewAlbumYear] = useState<string>('');

  const [searchResults, setSearchResults] = useState<Array<SongResult>>([]);
  const [artistResults, setArtistResults] = useState<Array<ArtistResult>>([]);
  const [albumResults, setAlbumResults] = useState<Array<AlbumResult>>([]);

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

    setShowSongList(false);
    setShowArtistList(false);
    setShowAlbumList(false);
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

    console.log('uploading new song');
    try {
      var body = {
        songTitle: newTitle,
        artistId: matchedArtistId? matchedArtistId : null,
        newArtistText: matchedArtistId? null : (newArtist? newArtist : null),
        albumId: matchedAlbumId? matchedAlbumId : null,
        newAlbumTitle: matchedAlbumId? null : (newAlbum? newAlbum : null),
        newAlbumYear: newAlbumYear? newAlbumYear : null}
      var request = new Request(`${apiAddrs}/addsong`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetch(request)
      .then((result) => { return result.json(); })
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log(data.rows[0]['insert_new_song']);
          console.log('song uploaded');
          setNewSongId(data.rows[0]['insert_new_song']);
          resetMatchedData();
          resetTextFields();
        }
      });
    } catch (err) { console.log(err);
      setShowUploadingSong(false);
     }
  }

  function verifySongPress() {
    resetMatchedData();
    if (!newArtist && !newAlbum) {
      setShowNoArtistOrAlbumError(true);
    } else {
      setShowNoArtistOrAlbumError(false);
      try {
        fetch(`${apiAddrs}/findsongwithtitle?title=${newTitle}&artist=${newArtist}&album=${newAlbum}`)
        .then((result) => {return result.json();})
        .then((data) => {
          if (data.code) {
            console.log('Error ', data);
          } else {
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
            console.log('results ', results);
            if (results.length > 0) {
              setShowSongList(true);
            } else {
              getArtist();
            }
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
      fetch(`${apiAddrs}/getsongsbyartistname?name=${newArtist}&limit=5`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('artist results ', data.rows);
          const resultsObject : Dictionary<ArtistResult> = {};
          for (var row of data.rows) {
            var existing;
            if (!resultsObject[row.artist_id]) {
              resultsObject[row.artist_id] = {
                id: row.artist_id,
                songs: [],
                artist: row.artist_text,
              };
            }
            
            existing = resultsObject[row.artist_id].songs;

            existing.push(row.display_title);

            resultsObject[row.artist_id].songs = existing;
          }

          const resultsArray : Array<ArtistResult> = [];

          for (var obj of Object.entries(resultsObject)) {
            resultsArray.push(obj[1]);
          }
          setArtistResults(resultsArray);
          if (resultsArray.length > 0) {
            setShowArtistList(true);
          } else {
            getAlbum();
          }
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
      fetch(`${apiAddrs}/getsongsbyalbumname?name=${newAlbum}&limit=5`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('album results ', data.rows);
          const resultsObject : Dictionary<AlbumResult> = {};
          for (var row of data.rows) {
            var existing;
            if (!resultsObject[row.album_id]) {
              resultsObject[row.album_id] = {
                id: row.album_id,
                songs: [],
                artist: row.artist_text,
                title: row.album_title,
                year: row.release_year,
              };
            }
            
            existing = resultsObject[row.album_id].songs;

            existing.push(row.song_title);

            resultsObject[row.album_id].songs = existing;
          }

          const resultsArray = []
          
          for (var obj of Object.entries(resultsObject)) {
            resultsArray.push(obj[1]);
          }

          setAlbumResults(resultsArray);
          if (resultsArray.length > 0) {
            setShowAlbumList(true);
          } else {
            setShowAreYouSure(true);
            setShowVerifySong(false);
          }
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

  function artistVerify(artist : ArtistResult) {
    setMatchedArtistId(artist.id);
    setMatchedArtistText(artist.artist);
    setShowArtistList(false);
    getAlbum();
  }

  function albumVerify(album : AlbumResult) {
    setMatchedAlbumId(album.id);
    setMatchedAlbumText(album.title);
    setMatchedAlbumYear(`${album.year}`);
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
    <ScrollView>
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
                { artistResults.map((result) => {
                  return (
                    <VerifyArtistAndSongs
                      key={result.id}
                      artist={result.artist}
                      songs={result.songs}
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
                { albumResults.map((result) => {
                  return (
                    <VerifyAlbumAndSongs
                      key={result.id}
                      album={result.title}
                      artist={result.artist}
                      songs={result.songs}
                      year={result.year}
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
            <Text style={styles.verifyText}>Add song with the following information?</Text>
            <Text style={styles.verifyText}>Please make sure everything is spelled and capitalized correctly!</Text>
            <Text style={styles.verifyText}>Title: {newTitle}</Text>
            {(matchedArtistText || newArtist) &&
              <Text style={styles.verifyText}>Artist: {matchedArtistText ? matchedArtistText : newArtist}</Text>
            }
            {(matchedAlbumText || newAlbum) && 
              <Text style={styles.verifyText}>Album: {matchedAlbumText ? matchedAlbumText : newAlbum}</Text>
            }
            {(matchedAlbumYear || newAlbumYear) &&
              <Text style={styles.verifyText}>Release year: {matchedAlbumYear ? matchedAlbumYear : newAlbumYear}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },
  songsContainer: {
    padding: 15,
    width: '90%',
  },
  verifyText: {
    fontFamily: "DMMono_400Regular",
    paddingBottom: 6,
  },
  artistListContainer: {
    padding: 15,
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
    marginBottom: 20,
    fontFamily: "DMMono_400Regular",
  },
  button: {
    paddingTop: 15,
    paddingRight: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  matchText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: "DMMono_400Regular",
  },
  label: {
    padding: 12,
    fontSize: 16,
    width: width - (width/4),
    fontFamily: "DMMono_400Regular",
  },
});