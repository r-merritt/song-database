import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

import DisplayAlbumAndSongs from '@/src/components/DisplayAlbumAndSongs';

export default function Artist() {
  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  const { id } = useLocalSearchParams();

  const [songResults, setSongResults] = useState([]);

  const [artistResults, setArtistResults] = useState({});

  const [songsByAlbum, setSongsByAlbum] = useState({});

  useEffect(() => {
    console.log('get info by id ', id);
    try {
      fetch(`http://localhost:3000/getartistbyid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('artist result ', data.rows);
        setArtistResults(data.rows[0]);
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    console.log('get songs with albums by artist id ', id);
    try {
      fetch(`http://localhost:3000/getsongsandalbumsbyartistid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('songs result ', data.rows);
        setSongResults(data.rows);
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    const resultsObject = {};
    resultsObject['noAlbum'] = [];
    for (var row of songResults) {
      var existing;
      if (!row.display_album) {
        existing = resultsObject['noAlbum'];
        existing.push({title: row.song_title, id: row.song_id});
        resultsObject['noAlbum'] = existing;
      } else {
        if (!resultsObject[row.display_album]) {
          resultsObject[row.display_album] = {};
          resultsObject[row.display_album].songs = [];
          resultsObject[row.display_album].title = row.album_title;
          resultsObject[row.display_album].year = row.release_year;
          resultsObject[row.display_album].id = row.display_album;
        }
      
      existing = resultsObject[row.display_album].songs;

      existing.push({title: row.song_title, id: row.song_id});

      resultsObject[row.display_album].songs = existing;
    }
   }

    setSongsByAlbum(resultsObject);
  }, [songResults])

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {artistResults &&
          <View>
            <Text style={styles.title}>{artistResults['artist_text']}</Text>
            <Text style={styles.subtitle}>Songs: </Text>
          </View>
        }

        <View style={styles.albumsContainer}>
          { Object.entries(songsByAlbum).map((result) => {
            if (result[0] != 'noAlbum') {
              return (
                <DisplayAlbumAndSongs
                  key={result[0]}
                  album={result[1].title}
                  albumId={result[1].id}
                  artist={artistResults['artist_text']}
                  songs={result[1].songs}/>
              );
            } else {
              if (result[1][0]) {
                return (
                  <DisplayAlbumAndSongs
                    key={'noAlbumFound'}
                    album={'(No Album Found)'}
                    songs={result[1]}
                  />
                )
              }
            }
          })
          }
        </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    paddingBottom: 15,
    fontFamily: "DMMono_400Regular",
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    fontFamily: "DMMono_400Regular",

  },
  information: {
    padding: 12,
  },
  tagContainer: {
    flexDirection: 'column',
    margin: 12,
  },
  albumsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    maxWidth: '100%',
  },
});