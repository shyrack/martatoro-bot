import DiscordVoice from "@discordjs/voice";
import { playAudio } from "../util/helperFunctions";
import { MusicQueue, Song } from "../util/types";

const initMusicQueue = (guildId: string, musicQueues: Map<string, MusicQueue>): MusicQueue => {
  const musicQueue: MusicQueue = {
    audioPlayer: DiscordVoice.createAudioPlayer(),
    currentSong: null,
    guildId: guildId,
    isPaused: true,
    songs: [],
    voiceConnection: null,
  };
  musicQueues.set(guildId, musicQueue);
  return musicQueue;
};

export namespace Queue {
  const musicQueues = new Map<string, MusicQueue>();

  export const getMusicQueue = (guildId: string) => {
    const guildQueue = musicQueues.get(guildId) ?? initMusicQueue(guildId, musicQueues);

    const addSong = (song: Song) => {
      if (guildQueue.currentSong === null) {
        guildQueue.currentSong = song;
        playAudio(song, guildQueue.audioPlayer);
      } else {
        guildQueue.songs.push(song);
      }
    };

    return {
      addSong: addSong,
      queueMap: guildQueue,
    };
  };
}
