import { Collection, Snowflake } from 'discord.js';
import { Frame, FrameInterface } from '#db/Frame';
import { Document, Model } from 'mongoose';
import { Constructor } from '@sapphire/utilities';
import { Circuit } from '#db/Circuit';
import { Client } from '#db/Client';

/**
 * Base interface for all documents.
 */
export interface BaseProfile extends Document {
	/**
	 * The id of the document.
	 */
	_id: Snowflake;
}

/**
 * Generic class for caching documents.
 * @since 4.0.0
 */
export class Bundle<T extends BaseProfile> extends Collection<Snowflake, T> {
	/**
	 * The circuit class assigned for this bundle.
	 */
	public holds: Constructor<Circuit<T>>;
	/**
	 * The client to manage bundles of bullshit.
	 */
	public db: Client;
	/**
	 * The model for this bundle.
	 */
	public model: Model<T>;
	/**
	 * The default values to set on document creation.
	 */
	public defaults: Partial<Omit<T, '_id'>>;
	public constructor(db: Client, model: Model<T>, holds: Constructor<Circuit<T>>, defaults?: Partial<Omit<T, '_id'>>) {
		super();
		this.db = db;
		this.defaults = defaults ?? {};
		this.holds = holds;
		this.model = model;

		const cacheTimeout = 1000 * 60 * 60 * 3;
		setInterval(this.clear, cacheTimeout);
	}

	/**
	 * Construct a circuit to some cached value.
	 * @param cached The cache value to construct as circuit.
	 */
	public construct(cached: T) {
		return new this.holds(this, cached);
	}

	/**
	 * Fetch a certain document from the collection.
	 * @param _id The id of the document. Usually a discord id.
	 */
	public async fetch(_id: string): Promise<Circuit<T>> {
		const cached = this.get(_id);
		if (cached) return this.construct(cached);

		const fetched = await this.model.findById({ _id }) ?? await this.model.create({ _id });
		return this.construct(this.set(_id, fetched).get(_id)!);
	}

	/**
	 * Map an array of objects to their respective frames.
	 * @param slots An array of supported objects to frame.
	 * @param frame A constructable frame to transform the elements of the array.
	 */
	public frame<S extends FrameInterface, F extends Frame<T>>(slots: S[], frame: Constructor<F>) {
		return slots.reduce((collection, slot) => {
			return collection.set(slot.id, new frame(this.holds, slot));
		}, new Collection<string, F>());
	}
}