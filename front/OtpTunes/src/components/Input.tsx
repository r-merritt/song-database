import React from 'react';
import { Ref } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';

const { width } = Dimensions.get('window')

export default function Input({placeholder, type, secureTextEntry = false, onChangeText, ref} : {placeholder : string, type : string, secureTextEntry? : boolean, onChangeText : Function, ref? : Ref<TextInput>}) {
  return (
    <TextInput
      ref={ref}
      style={styles.input}
      placeholder={placeholder}
      autoCapitalize='none'
      autoCorrect={false}
      onChangeText={v => onChangeText(type, v)}
      secureTextEntry={secureTextEntry}
      placeholderTextColor='rgb(185, 185, 185)'
      selectionColor={'rgba(0, 0, 0, 1)'}
    />
  );
}


const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    height: 45,
    maxWidth: '90%',
    marginBottom: 10,
    fontSize: 16,
    paddingHorizontal: 14,
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: "DMMono_400Regular",
  }
});