export type TagT = {
    tag_id: string;
    tag_text: string;
    tag_type: string;
};

export type PlaylistT = {
  artist: string;
  playlist_id: string;
  title: string;
};

export type Dictionary<T> = {
  [key: string]: T;
};