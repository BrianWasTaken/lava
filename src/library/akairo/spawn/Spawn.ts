import { AbstractModuleOptions, AbstractModule, Command, CommandHandler } from '..';
import { MessageOptions, EmojiResolvable, Collection, GuildMember } from 'discord.js';
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
export type SpawnQueue = CollectionPlus<CollectionPlus<GuildMember>>;

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

	/** 
	 * Construct a spawner. 
	 * @param id the id of this spawner
	 * @param options the options for this spawner
	 */
	public constructor(id: string, options: SpawnOptions) {
		super(id, { name: options.name, category: options.category });
		/** @type {SpawnConfig} */
		this.config = options.config;
		/** @type {SpawnDisplay} */
		this.display = options.display;
	}
}