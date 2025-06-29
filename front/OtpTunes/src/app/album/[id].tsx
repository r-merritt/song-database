import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import DisplayAlbumAndSongs from '@/src/components/DisplayAlbumAndSongs';

export default function Album() {
  const { id } = useLocalSearchParams();

  const router = useRouter();

  function goToSong(songId : string) {
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  const [songResults, setSongResults] = useState([]);

  const [albumResults, setAlbumResults] = useState({});

  useEffect(() => {
    console.log('get album by id ', id);
    try {
      fetch(`http://localhost:3000/getalbumbyid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('album result ', data.rows);
        setAlbumResults(data.rows[0]);
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    console.log('get songs by album id ', id);
    try {
      fetch(`http://localhost:3000/getsongsbyalbumid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('songs result ', data.rows);
        setSongResults(data.rows);
      })
    } catch (err) { console.log(err); }

  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {albumResults &&
          <View>
            <Text style={styles.title}>{albumResults['display_title']}</Text>
            <Text  style={styles.subtitle}>Songs: </Text>
          </View>
        }

        <View style={styles.songsContainer}>
          { Object.entries(songResults).map((result) => {
            console.log(result);
              return (
                <Pressable onPress={() => goToSong(result[1].song_id)}>
                  <Text>{result[1].song_title} by {result[1].artist_text}</Text>
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
    color: 'gray',
    paddingBottom: 15,
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    paddingBottom: 10,
  },
  songsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: '100%',
  },
});