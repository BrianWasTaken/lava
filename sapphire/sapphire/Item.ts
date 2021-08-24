import type { Awaited, Message, ColorResolvable } from 'discord.js';
import type { AliasPieceOptions, PieceContext } from '@sapphire/pieces';
import type { ItemStore } from './ItemStore';
import { AliasPiece } from '@sapphire/pieces';

/**
 * Options for the {@link Item}.
 */
export interface ItemOptions {
	/**
	 * Shop-related properties for this item.
	 */
	assets: ItemAssets;
	/**
	 * Components that may trigger when this item interacts to it's owner.
	 */
	components?: ItemComponents;
	/**
	 * Possible restrictions of an item.
	 */
	config: ItemConfig;
	/**
	 * Possible upgrades of an item.
	 */
	upgrades?: ItemUpgrade[];
}

/**
 * Interface for the {@link Item} class.
 */
export interface Item extends AliasPiece {
	/**
	 * Where this item belongs.
	 */
	store: ItemStore;
}

/**
 * Base class for all items.
 * @since 2.0.0
 */
export class Item extends AliasPiece {
	/**
	 * Represents all the assets assigned for this item.
	 */
	public assets: ItemAssets;
	/**
	 * Specific components dependent to currency's features.
	 */
	public components: ItemComponents;
	/**
	 * Represents the config of this item.
	 */
	public config: ItemConfig;
	/**
	 * All upgrades of this item.
	 */
	public upgrades: ItemUpgrade[];

	/**
	 * Base parameters for all items.
	 * @param context Contains extra information about this piece
	 * @param options The options for this {@link Item}
	 */
	public constructor(context: PieceContext, options: ItemOptions) {
		super(context, options.assets);
		this.assets = options.assets;
		this.components = options.components ?? {};
		this.config = options.config;
		this.upgrades = this.getDefaultUpgrades(options.upgrades ?? []);
	}

	/**
	 * Get default values for an upgrade.
	 * @param upgrades the upgrades to fill in.
	 */
	private getDefaultUpgrades(upgrades: ItemUpgrade[]): ItemUpgrade[] {
		return upgrades.map((upgrade, level) => ({ ...this.assets, level, ...upgrade }));
	}

	/**
	 * Call this method to use this item.
	 * @param message a discord.js message object
	 */
	public use(message: Message): Awaited<void> {
		return;
	}
}

/**
 * Various item types.
 */
export const enum ItemTypes {
	ANIMAL = 'Animal',
	COLLECTABLE = 'Collectable',
	CONSUMABLE = 'Consumable',
	ILLEGAL = 'Illegal',
	PACKAGE = 'Box',
	PINATA = 'Pinata',
	POTION = 'Potion',
	SELLABLE = 'Sellable',
	SPECIAL = 'Special',
	UTILITY = 'Utility'
};

export interface ItemAssets extends AliasPieceOptions {
	/**
	 * Represents the name of this item.
	 */
	name: string;
	/**
	 * Long description of this item.
	 */
	description: string;
	/**
	 * Possible emoji of this item.
	 */
	emoji: string;
	/**
	 * Short description of this item.
	 */
	intro: string;
	/**
	 * The price of this item.
	 */
	price: number;
	/**
	 * A 2-decimal placed number multiplied to the price as the sell price.
	 * @example 0.15
	 */
	sell: number;
	/**
	 * The item type.
	 */
	type: ItemTypes;
	/**
	 * Represents the cost to upgrade this item.
	 * Note that this uses user `keys`.
	 */
	upgrade: number;
}

export interface ItemComponents {
	/**
	 * Whether this item can save you from death.
	 */
	death?: boolean;
	/**
	 * Whether this item is a rob protection.
	 */
	rob?: boolean;
	/**
	 * The possible embed colors when this item is active.
	 */
	colors?: ColorResolvable[];
}

export interface ItemUpgrade extends ItemAssets {
	/**
	 * The possible level of this item.
	 */
	level?: number;
}

export const enum ItemPremiumLevels {
	/**
	 * Free - Uses coins to buy or sell this item.
	 */
	CURRENCY_FREE,
	/**
	 * Tier 1 - Uses keys to buy or sell this item.
	 */
	CURRENCY_KEYS,
	/**
	 * Tier 2 - Uses coins to buy or sell this item, but needs to be a booster on the support server.
	 */
	GUILD_BOOSTER,
};

export interface ItemConfig {
	/**
	 * Whether buying this item is allowed.
	 */
	buyable?: boolean;
	/**
	 * Whether this item can be sold to the shop.
	 */
	sellable?: boolean;
	/**
	 * Whether this item can be giftable or not.
	 */
	giftable?: boolean;
	/**
	 * Represents the goldshit of this item.
	 */
	premium?: ItemPremiumLevels;
	/**
	 * Whether this item is visible to the shop.
	 */
	shop?: boolean;
	/**
	 * Whether this item is visible to user's inventory.
	 */
	inventory?: boolean;
	/**
	 * Whether this item could be on sale.
	 */
	sale?: boolean;
}