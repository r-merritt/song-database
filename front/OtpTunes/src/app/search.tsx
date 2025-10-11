import { StyleSheet, Text, View, Dimensions, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

const { width } = Dimensions.get('window')

// add option to search either songs or playlists

export default function Search({ } : { }) {
    const [fontsLoaded, error] = useFonts({
      DMMono_400Regular,
    });

    const isFocused = useIsFocused();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [tags, setTags] = useState('');

    const [songSearchResults, setSongSearchResults] = useState<Array<Object>>([]);
    const [showSongResults, setShowSongResults] = useState<boolean>(false);

    const [playlistSearchResults, setPlaylistSearchResults] = useState<Array<Object>>([]);
    const [showPlaylistResults, setShowPlaylistResults] = useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([15, 30, 50]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
      numberOfItemsPerPageList[0]
    );

    const [searchPlaylists, setSearchPlaylists] = useState<boolean>(false);
    const [searchSongs, setSearchSongs] = useState<boolean>(true);

    const from = page * itemsPerPage;
    const songTo = Math.min((page + 1) * itemsPerPage, songSearchResults.length);
    const playlistTo = Math.min((page + 1) * itemsPerPage, playlistSearchResults.length);

    function goToSong(songId : string) {
      router.navigate({
        pathname: '/song/[id]',
        params: { id: songId }
      });
    }

    function goToPlaylist(playlistId : string) {
      console.log('go to playlist ', playlistId);
      router.navigate({
        pathname: '/playlist/[id]',
        params: { id: playlistId }
      });
    }

    function goToArtist(artistId : string) {
      router.navigate({
        pathname: '/artist/[id]',
        params: { id: artistId }
      });
    }

    function goToAlbum(albumId : string) {
      router.navigate({
        pathname: '/album/[id]',
        params: { id: albumId }
      });
    }

    function onChangeText(type : string, text : string) {
      switch(type) {
        case 'title':
          setTitle(text);
          break;
        case 'artist':
          setArtist(text);
          break;
        case 'album':
          setAlbum(text);
          break;
        case 'tags':
          setTags(text);
          break;
      }
    }
  

  function onSearch() {
    if (searchSongs) {
      console.log('searching for songs with ', title, ' ', artist, ' ', album);
      console.log(tags);
      try {
        fetch(`http://localhost:3000/searchsongs?title=${title}&artist=${artist}&album=${album}&tags=${tags}`)
        .then((result) => {return result.json();})
        .then((data) => {
          console.log('song result ', data.rows);
          setSongSearchResults(data.rows);
          setShowSongResults(true);
        })
      } catch (err) { console.log(err); }
    } else {
      console.log('searching for playlists with tags');
      console.log(tags);
      try {
        fetch(`http://localhost:3000/searchplaylistsbytags?tags=${tags}`)
        .then((result) => {return result.json();})
        .then((data) => {
          console.log('playlist result ', data.rows);
          setPlaylistSearchResults(data.rows);
          setShowPlaylistResults(true);
        })
      } catch (err) { console.log(err); }
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.button}>
            <ActionButton title='Songs' onPress={() => {
                setSearchSongs(true);
                setSearchPlaylists(false);
              }}/>
        </View>
        <View style={styles.button}>
            <ActionButton title='Playlists' onPress={() => {
                setSearchPlaylists(true);
                setSearchSongs(false);
              }}/>
        </View>
      </View>
      { searchSongs && 
        <View style={styles.container}>
          <View style={styles.box}>
              <View style={styles.section}>
                  <Input
                    placeholder='title'
                    type='title'
                    onChangeText={onChangeText}
                  />
              </View>
              <View style={styles.section}>
                  <Input
                    placeholder='artist'
                    type='artist'
                    onChangeText={onChangeText}
                  />
              </View>
              <View style={styles.section}>
                  <Input
                    placeholder='album'
                    type='album'
                    onChangeText={onChangeText}
                  />
              </View>
          </View>
        </View>
      }
      <View style={styles.container}>
        <View style={styles.box}>
            <View style={styles.section}>
                <Input
                  placeholder='tags'
                  type='tags'
                  onChangeText={onChangeText}
                />
            </View>
        </View>
      </View>
      <View style={styles.button}>
            <ActionButton title={`Search ${searchSongs? 'Songs' : 'Playlists'}`} onPress={onSearch}/>
      </View>

      { (showSongResults && searchSongs) &&
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title><Text style={styles.tableText}>Title</Text></DataTable.Title>
              <DataTable.Title><Text style={styles.tableText}>Artist</Text></DataTable.Title>
              <DataTable.Title><Text style={styles.tableText}>Album</Text></DataTable.Title>
              <DataTable.Title numeric><Text style={styles.tableText}>Release Year</Text></DataTable.Title>
            </DataTable.Header>

            {songSearchResults.slice(from, songTo).map((result) => (
              <DataTable.Row key={result['song_id']}>
                <DataTable.Cell>
                  <Pressable onPress={() => goToSong(result['song_id'])}>
                    <Text style={styles.tableText}>{result['song_title']}</Text>
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Pressable onPress={() => goToArtist(result['display_artist'])}>
                    <Text style={styles.tableText}>{result['artist_text']}</Text>
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Pressable onPress={() => goToAlbum(result['display_album'])}>
                    <Text style={styles.tableText}>{result['album_title']}</Text>
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.tableText}>{result['release_year']}</Text></DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(songSearchResults.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${songTo} of ${songSearchResults.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </View>
      }

      { (showPlaylistResults && searchPlaylists) &&
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title><Text style={styles.tableText}>Title</Text></DataTable.Title>
              <DataTable.Title><Text style={styles.tableText}>Artist</Text></DataTable.Title>
            </DataTable.Header>

            {playlistSearchResults.slice(from, playlistTo).map((result) => (
              <DataTable.Row key={result['playlist_id']}>
                <DataTable.Cell>
                  <Pressable onPress={() => goToPlaylist(result['playlist_id'])}>
                    <Text style={styles.tableText}>{result['title']}</Text>
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell><Text style={styles.tableText}>{result['artist']}</Text></DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(playlistSearchResults.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${playlistTo} of ${playlistSearchResults.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </View>
      }
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 14,
    width: '100%',
  },

  box: {
    display: 'flex',
    flex: 3,
    flexDirection: 'row',
    minHeight: '100%',
  },

  section: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    marginTop: 5,
  },

  middle: {
    borderRightWidth: 1,
    borderRightColor: '#c1c1c1',
    borderLeftWidth: 1,
    borderLeftColor: '#c1c1c1',
  },

  button: {
    paddingLeft: 15,
    flex: 1,
  },

  label: {
    color: 'gray',
    fontSize: 12,
  },

  content: {
    color: 'rgb(68, 150, 238)',
    fontSize: 16,
  },
  
  tableText: {
    fontFamily: "DMMono_400Regular",
  }
});