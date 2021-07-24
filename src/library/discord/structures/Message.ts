import { CurrencyEndpoint, SpawnEndpoint, LavaEndpoint, CribEndpoint } from 'lava/mongo';
import { UserPlus, GuildMemberPlus, Structure } from '.';
import { Message, Structures } from 'discord.js';
import { LavaClient } from 'lava/akairo';

declare module 'discord.js' {
	interface Message {
		client: LavaClient;
		author: User;
		readonly currency: CurrencyEndpoint;
		readonly spawn: SpawnEndpoint;
		readonly lava: LavaEndpoint;
		readonly crib: CribEndpoint;
		awaitMessage(userID?: Snowflake, time?: number): Promise<Message>;
	}
}

export declare interface Context extends Message {
	client: LavaClient;
}

export class Context extends Message implements Structure {	
	/**
	 * Currency Endpoint shortcut.
	 * * Inventory - Manage user inventories.
	 * * Gamble - Manage gambling stats.
	 * * Quest - Manage user quests.
	 * * Pet - Manage user pets.
	 */
	public get currency(): CurrencyEndpoint {
		return this.client.db.currency;
	}

	/**
	 * Spawn Endpoint shortcut.
	 * * Events - Manage different event types.
	 */
	public get spawn(): SpawnEndpoint {
		return this.client.db.spawn;
	}

	/**
	 * Lava Endpoint shortcut.
	 * * Cooldowns - Manage command cooldowns.
	 * * Settings - Manage bot settings.
	 */
	public get lava(): LavaEndpoint {
		return this.client.db.lava;
	}

	/**
	 * Crib Endpoint shortcut.
	 * * Donations - Manage user donos.
	 * * Boosts - Manage boost perks.
	 */
	public get crib(): CribEndpoint {
		return this.client.db.crib;
	}

	/**
	 * Await a single message from the idiots.
	 */
	public awaitMessage(userID = this.author.id, time = 30000) {
		return this.channel.awaitMessages({ time, max: 1, filter: m => m.author.id === userID }).then(col => col.first());
	}
}

Structures.extend('Message', () => Context)