/**
 * Listener v2
 * @author BrianWasTaken
*/

import { Listener as OldListener, ListenerOptions, Category } from 'discord-akairo';
import { AbstractModule, LavaClient, ListenerHandler } from 'lava/akairo';
import { Collection, MessageOptions } from 'discord.js';

export declare interface Listener extends OldListener {
	/**
	 * The category this listener belongs to.
	 */
	category: Category<string, this>;
	/**
	 * The handler who owns this listener.
	 */
	handler: ListenerHandler;
	/**
	 * The client instance.
	 */
	client: LavaClient;
}

export class Listener extends OldListener implements AbstractModule {
	/**
	 * The name of this listener.
	 */
	public name: string;

	/**
	 * Construct a listener.
	 * @param id the id of this listener
	 * @param options the options for this listener
	 */
	public constructor(id: string, options: ListenerOptions) {
		super(id, options);
		/** @type {string} */
		this.name = options.name;
	}
}