/**
 * Base class for all custom handlers.
 * @author BrianWasTaken
*/

import { AkairoHandlerOptions, AkairoHandler, AkairoModule, Category, LoadPredicate } from 'discord-akairo';
import { AbstractModule, LavaClient } from '.';
import { Collection } from 'discord.js';

export interface AbstractHandlerOptions extends AkairoHandlerOptions {
	/**
	 * Wether to emit all events for this handler.
	 */
	debug?: boolean;
}

export declare interface AbstractHandler<Module extends AbstractModule = AbstractModule> extends AkairoHandler {
	/**
	 * The categories this handler load, containing a collection of modules.
	 */
	categories: Collection<string, Category<string, Module>>;
	/**
	 * The modules this handler hold.
	 */
	modules: Collection<string, Module>;
	/**
	 * The client for this handler.
	 */
	client: LavaClient;
	/**
	 * Remove a module from our modules collection.
	 * @param mod the module to deregister
	 */
	deregister: (mod: Module) => void;
	/**
	 * Resolve a category.
	 * @param name the name of the category to resolve
	 */
	findCategory: (name: string) => Category<string, Module>;
	/**
	 * Load a module.
	 * @param thing the filepath of the module or the module to load
	 * @param isReload whether the module is a reload or not
	 */
	load: (thing: string | Function, isReload?: boolean) => Module;
	/**
	 * Load all modules.
	 * @param directory the directory of the modules to laod from.
	 * @param filter a filter function; the filepath as it's first parameter
	 */
	loadAll: (directory?: string, filter?: LoadPredicate) => this;
	/**
	 * Patch the module's properties and add it to the handler's modules.
	 * @param mod the module to register
	 * @param filepath register the module from the filepath
	 */
	register: (mod: Module, filepath?: string) => void;
	/**
	 * Reload a module.
	 * @param id the id of the module to reload
	 */
	reload: (id: string) => Module;
	/**
	 * Remove a module.
	 * @param id the id of the module to remove from the modules collection 
	 */
	remove: (id: string) => Module;
}

export abstract class AbstractHandler<Module extends AbstractModule = AbstractModule> extends AkairoHandler {
	/**
	 * Constructor for this handler.
	 * @param client the discord.js client instance
	 * @param options the options for this abstract handler
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
		if (options.debug ?? process.env.DEV_MODE === 'true') {
			const log = (message: string) => this.client.console.log('Akairo', message);
			this.on('load', (mod: AkairoModule) => log(`${options.classToHandle.name} "${mod.id}" loaded.`));
			this.on('remove', (mod: AkairoModule) => log(`${options.classToHandle.name} "${mod.id}" removed.`));
		}
	}
}