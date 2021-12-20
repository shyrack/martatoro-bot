import Discord from "discord.js";
import _ from "lodash";
import { Queue } from "../queue/queue";
import { playableFromInput } from "../util/helperFunctions";

export const executePlayCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member, options } = interaction;
  const input = options.getString("input");
  if (input !== null && member instanceof Discord.GuildMember) {
    const memberVoiceChannel = member.voice.channel;
    if (memberVoiceChannel instanceof Discord.VoiceChannel) {
      const infos = await playableFromInput(input, member);
      if (infos !== undefined) {
        // const musicQueue = Queue.getMusicQueue(guildId);
        // _.forEach(infos, (info) =>
        //   musicQueue.addSong(memberVoiceChannel, {
        //     isLive: info.LiveStreamData.isLive,
        //     member: member,
        //   }),
        // );
        // const embeds = _.map(infos, (info) =>
        //   getEmbedFromInfo(
        //     info.video_details,
        //     "Song wurde zur Warteschlange hinzugefügt",
        //     member,
        //     _.size(musicQueue.queueMap.songs), // TODO: fix number of song in queue
        //   ),
        // );
        // interaction.reply({ embeds: embeds });
        return;
      }
    }
  }
  interaction.reply("Sorry, we couldn't find a YouTube link or search term.");
};
