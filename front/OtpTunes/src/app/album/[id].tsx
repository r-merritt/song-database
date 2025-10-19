import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

type AlbumT = {
    artist_text: string;
    display_artist: string;
    display_title: string;
    release_year: number;
};

type SongT = {
    artist_text: string;
    song_id: string;
    song_title: string;
};

export default function Album() {
  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  const { id } = useLocalSearchParams();

  const router = useRouter();

  function goToSong(songId : string) {
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  const [songResults, setSongResults] = useState<Array<SongT>>([]);

  const [albumResults, setAlbumResults] = useState<AlbumT>();

  useEffect(() => {
    console.log('get album by id ', id);
    try {
      fetch(`http://localhost:3000/getalbumbyid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('album result ', data.rows);
          setAlbumResults(data.rows[0]);
        }
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    console.log('get songs by album id ', id);
    try {
      fetch(`http://localhost:3000/getsongsbyalbumid?id=${id}`)
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {albumResults &&
          <View>
            <Text style={styles.title}>{albumResults['display_title']}</Text>
            <Text style={styles.subtitle}>Songs: </Text>
          </View>
        }

        <View style={styles.songsContainer}>
          { Object.entries(songResults).map((result) => {
            console.log(result);
              return (
                <Pressable onPress={() => goToSong(result[1].song_id)}>
                  {result[1].artist_text && (
                    <Text style={styles.songText}>{result[1].song_title} by {result[1].artist_text}</Text>
                  )}
                  {!result[1].artist_text && (
                    <Text style={styles.songText}>{result[1].song_title}</Text>
                  )}
                  
                </Pressable>
              );
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
    paddingBottom: 10,
    fontFamily: "DMMono_400Regular",
  },
  songsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: '100%',
  },
  songText: {
    fontFamily: "DMMono_400Regular",
  }
});