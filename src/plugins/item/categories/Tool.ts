import { Item, ItemOptions, ItemUpgrade, ItemConfig, ItemAssets, Inventory, Context, CurrencyEntry, ItemEffects } from 'lava/index';

export type ToolItemAssets = Omit<ItemAssets, 'sellRate' | 'upgrade'>;

export interface ToolItemConfig extends Omit<ItemConfig, 'premium'> {
	/** The default duration of this tool. */
	duration?: number;
}

export interface ToolItemUpgrades extends Partial<ItemUpgrade> {
	/** The new duration of this item for this level. */
	duration?: number;
}

export interface ToolItemOptions extends Omit<ItemOptions, 'assets' | 'config' | 'upgrades'> {
	/** The basic info about this item. */ 
	assets: ToolItemAssets;
	/** The config for this tool. */
	config: ToolItemConfig;
	/** The upgrades of this tool. */
	upgrades?: ToolItemUpgrades[];
}

export abstract class ToolItem extends Item {
	/** The duration of this tool. */
	public duration: number;

	/**
	 * Construct a tool item.
	 */
	public constructor(id: string, options: ToolItemOptions) {
		const { assets, config, upgrades } = options;
		super(id, {
			assets: {
				sellRate: 0.1,
				upgrade: 25e4,
				category: 'Tool',
				...assets
			},
			config: {
				buyable: true,
				sellable: true,
				usable: true,
				giftable: true,
				shop: true,
				sale: true,
				inventory: true,
				...config
			},
			upgrades: options.upgrades?.map(up => ({ sell: 0.1, ...up })) ?? [],
		});
	}

	public getUpgrade(thisInv: Inventory) {
		return super.getUpgrade(thisInv) as ReturnType<Item['getUpgrade']> & ToolItemUpgrades;
	}

	public getDuration(entry: CurrencyEntry) {
		return this.getUpgrade(entry.props.items.get(this.id)).duration ?? 0;
	}
}