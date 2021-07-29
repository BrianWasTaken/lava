import { GuildMember } from 'discord.js';
import { LavaClient } from 'lava/akairo';
import { Structure } from '.';

declare module 'discord.js' {
	interface GuildMember {
		client: LavaClient;
		user: User;
	}
}

export { GuildMember };