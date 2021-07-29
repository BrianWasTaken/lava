import { LavaClient, Plugin, AbstractHandler, InhibitorHandler, CommandHandler, ListenerHandler } from '.';
import { AkairoHandler } from 'discord-akairo';
import { Collection } from 'discord.js';

import EventEmitter from 'events';
import path from 'path';
import fs from 'fs';

interface PluginManagerOptions {
	/**
	 * The directory where all plugins are stored.
	 */
	directory: string;
}

export class PluginManager extends EventEmitter {
	/**
	 * The client instance.
	 */
	public client: LavaClient;
	/**
	 * The directory.
	 */
	public directory: string;
	/**
	 * The collection of plugins.
	 */
	public plugins: Collection<string, Plugin>;

	/**
	 * Constructor for this plugin manager.
	 */
	public constructor(client: LavaClient, options: PluginManagerOptions) {
		super();
		/** @type {LavaClient} */
		this.client = client;
		/** @type {string} */
		this.directory = options.directory;
		/** @type {Collection<string, Plugin>} */
		this.plugins = new Collection();
	}

	/**
	 * Walks in all folders on the given directory.
	 */
	readSync(dir: string) {
		return fs.statSync(dir).isDirectory()
			? [].concat(...fs.readdirSync(dir)) // ['a', 'b']
				.map(d => path.join(dir, d)) // ['path/to/a', 'path/to/b']
				.filter(Boolean)
			: undefined;
	}

	/**
	 * Register all plugins.
	 */
	register(dir = this.directory) {
		const plugins: Plugin[] = this.readSync(dir)
			.map(e => require(e).default)
			.filter(Boolean);

		for (const plugin of plugins) {
			if (plugin instanceof Plugin) {
				plugin.initClient(this.client);
				plugin.initHandler();
				this.plugins.set(plugin.id, plugin);
			}
		}

		return this.plugins;
	}

	/**
	 * Load all plugins.
	 */
	loadAll() {
		for (const plugin of Array.from(this.register().values())) {
			if (plugin.handler) this.emit('load', plugin);
		}

		const plug = (id: string) => this.plugins.get(id).handler as unknown 
		const l = plug('listener') as ListenerHandler;
		const c = plug('command') as CommandHandler;
		c.useInhibitorHandler(plug('inhibitor') as InhibitorHandler);
		c.useListenerHandler(l);

		const emitters: { [k: string]: EventEmitter } = {}; 
		this.plugins.forEach((v, k) => emitters[k] = v.handler);
		l.setEmitters(emitters);

		this.plugins.forEach(p => p.load());
		return this;
	}
}