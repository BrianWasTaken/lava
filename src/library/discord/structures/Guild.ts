import { Guild } from 'discord.js';

declare module 'discord.js' {
	interface Guild {
		db: any;
	}
}

Reflect.defineProperty(Guild.prototype, 'db', {});

export { Guild };