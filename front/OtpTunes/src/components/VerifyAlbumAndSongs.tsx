import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ActionButton from './ActionButton';

export default function VerifyAlbumAndSongs({album, artist, year, songs, onVerify} : {album: string, artist: string, year: number, songs: Array<string>, onVerify: Function}) {
  return (
    <View style={styles.container}>
        <Text style={styles.artistName}>{album} by {artist}</Text>
        { year && (
          <Text style={styles.releaseYear}>released in {year}</Text>
        )}
        <Text style={styles.label}>Song selection:</Text>
        { songs.map((song, key) => {
            return (
                <Text key={key} style={styles.song}>{song}</Text>
            );
        })}
        <View style={styles.button}>
            <ActionButton title='This one' onPress={onVerify}/>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
  button: {
    padding: 15,
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: 15,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    maxWidth: '80%',
    minWidth: 150,
  },
  artistName: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(128, 128, 128)',
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    fontFamily: "DMMono_400Regular",
  },
  releaseYear: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(128, 128, 128)',
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    fontFamily: "DMMono_400Regular",
  },
  label: {
    color: 'gray',
    fontSize: 12,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
    fontFamily: "DMMono_400Regular",
  },
  song: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 3,
    fontFamily: "DMMono_400Regular",
  }
});