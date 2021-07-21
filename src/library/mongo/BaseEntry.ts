import { LavaClient } from 'lava/index';
import { Structure } from 'lava/discord';
import { Model } from 'mongoose';

export class BaseEntry<Profile extends BaseProfile> {
	/**
	 * The client instance for this entry.
	 */
	public client: LavaClient;
	/**
	 * The model assigned for this entry.
	 */
	public model: Model<Profile>;
	/**
	 * The discord.js structure for this entry.
	 */
	public context: Structure;
	/**
	 * The cached data from the database.
	 */
	public cache: Profile;

	/**
	 * Construct the base entry.
	 * @param context the main discord.js who owns this entry
	 * @param model the source collection to manage this entry
	 */
	public constructor(context: Structure, model: Model<Profile>) {
		this.client = context.client;
		this.context = context;
		this.model = model;
		this.cache = null;
	}

	/**
	 * Fetch the document from the db, or return the cached one.
	 */
	public async fetch(): Promise<this> {
		if (typeof this.cache !== 'undefined') return this;
		this.cache = await this.model.findById(this.context.id);
		return this;
	}

	/**
	 * Save the changes modified by this entry.
	 */
	public async save(): Promise<this> {
		const { cache } = await this.fetch();
		await cache.save();
		return this;
	}
} 