import { Inventory, CurrencyEntry } from 'lava/mongo';
import { DataManager, Collection } from 'discord.js';
import { Item, LavaClient } from 'lava/akairo';

export type InventoryResolvable = Inventory | string;

export declare interface InventoryManager extends DataManager<string, Inventory, InventoryResolvable> {
	readonly client: LavaClient;
}

export class InventoryManager extends DataManager<string, Inventory, InventoryResolvable> {
	/** The user entry for currency stuff. */
	public entry: CurrencyEntry;

	/** Construct an inventory manager. */
	public constructor(entry: CurrencyEntry, iterable: Collection<string, Inventory>) {
		super(entry.client, Inventory);
		/** @type {CurrencyEntry} */
		this.entry = entry;
	}
}