import { Item, ItemOptions, ItemAssets, ItemConfig, ItemUpgrade, Context, CurrencyEntry, ItemEffects, Inventory } from 'lava/index';

export type ExclusiveItemAssets = Omit<ItemAssets, 'category' | 'sellRate' | 'upgrade'>;

export type ExclusiveItemConfig = Omit<ItemConfig, 'premium' | 'buyable' | 'giftable'>;

export interface ExclusiveItemOptions extends Omit<ItemOptions, 'assets' | 'config' | 'upgrades'> {
	/** The basic info about this item. */ 
	assets: ExclusiveItemAssets;
	/** The config for this power-up. */
	config: ExclusiveItemConfig;
	/** The upgrades of this power-up. */
	upgrades?: Partial<ItemUpgrade>[];
}

export abstract class ExclusiveItem extends Item {
	/**
	 * Construct this powershit.
	 */
	public constructor(id: string, options: ExclusiveItemOptions) {
		const { assets, config, upgrades } = options;
		super(id, {
			assets: {
				sellRate: 0.1,
				upgrade: 10e6,
				category: 'Power-Up',
				...assets
			},
			config: {
				premium: false,
				buyable: false,
				giftable: false,
				...config
			},
			upgrades: options.upgrades?.map(up => ({ sell: 0.1, ...up })) ?? [],
		});
	}
}