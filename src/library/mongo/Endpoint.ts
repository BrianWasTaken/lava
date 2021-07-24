import { LavaClient, AbstractHandler } from 'lava/akairo';
import { Collection, Snowflake } from 'discord.js';
import { Document, Model } from 'mongoose';
import { AkairoHandler } from 'discord-akairo';
import { EventEmitter } from 'events';
import { UserEntry } from '.';
import { UserPlus } from 'lava/discord';

export interface EndpointEvents<Entry> {
	/** Emitted on profile creation. */
	create: [entry: Entry, user: UserPlus];
	/** Emitted on data deletion. */
	delete: [entry: Entry, user: UserPlus];
}

export interface Endpoint<Doc extends BaseProfile = never> extends EventEmitter {
	/** 
	 * Listen for currency events. 
	 */
	on<K extends keyof EndpointEvents<UserEntry<Doc>>>(event: K, listener: (...args: EndpointEvents<UserEntry<Doc>>[K]) => Awaited<void>): this;
	/**
	 * Emit currency events.
	 */
	emit<K extends keyof EndpointEvents<UserEntry<Doc>>>(event: K, ...args: EndpointEvents<UserEntry<Doc>>[K]): boolean;
}

/**
 * Our endpoint for all db collections.
*/
export abstract class Endpoint<Doc extends BaseProfile = never> extends EventEmitter {
	/**
	 * The client instantiated this endpoint.
	*/
	public client: LavaClient;
	/**
	 * The model for this endpoint.
	 * @readonly
	*/
	public model: Model<Doc>;
	/**
	 * The cached crap to reduce lag.
	 */
	public cache = new Collection<Snowflake, Doc>();

	/**
	 * The constructor for this endpoint.
	*/
	public constructor(
		/**
		 * The client instantiated this endpoint.
		*/
		client: LavaClient, 
		/**
		 * The model for this endpoint.
		 * @readonly
		*/
		model: Model<Doc>, 
	) { 
		super(); 
		this.client = client;
		this.model = model;
	}

	/**
	 * Fetch a document from the model of this endpoint based from the given id.
	*/
	public abstract fetch(_id: Snowflake): Promise<Doc>;
}