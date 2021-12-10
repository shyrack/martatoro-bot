import Discord from "discord.js";
import DiscordVoice from "@discordjs/voice";
import * as play from "play-dl";
import { InfoData } from "play-dl/dist/YouTube/utils/constants";
import { playAudio } from "../util/helperFunctions";

type Song = {
  member: Discord.GuildMember;
  infoData: InfoData;
};

type MusicQueue = {
  audioPlayer: DiscordVoice.AudioPlayer;
  currentSong: Song | null;
  guildId: string;
  isPaused: boolean;
  songs: Song[];
  voiceConnection: DiscordVoice.VoiceConnection | null;
};

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
        playAudio(song.infoData, guildQueue.audioPlayer);
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
