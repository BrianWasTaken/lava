import { LavaClient } from 'lava/index';
import { Structure } from 'lava/discord';
import { Snowflake } from 'discord.js';
import { Endpoint } from 'lava/mongo';
import { Model } from 'mongoose';

export class BaseEntry<Profile extends BaseProfile> {
	/**
	 * The client instance for this entry.
	 */
	public client: LavaClient;
	/**
	 * The endpoint who owns this entry.
	 */
	public endpoint: Endpoint<Profile>;
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
	public constructor(context: Structure, endpoint: Endpoint<Profile>, cache?: Profile) {
		this.client = context.client;
		this.endpoint = endpoint;
		this.context = context;
		this.cache = cache;
	}

	/**
	 * Fetch the document from the db, or return the cached one.
	 */
	public async fetch(): Promise<Profile> {
		return await this.endpoint.fetch(this.context.id as Snowflake);

		const endpointCache = this.endpoint.cache.get(this.context.id as Snowflake);
		if (endpointCache) {
			this.cache = endpointCache;
			// return this;
		}

		const fetched = await this.endpoint.fetch(this.context.id as Snowflake);
		this.endpoint.cache.set(this.context.id as Snowflake, fetched);
		this.cache = fetched;
		// return this;
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