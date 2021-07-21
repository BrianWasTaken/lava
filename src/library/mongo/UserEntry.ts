import { Constructable, Collection } from 'discord.js';
import { EventEmitter } from 'events';
import { LavaClient } from 'lava/akairo';
import { Structure } from 'lava/index';
import { Document } from 'mongoose';
import { Endpoint } from '.';

/**
 * The main entry with sets of methods to apply changes on our data.
 * @abstract @extends {Base}
*/
export abstract class UserEntry<Data extends BaseProfile = BaseProfile> {
	/**
	 * The endpoint who owns this entry.
	 */
	public endpoint: Endpoint<Data>;

	/**
	 * The client instantiated this entry.
	*/
	public client: LavaClient;

	/**
	 * The data for this entry.
	*/
	public data: Data;

	/**
	 * The constructor for this entry.
	*/
	public constructor(endpoint: Endpoint<Data>, data: Data) {
		/** @type {Endpoint} */
		this.endpoint = endpoint;
		/** @type {LavaClient} */
		this.client = endpoint.client;
		/** @type {Data} */
		this.data = data;
	}

	/**
	 * Map all raw slot array from data to a certain structure.
	 */
	public map<K extends keyof Data, S>(key: K, structure: Constructable<S>) {
		const collection = new Collection<string, S>();
		const slots = this.data[key] as unknown;

		return (slots as DataSlot[]).reduce((coll, slot) => {
			const instance = new structure(this.client, slot);
			return coll.set(slot.id, instance);
		}, collection);
	}

	/**
	 * Save all changes of the data from this entry.
	*/
	public save(): Promise<this> {
		return this.data.save().then(() => this);
	}
}