import React from 'react';
import {
  Pressable, Text, View, StyleSheet
} from 'react-native';

export default function ActionButton({onPress, title}: {onPress : Function, title : string}) {

  return (
    <Pressable
      onPress={() => onPress()}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgba(194, 194, 194, 1)' : 'rgba(255, 255, 255, 1)',
        }, styles.buttonContainer,
      ]}
    >
      <View style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 3
  },
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "DMMono_400Regular",
  }
});