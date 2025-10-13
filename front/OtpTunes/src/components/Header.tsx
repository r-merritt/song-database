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
        <View style={styles.button}>
          <ActionButton title='Recent Songs' onPress={() =>
            router.navigate({
              pathname: '/recents',
            })
          } />
        </View>
        <View style={styles.feedbackButton}>
          <ActionButton title='Feedback?' onPress={() =>
              router.navigate({
                pathname: '/feedback',
              })
            } />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(194, 194, 194, 1)',
    borderBottomColor: 'rgba(0, 0, 0, 1)',
    borderBottomWidth: 1,
  },
  button: {
    paddingRight: 5,
  },
  buttonBox: {
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feedbackButton: {
    marginLeft: 'auto',
  },
});