import { User, Structures } from 'discord.js';
import { LavaClient } from 'lava/akairo';
import { Structure } from '.';

export declare interface UserPlus extends User {
	/**
	 * The client instance.
	 */
	client: LavaClient;
}

export class UserPlus extends User implements Structure {
	
	
	public get mutualGuilds() {
		return this.client.guilds.cache.filter(g => g.members.cache.has(this.id));
	}
}

Structures.extend('User', () => UserPlus);