import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window')

export default function TagsCard({title, tags} : {title : string, tags : Array<Object>}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tagBox}>
        {tags.map((tag, key) => {
          return (
            <Text key={key}>{key == 0? '': ', '}{tag.tag_text}</Text>
          );
        })}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: 'gray',
  },
  container: {
    marginTop: 10,
  },
  tagBox: {
    flexDirection: 'row',
  }
});