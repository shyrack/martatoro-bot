import Discord from "discord.js";
import { Playable } from "./Playable";

export class PlayableSong extends Playable {
  private live: boolean;

  constructor(
    channel: string,
    live: boolean,
    member: Discord.GuildMember,
    thumbnailUrl: string,
    title: string,
    uploadDate: string,
    url: string,
  ) {
    super(channel, member, thumbnailUrl, title, uploadDate, url);
    this.live = live;
  }

  get isLive() {
    return this.live;
  }
}
