/**
 * Inhibitor Handler v2
 * @author BrianWasTaken
*/

import { AbstractHandlerOptions, AbstractHandler, AbstractModuleOptions, LavaClient } from 'lava/akairo';
import { InhibitorHandler as OldInhibitorHandler, Category } from 'discord-akairo';
import { Collection } from 'discord.js';
import { Inhibitor } from '.';

export declare interface InhibitorHandler extends OldInhibitorHandler {
	/**
	 * All categories this inhibitor handler hold.
	 */
	categories: Collection<string, Category<string, Inhibitor>>;
	/**
	 * All inhibitors this handler hold.
	 */
	modules: Collection<string, Inhibitor>;
	/**
	 * The client instance for this handler.
	 */
	client: LavaClient;
	/**
	 * Add an inhibitor.
	 */
	add: () => Inhibitor;
	/**
	 * Find a category of inhibitors.
	 * @param name the name to resolve
	 */
	findCategory: (name: string) => Category<string, Inhibitor>;
	/**
	 * Load an inhibitor based from the file path or a class.
	 * @param thing the filepath to the module or the module to load
	 * @param isReload whether the load is a reload
	 */
	load: (thing: string | Function, isReload?: boolean) => Inhibitor;
	/**
	 * Reload an inhibitor.
	 * @param id the id of the inhibitor to reload
	 */
	reload: (id: string) => Inhibitor;
	/**
	 * Remove an inhibitor.
	 * @param id the id of the inhibitor to remove
	 */
	remove: (id: string) => Inhibitor;
}

export class InhibitorHandler extends OldInhibitorHandler implements AbstractHandler<Inhibitor> {
	/**
	 * Construct this inhibitor handler.
	 * @param client the discord.js client instance
	 * @param options the options for this inhibitor handler
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}