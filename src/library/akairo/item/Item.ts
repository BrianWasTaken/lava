/**
 * Base class for all items.
 * @author BrianWasTaken
 */

import { AbstractModuleOptions, AbstractModule } from 'lava/akairo';
import { MessageOptions, MessageEmbed, Message } from 'discord.js';
import { Context, CurrencyEntry, Inventory } from 'lava/index'; 
import { ItemHandler } from '.';

declare global {
	enum ItemCategory {
		COLLECTIBLE = 'Collectible',
		POWER_UP = 'Power-Up',
		TOOL = 'Tool',
		CUSTOM = 'Custom',
		PINATA = 'Pinata',
		BOX = 'Box',
		EXCLUSIVE = 'Exclusive'
	}
}

export interface ItemUpgrade extends ItemAssets {
	/**
	 * The level of this item.
	 * Note: It's automatic, no need to implement this.
	 */
	level?: number;
	/**
	 * Wether this item is premium for this level.
	 */
	premium?: boolean;
}

export interface ItemAssets extends AbstractModuleOptions {
	/** The name of this item. */
	name: string;
	/** The default price. */
	price: number;
	/** The category of this item. */
	category: ItemCategory;
	/** The sell rate from 0.01 to 1. */
	sellRate?: number;
	/** The upgrade price of this item. */
	upgrade: number;
	/** The emoji of this item. */
	emoji: string;
	/** The short display info in shop. */
	intro: string;
	/** The long info of this item. */
	info: string;
}

export interface ItemConfig {
	/** If item is premium by default. */
	premium?: boolean;
	/** Wether this item is an item to save death. */
	death?: boolean;
	/** Wether this item is a protection from rob. */
	rob?: boolean;
	/** Allow users to buy this item or not. */
	buyable?: boolean;
	/** Allow users to sell this item to shop or not. */
	sellable?: boolean;
	/** Allow users to use this item. */
	usable?: boolean;
	/** Wether this item is giftable or not. */
	giftable?: boolean;
	/** Wether to show this shit in the shop or not. */
	shop?: boolean;
	/** Wether to allow this item to be on sale or not. */
	sale?: boolean;
	/** Wether to show this item in user inventory or not. */
	inventory?: boolean;
	/** Wether to auto-push this item in your user's currency data or not. */
	push?: boolean;
	/**
	 * Wether this item has been retired or not.
	 * config properties overriden by this option:
	 * * inventory = false
	 * * shop = false
	 * * buyable = false
	 * * giftable = false
	 * * usable = false
	 * * sellable = false
	 * * death = false
	 * * rob = false
	 */
	retired?: boolean;
}

export interface ItemOptions {
	/** The basic shitfuckery of this item. */
	assets: ItemAssets;
	/** The config for the shitshow. */
	config: ItemConfig;
	/** The upgrades of this item */
	upgrades: Partial<ItemUpgrade>[];
}

export declare interface Item extends AbstractModule {
	/** The handler this item belongs to. */
	handler: ItemHandler;
	/** The category where this item belongs to. */
	categoryID: ItemCategory;
}

export abstract class Item extends AbstractModule {
	/** The default price. */
	public price: number;
	/** The sell rate from 0.01 to 1. */
	public sellRate: number;
	/** The upgrade price of this item. */
	public upgrade: number;
	/** The emoji of this item. */
	public emoji: string;
	/** The short display info in shop. */
	public intro: string;
	/** The long info of this item. */
	public info: string;

	/** If item is premium by default. */
	public premium: boolean;
	/** Wether this item is an item to save death. */
	public death: boolean;
	/** Wether this item is a protection from rob. */
	public rob: boolean;
	/** Allow users to buy this item or not. */
	public buyable: boolean;
	/** Allow users to sell this item to shop or not. */
	public sellable: boolean;
	/** Allow users to use this item. */
	public usable: boolean;
	/** Wether this item is giftable or not. */
	public giftable: boolean;
	/** Wether to show this shit in the shop or not. */
	public shop: boolean;
	/** Wether to allow this item to be on sale or not. */
	public sale: boolean;
	/** Wether to show this item in user inventory or not. */
	public inventory: boolean;
	/** Wether to auto-push this item in your user's currency data or not. */
	public push: boolean;
	/**
	 * Wether this item has been retired or not.
	 * config properties overriden by this option:
	 * * inventory = false
	 * * shop = false
	 * * buyable = false
	 * * giftable = false
	 * * usable = false
	 * * sellable = false
	 * * death = false
	 * * rob = false
	 */
	public retired: boolean;

	/** The upgrades of this item */
	public upgrades: Partial<ItemUpgrade>[];

