/**
 * Base class for all custom modules.
 * @author BrianWasTaken
*/

import { AkairoHandler, AkairoModuleOptions, AkairoModule, AkairoClient, Category } from 'discord-akairo';
import { AbstractHandler, LavaClient } from '.';
import { Collection } from 'discord.js';

export interface AbstractModuleOptions extends AkairoModuleOptions {
	/**
	 * The name for this module.
	 */
	name?: string;
}

export declare interface AbstractModule extends AkairoModule {
	/**
	 * The handler instantiated for this module.
	 * @readonly
	 */
	readonly handler: AkairoHandler | AbstractHandler<this>;
	/**
	 * The category this command belongs to.
	 */
	category: Category<string, this>;
	/**
	 * The client instantiated for this module.
	 */
	client: LavaClient;
}

export class AbstractModule extends AkairoModule {
	/**
	 * The name of this module.
	 */
	public name: string;

	/**
	 * The constructor for this module.
	 * @param id the id of this module.
	 * @param options the options for this module.
	 */
	public constructor(id: string, options: AbstractModuleOptions) {
		super(id, options);
		/** @type {string} */
		this.name = options.name;
	}
}