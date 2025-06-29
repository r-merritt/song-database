import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import TagsCard from '../../components/TagsCard'
import AddTag from '../../components/AddTag';

export default function Song() {
  const { id } = useLocalSearchParams();

  // album_artist, album_artist_id, album_title, release_year, show_artist_or_album,
  // song_album_id, song_artist, song_artist_id, song_id, song_title
  const [songResults, setSongResults] = useState({});
  const [tagResults, setTagResults] = useState(Array<Object>);

  const [moodTags, setMoodTags] = useState(Array<Object>);
  const [themeTags, setThemeTags] = useState(Array<Object>);
  const [metaTags, setMetaTags] = useState(Array<Object>);
  const [fandomTags, setFandomTags] = useState(Array<Object>);

  useEffect(() => {
    console.log('get info by id ', id);
    try {
      fetch(`http://localhost:3000/getsongbyid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        console.log('song result ', data.rows);
        setSongResults(data.rows[0]);
      })
      .then(() => {
        fetch(`http://localhost:3000/gettagsbysongid?id=${id}`)
        .then((result) => {return result.json();})
        .then((data) => {
          console.log('song tags ', data.rows);
          setTagResults(data.rows);
        })
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    const mood = [];
    const theme = [];
    const meta = [];
    const fandom = [];

    for (var tag of tagResults) {
      switch(tag['tag_type']) {
        case 'mood':
          mood.push(tag);
          break;
        case 'theme':
          theme.push(tag);
          break;
        case 'meta':
          meta.push(tag);
          break;
        case 'fandom':
          fandom.push(tag);
          break;
     }
    }

    setMoodTags(mood);
    setThemeTags(theme);
    setMetaTags(meta);
    setFandomTags(fandom);
  }, [tagResults]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {songResults &&
        <View>
        <Text style={styles.title}>{songResults.song_title}</Text>
        <Text style={styles.subtitle}>{songResults.show_artist_or_album == 'artist' ? 'by ' + songResults.song_artist : 'from ' + songResults.album_title}</Text>
        <View style={styles.information}>
          {songResults.song_artist && <Text>Artist: {songResults.song_artist}</Text>}
          {songResults.album_title && <Text>Album: {songResults.album_title}</Text>}
          {songResults.album_artist && <Text>Album Artist: {songResults.album_artist}</Text>}
          {songResults.release_year && <Text>Album Release Year: {songResults.release_year}</Text>}
        </View>
        </View>
        }

        <AddTag id={id} songOrPlaylist='song' />

        <View style={styles.tagContainer}>
          <Text style={styles.title}>Tags</Text>
          <TagsCard title='Mood' tags={moodTags} />
          <TagsCard title='Theme' tags={themeTags} />
          <TagsCard title='Meta' tags={metaTags} />
          <TagsCard title='Fandom' tags={fandomTags}/>
        </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: 'gray',
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
  },
  information: {
    padding: 12,
  },
  tagContainer: {
    flexDirection: 'column',
    margin: 12,
  },
});