import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import ActionButton from './ActionButton';

export default function Header() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.buttonBox}>
        <View style={styles.button}>
          <ActionButton title='Home' onPress={() =>
            router.navigate({
              pathname: '/',
            })
          } />
        </View>
        <View style={styles.button}>
          <ActionButton title='Search' onPress={() =>
            router.navigate({
              pathname: '/search',
            })
          } />
        </View>
        <View style={styles.button}>
          <ActionButton title='Add Song' onPress={() =>
            router.navigate({
              pathname: '/addsong',
            })
          } />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'rgb(165, 165, 165)',
    borderBottomWidth: 2,
  },
  button: {
    paddingRight: 5,
  },
  buttonBox: {
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});