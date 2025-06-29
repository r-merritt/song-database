import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function Tag() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [tagResult, setTagResult] = useState({});
  const [songResults, setSongResults] = useState([]);

  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([15, 30, 50]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, songResults.length);

  useEffect(() => {
    console.log('get tag info by id ', id);
    try {
      fetch(`http://localhost:3000/gettagbyid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('tag result ', data.rows);
        setTagResult(data.rows[0]);
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    console.log('get songs by tag id ', id);
    try {
      fetch(`http://localhost:3000/getsongsbytagid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('songs result ', data.rows);
        setSongResults(data.rows);
      })
    } catch (err) { console.log(err); }

  }, [id]);

  function goToSong(songId : string) {
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  function goToArtist(artistId : string) {
    router.navigate({
      pathname: '/artist/[id]',
      params: { id: artistId }
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
     { tagResult && (
        <View>
          <Text style={styles.title}>{tagResult['tag_text']}</Text>
          <Text>Type: {tagResult['tag_type']}</Text>
        </View>
     )}

     <Text>Songs with this tag: </Text>

     { songResults && 
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Title</DataTable.Title>
              <DataTable.Title>Artist</DataTable.Title>
              <DataTable.Title>Album</DataTable.Title>
              <DataTable.Title numeric>Release Year</DataTable.Title>
            </DataTable.Header>

            {songResults.slice(from, to).map((result, key) => (
              <DataTable.Row key={key}>
                <DataTable.Cell>
                  <Pressable onPress={() => goToSong(result['song_id'])}>
                    <Text>{result['song_title']}</Text>
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Pressable onPress={() => goToArtist(result['display_artist'])}>
                    <Text>{result['artist_text']}</Text>
                  </Pressable>
                </DataTable.Cell>
                <DataTable.Cell>{result['album_title']}</DataTable.Cell>
                <DataTable.Cell numeric>{result['release_year']}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(songResults.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${songResults.length}`}
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
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: 'gray',
    paddingBottom: 15,
  },
});