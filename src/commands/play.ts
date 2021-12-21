import _ from "lodash";
import Discord from "discord.js";
import { Queue } from "../queue/queue";
import { embedFromPlayable, playableFromInput } from "../util/helperFunctions";

export const executePlayCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member, options } = interaction;
  const input = options.getString("input");
  if (input !== null && member instanceof Discord.GuildMember) {
    const memberVoiceChannel = member.voice.channel;
    if (memberVoiceChannel instanceof Discord.VoiceChannel) {
      const playable = await playableFromInput(input, member);
      if (playable !== undefined) {
        const queue = Queue.getMusicQueue(guildId);
        const queueLength = _.size(queue.queueMap.playables);
        const embed = await embedFromPlayable(
          playable,
          queueLength === 0
            ? "Song or playlist will now be played."
            : "Song or playlist was added to the queue.",
          member,
          _.size(queue.queueMap.playables),
        );
        interaction.reply({
          embeds: [embed],
        });
        return;
      }
    }
  }
  interaction.reply("Sorry, we couldn't find a YouTube link or search term.");
};
