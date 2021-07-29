import { Endpoint, SpawnEntry, EndpointEvents } from 'lava/mongo';
import { User } from 'discord.js';

export interface SpawnEndpointEvents extends EndpointEvents<SpawnEntry> {
	/** Emitted on profile creation. */
	create: [entry: SpawnEntry, user: User];
	/** Emitted when some rich dude paid the poor dude. */
	spawnPayment: [entry: SpawnEntry, user: User, args: { author: User; amount: number; }];
	/** Emitted when the poor duded tries to join an event but they're capped already. */
	spawnCapped: [entry: SpawnEntry, user: User, args: { author: User; }];
}

export interface SpawnEndpoint extends Endpoint<SpawnProfile> {
	/** 
	 * Listen for crib events. 
	 */
	on: <K extends keyof SpawnEndpointEvents>(event: K, listener: (...args: SpawnEndpointEvents[K]) => PromiseUnion<void>) => this;
	/**
	 * Emit crib events.
	 */
	emit: <K extends keyof SpawnEndpointEvents>(event: K, ...args: SpawnEndpointEvents[K]) => boolean;
}

export class SpawnEndpoint extends Endpoint<SpawnProfile> {
	/**
	 * Fetch some bank robber from the db.
	 */
	public async fetch(_id: Snowflake): Promise<SpawnProfile> {
		const doc = await this.model.findById({ _id }) ?? await this.model.create({ _id });
		if (!this.cache.has(_id)) this.cache.set(_id, doc);
		return doc;
	}
}