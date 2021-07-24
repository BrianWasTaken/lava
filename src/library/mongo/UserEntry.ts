import { Constructable, Collection } from 'discord.js';
import { Document, Model } from 'mongoose';
import { EventEmitter } from 'events';
import { LavaClient } from 'lava/akairo';
import { Structure } from 'lava/index';
import { Endpoint } from '.';

/**
 * The main entry with sets of methods to apply changes on our data.
 * @abstract
*/
export abstract class UserEntry<Data extends BaseProfile = BaseProfile> {
	public endpoint: Endpoint<Data>;
	public context: Structure;
	public client: LavaClient;
	public cache: Data;

	public constructor(context: Structure, endpoint: Endpoint<Data>, cache?: Data) {
		/** @type {Endpoint} */
		this.endpoint = endpoint;
		/** @type {Structure} */
		this.context = context;
		/** @type {LavaClient} */
		this.client = endpoint.client;
		/** @type {Data} */
		this.cache = cache;
	}

	/**
	 * Fetch this item from mongodb.
	 */
	public async fetch(): Promise<this> {
		if (this.cache) return this;
		this.cache = await this.endpoint.model.findById(this.context.id);
		return this;
	}

	/**
	 * Map arrays of module-like objects to certain structures.
	 * @param key the key of data that should be an array
	 * @param structure the structure to transform the object
	 */
	public map<K extends keyof Data, S>(key: K, structure: Constructable<S>) {
		const collection = new Collection<string, S>();
		const slots = this.cache[key] as unknown;

		return (slots as DataSlot[]).reduce((coll, slot) => {
			const instance = new structure(this.client, slot);
			return coll.set(slot.id, instance);
		}, collection);
	}

	/**
	 * Save all changes of the data from this entry.
	*/
	public async save(): Promise<this> {
		const { cache } = await this.fetch();
		await cache.save();
		return this;
	}
}