import type { SapphireClient } from '@sapphire/framework';
import type { GuildCircuit } from '#db/bundles/GuildCircuit';
import type { GuildBundle } from '#db/bundles/GuildBundle';
import type { UserCircuit } from '#db/bundles/UserCircuit';
import type { UserBundle } from '#db/bundles/UserBundle';
import type { Document } from 'mongoose';
import type { Awaited } from 'discord.js';
import { EventEmitter } from 'events';
import { Collection } from 'discord.js';
import { connect } from 'mongoose';

/**
 * An interface of bundles. Simply add something in this interface as follows.
 */
export interface ClientBundles {
	/**
	 * Bundle to manage user bullshit.
	 */
	user: UserBundle;
	/**
	 * Bundle to manage guild crap.
	 */
	guild: GuildBundle;
}

/**
 * The client to manage database collections and connections.
 * @since 4.0.0 
 */
export class Client extends EventEmitter {
	/**
	 * A collection of bundles for this client.
	 */
	public bundles: ClientBundlesRegistry;
	/**
	 * A secret shortcut to our discord client.
	 */
	public client: SapphireClient;
	public constructor(client: SapphireClient) {
		super();
		this.bundles = new ClientBundlesRegistry();
		this.client = client;
	}

	/**
	 * The users bundle.
	 */
	get users() {
		return this.bundles.get('user');
	}

	/**
	 * The guilds bundle.
	 */
	get guilds() {
		return this.bundles.get('guild');
	}
}

/**
 * Typings for client events.
 */
export interface ClientEvents {
	create: [circuit: CBValue];
}
export interface Client extends EventEmitter {
	emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
	emit(event: string, ...args: any[]): boolean;
	on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
	on(event: string, listener: (...args: any[]) => Awaited<void>): this;
	off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
	off(event: string, listener: (...args: any[]) => Awaited<void>): this;
}

/**
 * Implements a stricter type for the bundles registry, thanks to @sapphire/pieces.
 */
export type CBKey = keyof ClientBundles;
export type CBValue = ClientBundles[CBKey]; 
export class ClientBundlesRegistry extends Collection<CBKey, CBValue> {}
export interface ClientBundlesRegistry {
	get<K extends CBKey>(key: K): ClientBundles[K];
	get(key: string): undefined;
	has(key: CBKey): boolean;
	has(key: string): boolean;
}