import React from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window')

export default function TagsCard({title, tags} : {title : string, tags : Array<Object>}) {
  const router = useRouter();

  function goToTag(tagId) {
    router.navigate({
      pathname: '/tag/[id]',
      params: { id: tagId }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tagBox}>
        {tags.map((tag, key) => {
          return (
            <Pressable onPress={() => goToTag(tag.tag_id)}>
              <Text key={key}>{key == 0? '': ', '}{tag.tag_text}</Text>
            </Pressable>
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