import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Input from './Input';
import ActionButton from './ActionButton';
import { Picker } from '@react-native-picker/picker';

import { TagT } from '../util/types';
import { apiAddrs } from '../util/api';

export default function TagsCard({id, songOrPlaylist, getNewTag} : {id : string, songOrPlaylist : string, getNewTag : Function}) {
  const [tagText, setTagText] = useState('');
  const [tagType, setTagType] = useState('');

  const [showTypeError, setShowTypeError] = useState(false);
  const [showTagError, setShowTagError] = useState(false);
  const [showTagMatch, setShowTagMatch] = useState(false);
  const [showAreYouSure, setShowAreYouSure] = useState(false);

  const [tagResults, setTagResults] = useState<Array<TagT>>([]);
  
  function onChangeText(type : string, text : string) {
    setTagText(text);
  }

  function addTagButton() {
    setShowTagMatch(false);
    setShowAreYouSure(false);
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
      fetch(`${apiAddrs}/gettagbytext?tag=${tagText}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('tag result ', data.rows);
          if (data.rows[0]) {
            setTagResults(data.rows);
            setShowTagMatch(true);
          } else {
            setShowAreYouSure(true);
          }
        }
      })
    } catch (err) { console.log(err); }
  }

  function addNewTag() {
      setShowAreYouSure(false);
      if (songOrPlaylist == 'song') { addNewSongTag(); }
      else if (songOrPlaylist == 'playlist') { addNewPlaylistTag(); }
      else { console.log('song or playlist wasn\'t song or playlist'); }
  }

  function editRecents() {
    console.log('edit recents');
    try {
      var body = {id: id}
      var request = new Request(`${apiAddrs}/editrecents`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetch(request)
      .then((result) => { return result.json(); })
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log(data);
        }
      });

    } catch (err) { console.log(err);}
  }

  function notSure() {
    setShowAreYouSure(false);
  }

  function matchedTag(tag: TagT) {
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

  function noMatches() {
    setShowTagMatch(false);
    setShowAreYouSure(true);
  }

  function addExistingSongTag(tag: TagT) {
    console.log('add to song ', tag);
    try {
      fetch(`${apiAddrs}/addexistingtagtosong?songId=${id}&tagId=${tag.tag_id}`)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('add result ', data);
          getNewTag(tag);
          editRecents();
        }
      })
    } catch (err) { console.log(err); }
  }

  function addNewSongTag() {
    console.log('add to song ', tagText, ' ', tagType);
    try {
      fetch(`${apiAddrs}/addnewtagtosong?id=${id}&tag=${tagText}&type=${tagType}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('add result ', data.rows);
          getNewTag({tag_id: data.rows[0].add_tag_to_song, tag_text: tagText, tag_type: tagType});
          editRecents();
        }
      })
    } catch (err) { console.log(err); }
  }

  function addExistingPlaylistTag(tag: TagT) {
    console.log('add to playlist ', tag);
    try {
      fetch(`${apiAddrs}/addexistingtagtoplaylist?playlistId=${id}&tagId=${tag.tag_id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('add result ', data.rows);
          getNewTag(tag);
        }
      })
    } catch (err) { console.log(err); }
  }

  function addNewPlaylistTag() {
    console.log('add to playlist ', tagText, ' ', tagType);
    try {
      fetch(`${apiAddrs}/addnewtagtoplaylist?id=${id}&tag=${tagText}&type=${tagType}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('add result ', data.rows);
          getNewTag({tag_id: data.rows[0].add_tag_to_playlist, tag_text: tagText, tag_type: tagType});
        }
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
        <View style={styles.buttonBox}>
            <ActionButton title='Add Tag' onPress={addTagButton}/>
        </View>
      </View>
      <Text style={[styles.notice, { display: showTypeError? 'contents' : 'none' }]}>Please pick a tag category!</Text>
      <Text style={[styles.notice, { display: showTagError? 'contents' : 'none' }]}>Please enter a tag!</Text>
      {showTagMatch &&
        <View>
          <Text style={styles.matchTitle}>Do any of these tags match?</Text>
          <View style={styles.outerBox}>
          {tagResults.map((tag, key) => 
            <View key={tag.tag_id} style={styles.tagBox}>
              <Text style={styles.tagTitle}>Tag: </Text> <Text style={styles.tag}>{tag.tag_text} </Text>
              <Text style={styles.tagTitle}>Type: </Text> <Text style={styles.tag}>{tag.tag_type}</Text>
              <View style={styles.buttonBox}>
                  <ActionButton title='This one' onPress={() => matchedTag(tag)}/>
              </View>
            </View>
          )}
          </View>
          <View style={styles.buttonBox}>
              <ActionButton title='None of these' onPress={noMatches}/>
          </View>
        </View>
      }
      {showAreYouSure && 
        <View style={styles.sureBox}>
          <View style={styles.sureBoxText}>
            <Text style={styles.sureText}>Add tag </Text>
            <Text style={styles.sureContent}>{tagText} </Text>
            <Text style={styles.sureText}>of type </Text>
            <Text style={styles.sureContent}>{tagType}</Text>
          </View>

          <View style={styles.sureButtons}>
            <View style={styles.sureButtonBox}>
                <ActionButton title='Add' onPress={addNewTag}/>
            </View>
            <View style={styles.sureButtonBox}>
                <ActionButton title='Cancel' onPress={notSure}/>
            </View>
          </View>
        </View>
      }
    </View>
  );
}


const styles = StyleSheet.create({
  outerBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    maxWidth: '90%',
  },
  sureBox: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 20,
  },
  sureBoxText: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 12,
    paddingBottom: 12,
  },
  sureButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  sureContent: {
    fontWeight: 'bold',
    fontFamily: "DMMono_400Regular",
    fontSize: 18,
  },
  sureText: {
    fontFamily: "DMMono_400Regular",
  },
  matchTitle: {
    fontSize: 24,
    color: 'gray',
    padding: 10,
    fontFamily: "DMMono_400Regular",
  },
  tag: {
    fontSize: 16,
    paddingTop: 10,
    textTransform: 'capitalize',
    fontFamily: "DMMono_400Regular",
  },
  tagTitle: {
    fontSize: 20,
    paddingTop: 6,
    color: 'gray',
    fontFamily: "DMMono_400Regular",
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
    padding: 10,
    borderRadius: 5,
    position: 'relative',
    marginLeft: 8,
    marginBottom: 8,
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
  buttonBox: {
    paddingLeft: 15,
    flex: 1,
    alignSelf: 'flex-start',
    minWidth: 'auto',
  },
  sureButtonBox: {
    paddingRight: 15,
    flex: 1,
    alignSelf: 'flex-start',
    minWidth: 'auto',
  },
  notice: {
    fontSize: 16,
    paddingLeft: 16,
    color: 'red',
  },
});