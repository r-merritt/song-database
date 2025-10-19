import { StyleSheet, Text, View } from 'react-native';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

export default function Index() {

  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>It's OTPTunes!</Text>
      <Text style={styles.text}>Choose something from the nav bar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontFamily: "DMMono_400Regular",
  },
  text: {
    fontFamily: "DMMono_400Regular",
  },
});