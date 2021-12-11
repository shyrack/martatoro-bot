import Discord from "discord.js";
import { Queue } from "../queue/queue";
import { getEmbedFromInfo, getInfoFromInput } from "../util/helperFunctions";

export const executePlayCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member, options } = interaction;
  const input = options.getString("input");
  if (input !== null && member instanceof Discord.GuildMember) {
    const memberVoiceChannel = member.voice.channel;
    if (memberVoiceChannel instanceof Discord.VoiceChannel) {
      const info = await getInfoFromInput(input);
      if (info !== undefined) {
        const embed = getEmbedFromInfo(
          info.video_details,
          "Song wurde zur Warteschlange hinzugefügt",
          member,
        );
        const musicQueue = Queue.getMusicQueue(guildId);
        musicQueue.addSong(memberVoiceChannel, {
          infoData: info,
          isLive: info.LiveStreamData.isLive,
          member: member,
        });
        interaction.reply({ embeds: [embed] });
        return;
      }
    } else {
      // TODO
    }
  }
  interaction.reply("Sorry, we couldn't find a YouTube link or search term.");
};
