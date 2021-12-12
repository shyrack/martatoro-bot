import Discord from "discord.js";
import _ from "lodash";
import { Queue } from "../queue/queue";

export const executeQueueCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId } = interaction;
  const musicQueue = Queue.getMusicQueue(guildId).queueMap;
  const { currentSong, songs } = musicQueue;
};
