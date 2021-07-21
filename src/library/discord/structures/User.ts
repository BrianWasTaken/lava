import { User, Structures, Snowflake, Guild } from 'discord.js';
import { BaseEntry, CurrencyModel } from 'lava/mongo';
import { LavaClient } from 'lava/akairo';
import { Structure } from '.';

declare module 'discord.js' {
	interface User {
		currency: BaseEntry<CurrencyProfile>;
		client: LavaClient;
	}
}

export class UserPlus extends User implements Structure {
	public currency = new BaseEntry<CurrencyProfile>(this, CurrencyModel);
}

Structures.extend('User', () => UserPlus);