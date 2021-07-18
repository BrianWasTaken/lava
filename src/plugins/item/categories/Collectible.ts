import { Context, Item, ItemOptions, ItemAssets, ItemUpgrade, ItemConfig, ItemEntities, CurrencyEntry } from 'lava/index';
import { MessageOptions } from 'discord.js';

export type CollectibleItemAssets = Omit<ItemAssets, 'sellRate' | 'upgrade'>;

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
				upgrade: 100e6,
				category: 'Collectible',
				...assets
			},
			config: {
				premium: false,
				sellable: false,
				sale: false,
				...config
			},
			upgrades: options.upgrades.map(up => ({ sellRate: 0, ...up })) ?? [],
		});

		this.entities = options.entities ?? Object.create(null);
	}

	/**
	 * Method to use this collectible.
	 */
	public use(ctx: Context, entry: CurrencyEntry) {
		const thisItem = entry.props.items.get(this.id);
		return ctx.reply(`**${this.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()} ${thisItem.upgrade.emoji} ${thisItem.upgrade.name}** couldn't be me`);
	}
}