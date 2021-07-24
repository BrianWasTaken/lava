import { GuildMember, Structures } from 'discord.js';
import { UserPlus, Structure } from '.';
import { LavaClient } from 'lava/akairo';

declare module 'discord.js' {
	interface GuildMember {
		client: LavaClient;
		user: User;
	}
}

export declare interface GuildMemberPlus extends GuildMember {
	client: LavaClient;
}

export class GuildMemberPlus extends GuildMember implements Structure {}
Structures.extend('GuildMember', () => GuildMemberPlus);