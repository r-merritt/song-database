import { StyleSheet, Text, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window')

export default function Index() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>It's OTPTunes!</Text>
      <Text>Choose something from the nav bar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    margin: 20,
    color: 'gray',
  },
});