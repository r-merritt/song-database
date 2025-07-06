import { StyleSheet, Dimensions, ScrollView } from 'react-native';

import AddSongFlow from '../components/AddSongFlow';

const { width } = Dimensions.get('window')

export default function AddSong() { 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddSongFlow />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  songsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: '90%',
  },
  artistListContainer: {
    width: '90%',
  },
  artistsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    maxWidth: '100%',
    width: width - (width/3),
  },
  title: {
    fontSize: 32,
    margin: 20,
    color: 'gray',
  },
  button: {
    padding: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  matchText: {
    fontSize: 24,
    color: 'gray',
    textAlign: 'center',
  },
  label: {
    padding: 12,
    fontSize: 18,
    width: width - (width/4),
    maxWidth: '85%',
    color: 'gray',
  },
});