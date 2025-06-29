import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function DisplayAlbumAndSongs({album, artist, songs} : {album: string, artist: string, songs: Array<Object>}) {
  const router = useRouter();

  function goToSong(songId : string) {
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  return (
    <View style={styles.container}>
        <Text style={styles.albumName}>{album}</Text>
        {artist && <Text style={styles.artistName}>by {artist}</Text>}
        <Text style={styles.label}>Songs:</Text>
        { songs.map((song) => {
            return (
              <Pressable onPress={() => goToSong(song.id)}>
                <Text key={song.id} style={styles.song}>{song.title}</Text>
              </Pressable>
            );
        })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: 15,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    maxWidth: '80%',
    minWidth: 150,
    paddingBottom: 15,
  },
  artistName: {
    color: 'rgb(68, 150, 238)',
    fontSize: 18,
    paddingLeft: 15,
    paddingRight: 15,
  },
  albumName: {
    color: 'rgb(68, 150, 238)',
    fontSize: 18,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
  },
  label: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgb(128, 128, 128)',
    color: 'gray',
    fontSize: 12,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },
  song: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 3,
  }
});