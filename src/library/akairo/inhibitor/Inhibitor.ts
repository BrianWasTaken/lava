/**
 * Inhibitor v2
 * @author BrianWasTaken
*/

import { Inhibitor as OldInhibitor, InhibitorOptions, Category } from 'discord-akairo';
import { AbstractModule, LavaClient, Command } from 'lava/akairo';
import { Collection, MessageOptions, Message } from 'discord.js';
import { InhibitorHandler } from '.';

export declare interface Inhibitor extends OldInhibitor {
	/**
	 * The category this inhibitor belongs to.
	 */
	category: Category<string, this>;
	/**
	 * The handler who owns this inhibitor.
	 */
	handler: InhibitorHandler;
	/**
	 * The client instance.
	 */
	client: LavaClient;
}

export abstract class Inhibitor extends OldInhibitor implements AbstractModule {
	/**
	 * The name of this inhibitor.
	 */
	public name: string;

	/**
	 * Construct an inhibitor.
	 * @param id the id of this inhibitor
	 * @param options the options for this inhibitor
	 */
	public constructor(id: string, options: InhibitorOptions) {
		super(id, options);
		/** @type {string} */
		this.name = options.name;
	}

	/**
	 * Main method to run this inhibitor.
	 * @param message the discord message object
	 * @param command the command to manage for this inhibitor
	 */
	public abstract exec(message: Message, command?: Command): PromiseUnion<boolean>;
}