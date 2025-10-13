import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import { useRouter } from 'expo-router';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

import TagsCard from '../../components/TagsCard'
import AddTag from '../../components/AddTag';

import { TagT } from '../../util/types';

type SongInfo = {
  album_artist: string;
  album_artist_id: string;
  album_title: string;
  release_year: number;
  show_artist_or_album: string;
  song_album_id: string;
  song_artist: string;
  song_artist_id: string;
  song_title: string;
};

export default function Song() {
  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  const router = useRouter();

  const { id } = useLocalSearchParams<{id: string}>();

  const [songResults, setSongResults] = useState<SongInfo>();
  const [tagResults, setTagResults] = useState(Array<TagT>);

  const [moodTags, setMoodTags] = useState(Array<TagT>);
  const [themeTags, setThemeTags] = useState(Array<TagT>);
  const [metaTags, setMetaTags] = useState(Array<TagT>);
  const [fandomTags, setFandomTags] = useState(Array<TagT>);

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

  function updateTags(tag : TagT) {
    console.log(tag.tag_id, ' ', tag.tag_text, ' ', tag.tag_type);
      switch(tag['tag_type']) {
        case 'mood':
          setMoodTags([...moodTags, tag]);
          break;
        case 'theme':
          setThemeTags([...themeTags, tag]);
          break;
        case 'meta':
          setMetaTags([...metaTags, tag]);
          break;
        case 'fandom':
          setFandomTags([...fandomTags, tag]);
          break;
     }
  }

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

    function goToArtist(artistId : string) {
      router.navigate({
        pathname: '/artist/[id]',
        params: { id: artistId }
      });
    }

    function goToAlbum(albumId : string) {
      router.navigate({
        pathname: '/album/[id]',
        params: { id: albumId }
      });
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {songResults &&
        <View>
        <Text style={styles.title}>{songResults.song_title}</Text>
        <Text style={styles.subtitle}>{songResults.show_artist_or_album == 'artist' ? 'by ' + songResults.song_artist : 'from ' + songResults.album_title}</Text>
        <View style={styles.information}>
          {songResults.song_artist && 
            <Pressable onPress={() => goToArtist(songResults['song_artist_id'])}>
              <Text style={styles.infoText}>Artist: {songResults.song_artist}</Text>
            </Pressable>}
          {songResults.album_title &&
            <Pressable onPress={() => goToAlbum(songResults['song_album_id'])}>
              <Text style={styles.infoText}>Album: {songResults.album_title}</Text>
            </Pressable>}
          {songResults.album_artist &&
            <Pressable onPress={() => goToArtist(songResults['album_artist_id'])}>
              <Text style={styles.infoText}>Album Artist: {songResults.album_artist}</Text>
            </Pressable>}
          {songResults.release_year && <Text style={styles.infoText}>Album Release Year: {songResults.release_year}</Text>}
        </View>
        </View>
        }

        <AddTag id={id} songOrPlaylist='song' getNewTag={updateTags} />

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
    fontFamily: "DMMono_400Regular",
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    fontFamily: "DMMono_400Regular",
  },
  information: {
    padding: 12,
  },
  infoText: {
    fontFamily: "DMMono_400Regular",
  },
  tagContainer: {
    flexDirection: 'column',
    margin: 12,
  },
});