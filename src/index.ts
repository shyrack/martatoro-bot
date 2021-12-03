import Discord from "discord.js";

export const client = new Discord.Client({ intents: [] });

client.on("ready", () => console.log("Happy Hacking!"));
