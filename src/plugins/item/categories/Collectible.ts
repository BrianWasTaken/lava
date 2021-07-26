import { Context, Item, ItemOptions, ItemAssets, ItemUpgrade, ItemConfig, ItemEntities, Inventory, CurrencyEntry } from 'lava/index';
import { MessageOptions, Message } from 'discord.js';

export type CollectibleItemAssets = Omit<ItemAssets, 'category' | 'sellRate' | 'upgrade'>;

export type CollectibleItemConfig = Omit<ItemConfig, 'premium' | 'sellable'>;

export interface CollectibleItemOptions extends Omit<ItemOptions, 'assets' | 'config' | 'upgrades'> {
	/** The basic info about this collectible. */ 
	assets: CollectibleItemAssets;
	/** The config for this collectible. */
	config: CollectibleItemConfig;
	/** The perks of this collectible. */
	entities: Partial<ItemEntities>;
	/** The upgrades of this goldshit. */
	upgrades: Partial<ItemUpgrade>[];
}

export abstract class CollectibleItem extends Item {
	/** Possible perks if they own this collectible. */
	public entities: ItemEntities;

	/**
	 * Constructor for this goldshit.
	 */
	public constructor(id: string, options: CollectibleItemOptions) {
		const { assets, config, upgrades, entities } = options;
		super(id, {
			assets: {
				sellRate: 0,
				upgrade: 25e6,
				category: ItemCategory.COLLECTIBLE,
				...assets
			},
			config: {
				premium: false,
				sellable: false,
				...config
			},
			upgrades: options.upgrades.map(up => ({ sellRate: 0, ...up })) ?? [],
		});

		this.entities = {
			multipliers: [],
			keys: [],
			shield: [],
			xpBoost: [],
			rob: [],
			discount: [],
			luck: [],
			payouts: [],
			slots: [],
			...options.entities,
		};
	}

	public getUpgrade(thisInv: Inventory) {
		type ReducedItemEntities = { [E in keyof ItemEntities]: number };
		const entities: ReducedItemEntities = Object.create(null);
		const entKeys = Object.keys(this.entities);

		entKeys.forEach(ent => {
			const key = ent as keyof ItemEntities;
			entities[key] = this.entities[key][thisInv.level];
		});

		return { ...super.getUpgrade(thisInv), entities };
	}

	/**
	 * Method to use this collectible.
	 */
	public use(ctx: Message, entry: CurrencyEntry) {
		const thisItem = entry.props.items.get(this.id);
		return ctx.reply(`**${this.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()} ${thisItem.upgrade.emoji} ${thisItem.upgrade.name}** couldn't be me`);
	}
}