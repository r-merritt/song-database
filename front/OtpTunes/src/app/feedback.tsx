import { StyleSheet, Text, View, Dimensions } from 'react-native';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

const { width } = Dimensions.get('window')

export default function Feedback() {

  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You can email otptunes at gmail with feedback, feature requests, bug reports, etc</Text>
      <Text style={styles.text}>Please be nice thank you :)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  text: {
    fontFamily: "DMMono_400Regular",
  },
});