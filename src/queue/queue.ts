import Discord from "discord.js";
import DiscordVoice from "@discordjs/voice";
import { client } from "..";
import { playAudio } from "../util/helperFunctions";
import { MusicQueue, Song } from "../util/types";

const initMusicQueue = (guildId: string, musicQueues: Map<string, MusicQueue>): MusicQueue => {
  const musicQueue: MusicQueue = {
    audioPlayer: DiscordVoice.createAudioPlayer(),
    currentSong: null,
    guildId: guildId,
    isPaused: true,
    songs: [],
    voiceChannel: null,
    voiceConnection: null,
  };
  musicQueues.set(guildId, musicQueue);
  return musicQueue;
};

export namespace Queue {
  const musicQueues = new Map<string, MusicQueue>();

  export const getMusicQueue = (guildId: string) => {
    const guildQueue = musicQueues.get(guildId) ?? initMusicQueue(guildId, musicQueues);

    const joinVoiceChannel = (channel: Discord.VoiceChannel) => {
      const currentConnection = DiscordVoice.getVoiceConnection(guildId);
      const guild = client.guilds.cache.get(guildId);
      if (currentConnection === undefined && guild !== undefined) {
        const voiceConnection = DiscordVoice.joinVoiceChannel({
          adapterCreator: guild.voiceAdapterCreator,
          channelId: channel.id,
          guildId: guildId,
        });
        voiceConnection.subscribe(guildQueue.audioPlayer);
        guildQueue.voiceChannel = channel;
        guildQueue.voiceConnection = voiceConnection;
      }
    };

    const addSong = (channel: Discord.VoiceChannel, song: Song) => {
      joinVoiceChannel(channel);
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
      voiceChannel: guildQueue.voiceChannel,
    };
  };
}