	/**
	 * The constructor for any item.
	 */
	public constructor(id: string, options: Partial<ItemOptions>) {
		const { assets, config } = options;
		super(id, { name: assets.name, category: assets.category });
		this.price = assets.price;
		this.emoji = assets.emoji;
		this.sellRate = assets.sellRate ?? 0;
		this.upgrade = assets.upgrade;
		this.intro = assets.intro;
		this.info = assets.info;

		this.premium = config.premium ?? false;
		this.death = config.death ?? false;
		this.rob = config.rob ?? false;
		this.buyable = config.buyable ?? true;
		this.sellable = config.sellable ?? true;
		this.usable = config.usable ?? true;
		this.giftable = config.giftable ?? true;
		this.shop = config.shop ?? true;
		this.sale = config.sale ?? true;
		this.inventory = config.inventory ?? true;
		this.push = config.push ?? true;
		this.retired = config.retired ?? false;

		if (config.retired) {
			this.buyable = false;
			this.sellable = false;
			this.usable = false;
			this.giftable = false;
			this.shop = false;
			this.sale = false;
			this.inventory = false;
			this.death = false;
			this.rob = false;
		}

		this.upgrades = [{
			level: 0,
			name: this.name,
			price: this.price,
			emoji: this.emoji,
			sellRate: this.sellRate,
			upgrade: this.upgrade,
			info: this.info,
			premium: this.premium,
			intro: this.intro
		}, ...options.upgrades.map((up, i, arr) => 
			this._assign(up, {
				level: i + 1,
				name: this.name,
				price: this.price,
				emoji: this.emoji,
				sellRate: this.sellRate,
				upgrade: this.upgrade,
				info: this.info,
				premium: this.premium,
				intro: this.intro
			})
		)];
	}

	/**
	 * Assign the default properties of constructed items to default ones.
	 * @private
	 * @returns {object} the object
	 */
	private _assign<A>(o1: A, o2: Partial<A>): A {
		return Object.assign(o2, o1);
	}

	/**
	 * Main method to use items.
	*/
	public use(message: Message, entry: CurrencyEntry, times = 1): PromiseUnion<any> {
		return message.reply({ embeds: [{
			description: 'Used your item, now what?',
			title: `${this.emoji} ${this.name}`, color: 0xfafafa,
		}]});
	}

	/**
	 * Simple method to buy this item from the shop.
	 */
	public buy(entry: CurrencyEntry, options: {
		discount?: number;
		amount: number;
	}) {
		const thisItem = entry.props.items.get(this.id);
		const { price, sellRate, premium } = this.getUpgrade(thisItem);
		const discounted = this.calcDiscount(price, options.discount ?? 0);
		const calced = Math.round(discounted) * Math.trunc(options.amount);

		return (premium ? entry.subKeys(calced) : entry.removePocket(calced))
			.addItem(this.id, options.amount).save()
			.then(() => this.getUpgrade(thisItem));
	}

	/**
	 * Simple method to sell this item to the shop.
	 */
	public sell(entry: CurrencyEntry, options: {
		discount?: number;
		amount: number;
	}) {
		const thisItem = entry.props.items.get(this.id);
		const { price, sellRate, premium } = this.getUpgrade(thisItem);
		const discounted = this.calcDiscount(price * sellRate, options.discount ?? 0);
		const calced = Math.round(discounted) * Math.trunc(options.amount);

		return (premium ? entry.addKeys(calced) : entry.addPocket(calced))
			.subItem(this.id, options.amount).save()
			.then(() => this.getUpgrade(thisItem));
	}

	/**
	 * Get the upgrade of this item.
	 */
	public getUpgrade({ level }: Inventory) {
		const { discount, item } = this.handler.sale;
		const upgrade = this.upgrades[level];	

		const icon = upgrade.premium ? ':key:' : ':coin:';	
		const discounted = this.calcDiscount(upgrade.price, discount);
		const price = item.id === this.id ? discounted : upgrade.price;

		return { ...upgrade, price, icon };
	}

	/**
	 * Get the sale of this item.
	 */
	public getSale(inv: Inventory) {
		const { price, sellRate } = this.getUpgrade(inv);
		const { discount, item } = this.handler.sale;
		
		const calc = (amount: number) => item.id === this.id ? this.calcDiscount(amount, discount) : amount;
		return { sell: calc(price * sellRate), cost: calc(price) };
	}

	/**
	 * Design the shop info embed.
	 */
	public getEmbed<Embed extends MessageEmbed>(embed: Embed): Embed {
		return embed;
	}

	/**
	 * Calc discount for shit.
	 */
	public calcDiscount(amount: number, discount: number) {
		return Math.round(amount - (amount * (discount / 100)));
	}
}