import Discord from "discord.js";
import { getEmbedFromInfo, getInfoFromInput } from "../util/helperFunctions";

export const executePlayCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member, options } = interaction;
  const input = options.getString("link");
  if (input !== null && member instanceof Discord.GuildMember) {
    const info = await getInfoFromInput(input);
    if (info !== undefined) {
      const embed = getEmbedFromInfo(
        info.video_details,
        "Song wurde zur Warteschlange hinzugefügt",
        member,
      );
      // TODO
      interaction.reply({ embeds: [embed] });
      return;
    }
  }
  interaction.reply("Sorry, we couldn't find a YouTube link or search term.");
};
