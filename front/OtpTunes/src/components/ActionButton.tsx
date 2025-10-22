import React from 'react';
import {
  Pressable, Text, View, StyleSheet
} from 'react-native';

export default function ActionButton({onPress, title, vPadding}: {onPress : Function, title : string, vPadding? : number}) {

  const verticalPadding = vPadding ? vPadding : 10;

  return (
    <Pressable
      onPress={() => onPress()}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgba(194, 194, 194, 1)' : 'rgba(255, 255, 255, 1)',
        }, styles.buttonContainer,
      ]}
    >
      <View style={[{paddingTop: verticalPadding, paddingBottom: verticalPadding}, styles.button]}>
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
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "DMMono_400Regular",
  }
});