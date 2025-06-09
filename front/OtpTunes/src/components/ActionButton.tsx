import React from 'react';
import {
  Pressable, Text, View, StyleSheet
} from 'react-native';


export default function ActionButton({onPress, title}: {onPress : Function, title : string}) {
  return (
<Pressable
    onPress={onPress}
    style={({pressed}) => [
      {
        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'rgb(68, 150, 238)',
      }, styles.buttonContainer,
    ]}
    underlayColor='rgb(68, 150, 238)'
  >
    <View style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </Pressable>
  );
}


const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 25
  },
  button: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  }
});