import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';

const { width } = Dimensions.get('window')

export default function Search({ } : { }) {
    const isFocused = useIsFocused();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [tags, setTags] = useState('');

    const [searchResults, setSearchResults] = useState<Array<Object>>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([15, 30, 50]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
      numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, searchResults.length);

    function goToSong(songId : string) {
      router.navigate({
        pathname: '/song/[id]',
        params: { id: songId }
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
    console.log('searching for ', title, ' ', artist, ' ', album);
    try {
      fetch(`http://localhost:3000/searchsongs?title=${title}&artist=${artist}&album=${album}&tags=${tags}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('song result ', data.rows);
        setSearchResults(data.rows);
        setShowResults(true);
        })
    } catch (err) { console.log(err); }
  }

  return (
    <View>
      <Pressable onPress={() => {
        router.navigate({pathname: '/'})
      }}><Text>Return Home</Text></Pressable>
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
            <ActionButton title='Search' onPress={onSearch}/>
      </View>

      { showResults && 
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Title</DataTable.Title>
              <DataTable.Title>Artist</DataTable.Title>
              <DataTable.Title>Album</DataTable.Title>
              <DataTable.Title numeric>Release Year</DataTable.Title>
            </DataTable.Header>

            {searchResults.slice(from, to).map((result, key) => (
              <DataTable.Row key={key}>
                <DataTable.Cell>
                  <Pressable onPress={() => goToSong(result['song_id'])}>
                    <Text>{result['song_title']}</Text>
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell>{result['artist_text']}</DataTable.Cell>
                <DataTable.Cell>{result['album_title']}</DataTable.Cell>
                <DataTable.Cell numeric>{result['release_year']}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(searchResults.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${searchResults.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </View>
      }
    </View>
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
});