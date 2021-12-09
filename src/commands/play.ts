import Discord from "discord.js";
import { getInfoFromInput } from "../util/helperFunctions";

export const executePlayCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member, options } = interaction;
  const input = options.getString("link");
  if (input !== null) {
    const info = await getInfoFromInput(input);
  } else {
    interaction.reply("Sorry, we couldn't find a YouTube link or search term.");
  }
};
