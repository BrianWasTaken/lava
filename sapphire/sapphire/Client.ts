import { SapphireClient } from '@sapphire/framework';
import { Client } from '#db/Client';

declare module '@sapphire/framework' {
	interface SapphireClient {
		/**
		 * The database client to manage documents.
		 */
		db: Client;
	}
}

export class LavaClient extends SapphireClient {
	/**
	 * The database client to manage documents.
	 */
	public db: Client = new Client(this);
}

declare module 'discord.js' {
	interface Message {
		client: LavaClient;
	}
	interface Guild {
		client: LavaClient;
	}
	interface GuildMember {
		client: LavaClient;
	}
	interface User {
		client: LavaClient;
	}
}