import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import TagsCard from '../../components/TagsCard'
import AddTag from '../../components/AddTag';

import { useFonts } from "expo-font";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";

import { TagT, PlaylistT } from '../../util/types';
import { apiAddrs } from '@/src/util/api';

type PlaylistSongT = {
  album_title: string;
  artist_text: string;
  commentary: string;
  show_artist_or_album: string;
  song_id: string;
  song_order: number;
  song_title: string;
};

export default function Playlist() {
  const [fontsLoaded, error] = useFonts({
    DMMono_400Regular,
  });

  const { id } = useLocalSearchParams<{id: string}>();

  const router = useRouter();

  function goToSong(songId : string) {
    router.navigate({
      pathname: '/song/[id]',
      params: { id: songId }
    });
  }

  const [songResults, setSongResults] = useState<Array<PlaylistSongT>>([]);
  const [playlistResults, setPlaylistResults] = useState<PlaylistT>();
  const [tagResults, setTagResults] = useState([]);

  const [moodTags, setMoodTags] = useState(Array<TagT>);
  const [themeTags, setThemeTags] = useState(Array<TagT>);
  const [metaTags, setMetaTags] = useState(Array<TagT>);
  const [fandomTags, setFandomTags] = useState(Array<TagT>);

  useEffect(() => {
    const mood : Array<TagT> = [];
    const theme : Array<TagT> = [];
    const meta : Array<TagT> = [];
    const fandom : Array<TagT> = [];

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
    console.log('get playlist by id ', id);
    try {
      fetch(`${apiAddrs}/getplaylistbyid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('playlist result ', data.rows);
          setPlaylistResults(data.rows[0]);
        }
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    console.log('get songs by playlist id ', id);
    try {
      fetch(`${apiAddrs}/getsongsbyplaylistid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('songs result ', data.rows);
          setSongResults(data.rows);
        }
      })
    } catch (err) { console.log(err); }

  }, [id]);

  useEffect(() => {
    console.log('get tags by playlist id ', id);
    try {
      fetch(`${apiAddrs}/gettagsbyplaylistid?id=${id}`)
      .then((result) => {return result.json();})
      .then((data) => {
        if (data.code) {
          console.log('Error ', data);
        } else {
          console.log('tags result ', data.rows);
          setTagResults(data.rows);
        }
      })
    } catch (err) { console.log(err); }

  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {playlistResults &&
          <View>
            <Text style={styles.title}>{playlistResults['title']}</Text>
            {playlistResults['artist'] && <Text style={styles.title}>by {playlistResults['artist']}</Text>}
            <Text style={styles.subtitle}>Songs: </Text>
          </View>
        }

        <View style={styles.songsContainer}>
          { Object.entries(songResults).map((result) => {
            console.log(result);
              return (
                <Pressable onPress={() => goToSong(result[1].song_id)}>
                  <Text style={styles.song}>{result[1].song_order}. {result[1].song_title} by {result[1].artist_text}</Text>
                  {result[1].commentary && <Text style={styles.commentary}>{result[1].commentary}</Text>}
                </Pressable>
              );
          })
          }
        </View>

        <AddTag id={id} songOrPlaylist='playlist' getNewTag={updateTags} />
        
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
  commentary: {
    paddingLeft: 24,
    fontFamily: "DMMono_400Regular",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    paddingBottom: 15,
    fontFamily: "DMMono_400Regular",
  },
  song: {
    fontSize: 18,
    fontFamily: "DMMono_400Regular",
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    paddingBottom: 10,
    fontFamily: "DMMono_400Regular",
  },
  songsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: '100%',
  },
  tagContainer: {
    flexDirection: 'column',
    margin: 12,
  },
});