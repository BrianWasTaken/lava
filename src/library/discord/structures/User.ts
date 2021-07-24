import { CurrencyEntry, CribEntry, LavaEntry, SpawnEntry } from 'lava/mongo';
import { User, Structures, Snowflake, Guild } from 'discord.js';
import { LavaClient } from 'lava/akairo';
import { Structure } from '.';

declare module 'discord.js' {
	interface User {
		currency: CurrencyEntry;
		client: LavaClient;
		spawn: SpawnEntry;
		crib: CurrencyEntry;
		lava: LavaEntry;
	}
}

export class UserPlus extends User implements Structure {
	public currency = new CurrencyEntry(this, this.client.db.currency);
	public spawn = new CurrencyEntry(this, this.client.db.spawn);
	public crib = new CurrencyEntry(this, this.client.db.crib);
	public lava = new CurrencyEntry(this, this.client.db.lava);
}

Structures.extend('User', () => UserPlus);