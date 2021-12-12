import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import { client } from "..";
import { playAudio } from "../util/helperFunctions";
import { AudioPlayerEvents } from "../events/audioPlayerEvents";
import { MusicQueue, Song } from "../util/types";

const initMusicQueue = (guildId: string, musicQueues: Map<string, MusicQueue>): MusicQueue => {
  const musicQueue: MusicQueue = {
    audioPlayer: DiscordVoice.createAudioPlayer(),
    currentSong: null,
    guildId: guildId,
    isPaused: true,
    playerSubscription: undefined,
    songs: [],
    voiceChannel: null,
    voiceConnection: null,
  };
  musicQueues.set(guildId, musicQueue);
  AudioPlayerEvents.registerListener(guildId);
  return musicQueue;
};

export namespace Queue {
  const musicQueues = new Map<string, MusicQueue>();

  export const getMusicQueue = (guildId: string) => {
    const guildQueue = musicQueues.get(guildId) ?? initMusicQueue(guildId, musicQueues);

    const joinVoiceChannel = (channel: Discord.VoiceChannel) => {
      const currentConnection = DiscordVoice.getVoiceConnection(guildId);
      const guild = client.guilds.cache.get(guildId);
      if (
        (currentConnection === undefined ||
          currentConnection.state.status === DiscordVoice.VoiceConnectionStatus.Disconnected) &&
        guild !== undefined
      ) {
        const voiceConnection = DiscordVoice.joinVoiceChannel({
          adapterCreator: guild.voiceAdapterCreator,
          channelId: channel.id,
          guildId: guildId,
        });
        const playerSubscription = voiceConnection.subscribe(guildQueue.audioPlayer);
        guildQueue.playerSubscription = playerSubscription;
        guildQueue.voiceChannel = channel;
        guildQueue.voiceConnection = voiceConnection;
      }
    };

    const leaveVoiceChannel = () => {
      const { audioPlayer, playerSubscription, voiceConnection } = guildQueue;
      if (voiceConnection !== null) {
        audioPlayer.stop();
        voiceConnection.disconnect();
        guildQueue.voiceChannel = null;
        guildQueue.voiceConnection = null;
        if (playerSubscription !== undefined) {
          playerSubscription.unsubscribe();
          guildQueue.playerSubscription = undefined;
        }
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

    const stop = () => {
      leaveVoiceChannel();
      guildQueue.currentSong = null;
      guildQueue.songs = [];
    };

    const skip = () => {};

    return {
      addSong: addSong,
      leaveVoiceChannel: leaveVoiceChannel,
      queueMap: guildQueue,
      skip: skip,
      stop: stop,
      voiceChannel: guildQueue.voiceChannel,
    };
  };
}
