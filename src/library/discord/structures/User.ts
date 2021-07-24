import { CurrencyEntry, CribEntry, LavaEntry, SpawnEntry } from 'lava/mongo';
import { User, Structures, Snowflake, Guild } from 'discord.js';
import { LavaClient } from 'lava/akairo';
import { Structure } from '.';

declare module 'discord.js' {
	interface User {
		currency: CurrencyEntry;
		client: LavaClient;
		spawn: SpawnEntry;
		crib: CribEntry;
		lava: LavaEntry;
	}
}

export declare interface UserPlus extends User {
	client: LavaClient;
}

export class UserPlus extends User implements Structure {
	public currency = new CurrencyEntry(this, this.client.db.currency);
	public spawn = new SpawnEntry(this, this.client.db.spawn);
	public crib = new CribEntry(this, this.client.db.crib);
	public lava = new LavaEntry(this, this.client.db.lava);
}

Structures.extend('User', () => UserPlus);