import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { TagT } from '../util/types';

export default function TagsCard({title, tags} : {title : string, tags : Array<TagT>}) {
  const router = useRouter();

  function goToTag(tagId : string) {
    router.navigate({
      pathname: '/tag/[id]',
      params: { id: tagId }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.tagBox}>
        {tags.map((tag, index) => {
          return (
            <Pressable onPress={() => goToTag(tag.tag_id)}>
              <Text style={styles.tagText} key={tag.tag_id}>{index == 0? '': ', '}{tag.tag_text}</Text>
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
    fontFamily: "DMMono_400Regular",
  },
  container: {
    marginTop: 10,
  },
  tagBox: {
    flexDirection: 'row',
  },
  tagText: {
    fontFamily: "DMMono_400Regular",
  }
});