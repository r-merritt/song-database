import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import Input from './Input';
import ActionButton from './ActionButton';
import { Picker } from '@react-native-picker/picker';

export default function TagsCard({id, songOrPlaylist, getNewTag} : {id : string, songOrPlaylist : string, getNewTag : Function}) {
  const [tagText, setTagText] = useState('');
  const [tagType, setTagType] = useState('');

  const [showTypeError, setShowTypeError] = useState(false);
  const [showTagError, setShowTagError] = useState(false);
  const [showTagMatch, setShowTagMatch] = useState(false);

  const [tagResults, setTagResults] = useState<Array<Object>>([]);
  
  function onChangeText(type : string, text : string) {
    setTagText(text);
  }

  function addTagButton() {
    if (tagText == '') {
      setShowTagError(true);
      setShowTypeError(false);
    }
    else if (tagType == '' || tagType == 'unselected') {
      setShowTagError(false);
      setShowTypeError(true);
    } else {
      setShowTypeError(false);
      setShowTagError(false);
      getTag();
    }
  }



  function getTag() {
    setShowTagMatch(false);
    console.log('checking for tag ', tagText);
    try {
      fetch(`http://localhost:3000/gettagbytext?tag=${tagText}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('tag result ', data.rows);
        if (data.rows[0]) {
          setTagResults(data.rows);
          setShowTagMatch(true);
        } else {
          if (songOrPlaylist == 'song') { addNewSongTag(); }
          else if (songOrPlaylist == 'playlist') { addNewPlaylistTag(); }
          else { console.log('song or playlist wasn\'t song or playlist'); }
        }
      })
    } catch (err) { console.log(err); }
  }

  function matchedTag(tag) {
    console.log('matched ', tag);
    setShowTagMatch(false);
    if (songOrPlaylist == 'song') {
      addExistingSongTag(tag);
    } else if (songOrPlaylist == 'playlist') {
      addExistingPlaylistTag(tag);
    } else {
      console.log('song or playlist wasn\'t song or playlist');
    }
  }

  function addExistingSongTag(tag) {
    console.log('add to song ', tag);
    try {
      fetch(`http://localhost:3000/addexistingtagtosong?songId=${id}&tagId=${tag.tag_id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('add result ', data.rows);
        getNewTag(tag);
      })
    } catch (err) { console.log(err); }
  }

  function addNewSongTag() {
    console.log('add to song ', tagText, ' ', tagType);
    try {
      fetch(`http://localhost:3000/addnewtagtosong?id=${id}&tag=${tagText}&type=${tagType}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('add result ', data.rows);
        getNewTag({tag_id: data.rows[0].add_tag_to_song, tag_text: tagText, tag_type: tagType});
      })
    } catch (err) { console.log(err); }
  }

  function addExistingPlaylistTag(tag) {
    console.log('add to playlist ', tag);
    try {
      fetch(`http://localhost:3000/addexistingtagtoplaylist?playlistId=${id}&tagId=${tag.tag_id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('add result ', data.rows);
        getNewTag(tag);
      })
    } catch (err) { console.log(err); }
  }

  function addNewPlaylistTag() {
    console.log('add to playlist ', tagText, ' ', tagType);
    try {
      fetch(`http://localhost:3000/addnewtagtoplaylist?id=${id}&tag=${tagText}&type=${tagType}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('add result ', data.rows);
        getNewTag({tag_id: data.rows[0].add_tag_to_playlist, tag_text: tagText, tag_type: tagType});
      })
    } catch (err) { console.log(err); }
  }
  
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.box}>
            <View style={styles.tagInputSection}>
                <Input
                  placeholder='tag'
                  type='tag'
                  onChangeText={onChangeText}
                />
            </View>
            <View style={styles.tagTypeSection}>
              <Picker
                selectedValue={tagType}
                onValueChange={(itemValue, itemIndex) =>
                  setTagType(itemValue)
                }>
                <Picker.Item label="Please pick a tag category" value="unselected" />  
                <Picker.Item label="Mood" value="mood" />
                <Picker.Item label="Theme" value="theme" />
                <Picker.Item label="Meta" value="meta" />
                <Picker.Item label="Fandom" value="fandom" />
              </Picker>
            </View>
        </View>
        <View style={styles.button}>
            <ActionButton title='Add Tag' onPress={addTagButton}/>
        </View>
      </View>
      <Text style={[styles.notice, { display: showTypeError? 'block' : 'none' }]}>Please pick a tag category!</Text>
      <Text style={[styles.notice, { display: showTagError? 'block' : 'none' }]}>Please enter a tag!</Text>
      {showTagMatch &&
        <View>
          <Text style={styles.matchTitle}>Do any of these tags match?</Text>
          {tagResults.map((tag, key) => 
          <View key={key} style={styles.tagBox}>
            <Text style={styles.tagTitle}>Tag: </Text> <Text style={styles.tag}>{tag.tag_text} </Text>
            <Text style={styles.tagTitle}>Type: </Text> <Text style={styles.tag}>{tag.tag_type}</Text>
            <Pressable onPress={() => matchedTag(tag)}>
              <Text style={styles.thisOne}>This one</Text>
            </Pressable>
          </View>
          )}
        </View>
      }
    </View>
  );
}


const styles = StyleSheet.create({
  thisOne: {
    padding: 10,
    marginLeft: 12,
    fontSize: 16,
    backgroundColor: 'rgb(68, 150, 238)',
    borderRadius: 10,
  },
  matchTitle: {
    fontSize: 24,
    color: 'gray',
    padding: 10,
  },
  tag: {
    fontSize: 16,
    paddingTop: 10,
    textTransform: 'capitalize',
  },
  tagTitle: {
    fontSize: 20,
    paddingTop: 6,
    color: 'gray',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 14,
    width: '100%',
  },
  tagBox: {
    flexDirection: 'row',
    backgroundColor: 'rgb(255,255,255)',
    maxWidth: 'fit-content',
    padding: 10,
    borderRadius: 10,
    position: 'relative',
    marginLeft: 8,
  },
  box: {
    display: 'flex',
    flex: 3,
    flexDirection: 'row',
    minHeight: '100%',
  },
  tagInputSection: {
    display: 'flex',
    flex: 3,
    justifyContent: 'center',
    marginTop: 5,
  },
  tagTypeSection: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    marginTop: 5,
  },
  button: {
    paddingLeft: 15,
    flex: 1,
  },
  notice: {
    fontSize: 16,
    paddingLeft: 16,
    color: 'red',
  },
});