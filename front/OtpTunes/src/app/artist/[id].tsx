import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

import { Dictionary } from '../../util/types';

import DisplayAlbumAndSongs from '@/src/components/DisplayAlbumAndSongs';

type SongAndAlbum = {
    album_title: string;
    display_album: string;
    release_year: number;
    song_id: string;
    song_title: string;
};

type Song = {
  title: string;
  id: string;
}

type Result = {
  id: string;
  year: number | undefined;
  title: string;
  songs: Array<Song>;
};

type ArtistResult = {
  artist_id: string;
  artist_text: string;
};

export default function Artist() {
  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  const { id } = useLocalSearchParams();

  const [songResults, setSongResults] = useState<Array<SongAndAlbum>>([]);

  const [artistResults, setArtistResults] = useState<ArtistResult>();

  const [songsByAlbum, setSongsByAlbum] = useState<Dictionary<Result>>({});

  useEffect(() => {
    console.log('get info by id ', id);
    try {
      fetch(`http://localhost:3000/getartistbyid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('artist result ', data.rows);
          setArtistResults(data.rows[0]);
        }
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    console.log('get songs with albums by artist id ', id);
    try {
      fetch(`http://localhost:3000/getsongsandalbumsbyartistid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('songs result ', data.rows);
          setSongResults(data.rows);
        }
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    const resultsObject : Dictionary<Result> = {};
    resultsObject['noAlbum'] = {
      id: '',
      year: undefined,
      title: '(No Album Found)',
      songs: []
    };
    for (var row of songResults) {
      var existing;
      if (!row.display_album) {
        existing = resultsObject['noAlbum'].songs;
        existing.push({title: row.song_title, id: row.song_id});
        resultsObject['noAlbum'].songs = existing;
      } else {
        if (!resultsObject[row.display_album]) {
          resultsObject[row.display_album] = {
            songs: [],
            title: row.album_title,
            year: row.release_year,
            id: row.display_album
          };
        }
      
      existing = resultsObject[row.display_album].songs;

      existing.push({title: row.song_title, id: row.song_id});

      resultsObject[row.display_album].songs = existing;
    }
   }

    setSongsByAlbum(resultsObject);
    console.log(resultsObject);
  }, [songResults])

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {artistResults &&
          <View>
            <View>
              <Text style={styles.title}>{artistResults['artist_text']}</Text>
              <Text style={styles.subtitle}>Songs: </Text>
            </View>
          

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
                  if (result[1].songs[0]) {
                    return (
                      <DisplayAlbumAndSongs
                        key={'noAlbumFound'}
                        album={'(No Album Found)'}
                        albumId={''}
                        artist={''}
                        songs={result[1].songs}
                      />
                    )
                  }
                }
              })
              }
            </View>
          </View>
        }

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