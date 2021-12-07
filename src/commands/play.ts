import Discord from "discord.js";
import ytdl from "ytdl-core";
import { getLinkFromInput } from "../util/helperFunctions";

export const executePlayCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member, options } = interaction;
  const input = options.getString("link");
  if (input !== null) {
    const link = await getLinkFromInput(input);
    if (link !== undefined) {
      // TODO: Get song from Url
    } else {
      interaction.reply("Sorry, we cound't find a video for you.");
    }
  } else {
    interaction.reply("Sorry, we couldn't find a YouTube link or search term.");
  }
};
