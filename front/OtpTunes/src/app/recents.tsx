import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

import ActionButton from '../components/ActionButton';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

const { width } = Dimensions.get('window');

export default function Recents() {

  const router = useRouter();

  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  const [results, setResults] = useState([]);

  useEffect(() => {
    getRecents();
  }, []);

  function goToSong(songId : string) {
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  function getRecents() {
    console.log('get recent songs');
    try {
      fetch(`http://localhost:3000/getrecents`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('song result ', data.rows);
        setResults(data.rows);
      })
    } catch (err) { console.log(err); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Edited Songs</Text>

      <View style={styles.button}>
        <ActionButton title={'Refresh'} onPress={getRecents}/>
      </View>

      {results[0] && (
        <View>
          { results.map((song) => {
            return (
              <Pressable onPress={() => goToSong(song['song_id'])}>
                <Text key={song['song_id']} style={styles.text}>* {song['song_title']}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width/4,
    maxWidth: '90%',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontFamily: "DMMono_400Regular",
  },
  text: {
    fontSize: 16,
    fontFamily: "DMMono_400Regular",
    paddingTop: 2,
  },
});