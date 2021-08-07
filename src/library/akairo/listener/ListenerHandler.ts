/**
 * Command Handler v2
 * @author BrianWasTaken
*/

import { AbstractHandlerOptions, AbstractHandler, AbstractModuleOptions, LavaClient } from 'lava/akairo';
import { ListenerHandler as OldListenerHandler, Category } from 'discord-akairo';
import { Collection } from 'discord.js';
import { Listener } from '.';

export declare interface ListenerHandler extends OldListenerHandler {
	/**
	 * All categories this listener handler hold.
	 */
	categories: Collection<string, Category<string, Listener>>;
	/**
	 * All listeners this handler hold.
	 */
	modules: Collection<string, Listener>;
	/**
	 * The client instance for this handler.
	 */
	client: LavaClient;
	/**
	 * Add a listener.
	 * @param filename the filename 
	 */
	add: (filename: string) => Listener;
	/**
	 * Find a category of commands.
	 * @param name the category name to resolve
	 */
	findCategory: (name: string) => Category<string, Listener>;
	/**
	 * Load a listener based from the file path or a class.
	 * @param thing the thing to load, either a filepath or a module
	 * @param isReload whether the listener was reloaded or not
	 */
	load: (thing: string | Function, isReload?: boolean) => Listener;
	/**
	 * Reload a listener.
	 * @param id the id of the listener to reload
	 */
	reload: (id: string) => Listener;
	/**
	 * Remove a listener.
	 * @param id the id of the listener to remove
	 */
	remove: (id: string) => Listener;
}

export class ListenerHandler extends OldListenerHandler implements AbstractHandler<Listener> {
	/**
	 * Construct a listener handler.
	 * @param client the client instance
	 * @param options the options for this listener handler
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}