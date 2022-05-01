import _ from "lodash";
import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import { client } from "..";
import { playableFromUrl, playAudio } from "../util/helperFunctions";
import { AudioPlayerEvents } from "../events/audioPlayerEvents";
import { MusicQueue } from "../util/types";
import { Playable } from "../playable/Playable";
import { PlayableSong } from "../playable/PlayableSong";
import { PlayableList } from "../playable/PlayableList";

const initMusicQueue = (guildId: string, musicQueues: Map<string, MusicQueue>): MusicQueue => {
  const musicQueue: MusicQueue = {
    audioPlayer: DiscordVoice.createAudioPlayer(),
    currentSong: null,
    guildId: guildId,
    isPaused: false,
    playerSubscription: undefined,
    playables: [],
    voiceChannel: null,
    voiceConnection: null
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
          adapterCreator: guild.voiceAdapterCreator as DiscordVoice.DiscordGatewayAdapterCreator,
          channelId: channel.id,
          guildId: guildId
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

    const addPlayable = async (channel: Discord.VoiceChannel, member: Discord.GuildMember, playable: Playable) => {
      joinVoiceChannel(channel);
      if (playable instanceof PlayableSong) {
        if (guildQueue.currentSong === null) {
          guildQueue.currentSong = playable;
          playAudio(guildQueue.audioPlayer, playable.isLive, playable.getUrl);
        } else {
          guildQueue.playables.push(playable);
        }
      } else if (playable instanceof PlayableList) {
        if (guildQueue.currentSong === null) {
          const firstSongUrl = playable.getUrls.shift();
          if (firstSongUrl === undefined) return;
          const firstSong = await playableFromUrl(firstSongUrl, member);
          guildQueue.currentSong = firstSong;
          playAudio(guildQueue.audioPlayer, firstSong.isLive, firstSong.getUrl);
        }
        const playables = await Promise.all(_.map(playable.getUrls, (url) => playableFromUrl(url, member)));
        _.forEach(playables, (playableSong) => guildQueue.playables.push(playableSong));
      }
    };

    const stop = () => {
      leaveVoiceChannel();
      guildQueue.currentSong = null;
      guildQueue.playables = [];
    };

    const skip = () => {
      const { audioPlayer } = guildQueue;
      audioPlayer.stop();
    };

    return {
      addPlayable: addPlayable,
      leaveVoiceChannel: leaveVoiceChannel,
      queueMap: guildQueue,
      skip: skip,
      stop: stop,
      voiceChannel: guildQueue.voiceChannel
    };
  };
}
