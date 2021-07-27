import { AbstractModuleOptions, AbstractModule, Command, CommandHandler } from '..';
import { MessageOptions, EmojiResolvable, Collection } from 'discord.js';
import { GuildMemberPlus } from 'lava/discord';
import { SpawnHandler } from '.';

export enum SpawnTiers {
	COMMON = 'Common',
	UNCOMMON = 'Uncommon',
	SUPER = 'Super',
	GODLY = 'Godly'
}

/**
 * How the spawn should handle messages/reactions.
 */
export type SpawnMethod = 'message' | 'spam' | 'react';
/**
 * Collection of channel ids to spawn modules.
 */
export type SpawnQueue = CollectionPlus<CollectionPlus<GuildMemberPlus>>;

export interface SpawnDisplay {
	description: string;
	strings: string[];
	tier: SpawnTiers;
	title: string;
}

export interface SpawnConfig {
	cooldown: number;
	enabled: boolean;
	duration: number;
	maxEntries: number;
	method: SpawnMethod;
	odds: number;
	rewards: SpawnReward;
}

export interface SpawnReward {
	coins: [number, number];
	items: SpawnItemReward[];
}

export interface SpawnItemReward {
	amount: number;
	odds: number;
	id: string;
}

export interface SpawnOptions extends AbstractModuleOptions {
	config: SpawnConfig;
	display: SpawnDisplay;
}

export class Spawn extends AbstractModule {
	/** The handler this spawn module belongs to. */
	public handler: SpawnHandler;
	/** The configs of this spawner. */
	public config: SpawnConfig;
	/** The text u see in ur discord chats. */
	public display: SpawnDisplay;
	/** The queue? idk. */
	public queue: SpawnQueue;

	/** Construct a spawner. */
	public constructor(id: string, options: SpawnOptions) {
		super(id, { name: options.name, category: options.category });
		/** @type {SpawnConfig} */
		this.config = options.config;
		/** @type {SpawnDisplay} */
		this.display = options.display;
		/** @type {SpawnQueue} */
		this.queue = new Collection();
	}
}