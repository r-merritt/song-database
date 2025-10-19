import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type SongT = {
  id: string;
  title: string;
}

export default function DisplayAlbumAndSongs({album, albumId, artist, songs} : {album: string, albumId: string, artist: string, songs: Array<SongT>}) {
  const router = useRouter();

  function goToSong(songId : string) {
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  function goToAlbum(albumId : string) {
    router.navigate({
      pathname: '/album/[id]',
      params: { id: albumId }
    });
  }

  return (
    <View style={styles.container}>
      {albumId && (
        <Pressable onPress={() => goToAlbum(albumId)}>
          <Text style={styles.albumName}>{album}</Text>
        </Pressable>
      )}
      {!albumId && (
        <Text style={styles.albumName}>{album}</Text>
      )}
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
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: "DMMono_400Regular",
  },
  albumName: {
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    fontFamily: "DMMono_400Regular",
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
    fontFamily: "DMMono_400Regular",
  },
  song: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 3,
    fontFamily: "DMMono_400Regular",
  }
});