import { CurrencyEntry, CribEntry, LavaEntry, SpawnEntry } from 'lava/mongo';
import { User, Guild } from 'discord.js';
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

Reflect.defineProperty(User.prototype, 'currency', {
	value: function (this: User) {
		return new CurrencyEntry(this, this.client.db.currency);
	}
});

Reflect.defineProperty(User.prototype, 'spawn', {
	value: function (this: User) {
		return new SpawnEntry(this, this.client.db.spawn);
	}
});

Reflect.defineProperty(User.prototype, 'crib', {
	value: function (this: User) {
		return new CribEntry(this, this.client.db.crib);
	}
});

Reflect.defineProperty(User.prototype, 'lava', {
	value: function (this: User) {
		return new LavaEntry(this, this.client.db.lava);
	}
});

export { User };