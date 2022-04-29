import _ from "lodash";
import Discord from "discord.js";
import { Queue } from "../queue/queue";
import { embedFromPlayable, playableFromInput } from "../util/helperFunctions";

export const executePlayCommand = async (interaction: Discord.CommandInteraction<Discord.CacheType>) => {
  const { guildId, member, options } = interaction;
  if (guildId === null) {
    return;
  }
  const input = options.getString("input");
  if (input !== null && member instanceof Discord.GuildMember) {
    const memberVoiceChannel = member.voice.channel;
    if (memberVoiceChannel instanceof Discord.VoiceChannel) {
      const playable = await playableFromInput(input, member);
      if (playable !== undefined) {
        const queueContext = Queue.getMusicQueue(guildId);
        const musicQueue = queueContext.queueMap;
        queueContext.addPlayable(memberVoiceChannel, member, playable);
        const embed = await embedFromPlayable(
          playable,
          musicQueue.currentSong === null
            ? "Song or playlist will now be played."
            : "Song or playlist was added to the queue.",
          member,
          _.size(musicQueue.playables)
        );
        interaction.reply({
          embeds: [embed]
        });
        return;
      }
    } else {
      interaction.reply("Sorry, but you have to join a voice channel first.");
      return;
    }
  }
  interaction.reply("Sorry, we couldn't find a YouTube link or search term.");
};
