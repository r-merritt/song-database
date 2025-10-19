import { StyleSheet, Text, View } from 'react-native';
import ActionButton from './ActionButton';

export default function SongCard({title, artist, album, onVerify} : {title: string, artist: string, album: string, onVerify: Function}) {
  return (
    <View style={styles.container}>
        <View style={styles.box}>
            <View style={styles.section}>
                <Text style={styles.label}>Title</Text>
                <Text style={styles.content}>{title}</Text>
            </View>
            <View style={[styles.section, styles.middle]}>
                <Text style={styles.label}>Artist</Text>
                <Text style={styles.content}>{artist || 'no artist found'}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Album</Text>
                <Text style={styles.content}>{album || 'no album found'}</Text>
            </View>
        </View>
        <View style={styles.button}>
            <ActionButton title='This one' onPress={onVerify}/>
        </View>
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 14,
    minWidth: '100%',
  },

  box: {
    display: 'flex',
    flex: 3,
    flexDirection: 'row',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 14,
    minHeight: '100%',
  },

  section: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    padding: 5,
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
    justifyContent: 'center',
  },

  label: {
    color: 'gray',
    fontSize: 12,
    fontFamily: "DMMono_400Regular",
  },

  content: {
    fontSize: 16,
    fontFamily: "DMMono_400Regular",
  },
});