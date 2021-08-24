import type { StoreOptions } from '@sapphire/framework';
import { NumberUtils, ArrayUtils } from '#util/index';
import { Store } from '@sapphire/framework';
import { Item } from './Item';

/**
 * The options for the item store.
 */
export interface ItemStoreOptions extends StoreOptions<Item> {
	/**
	 * The interval for each sale.
	 */
	saleInterval?: number;
	/**
	 * The filter to apply when finding an item to sale.
	 */
	saleFilter?: ItemSaleFilter;
}

/**
 * Store for all items.
 * @since 4.0.0
 */
export class ItemStore extends Store<Item> {
	/**
	 * States whether the sale has started.
	 */
	private _saleStarted: boolean;
	/**
	 * Represents the sale interval in milliseconds.
	 */
	public saleInterval: number;
	/**
	 * The sale filter.
	 */
	public saleFilter: ItemSaleFilter;
	/**
	 * All sales since the bot's uptime.
	 */
	public sales: ItemSale[];
	public constructor(options?: ItemStoreOptions) {
		super(Item, { name: 'items' });
		this._saleStarted = false;

		this.saleInterval = options?.saleInterval ?? 15 * 60 * 1000;
		this.saleFilter = options?.saleFilter ?? (() => true);
		this.sales = [];
	}

	/**
	 * Returns the current item on sale.
	 */
	public get sale(): ItemSale {
		return this.sales[0];
	}

	/**
	 * Starts the sale item.
	 */
	public startSale(): this {
		if (!this.size) return this;

		this.tickSale();
		this._saleStarted = true;
		setInterval(this.tickSale, this.saleInterval);
		return this;
	}

	/**
	 * Sets a new item on sale.
	 */
	private tickSale(): void {
		const random = ArrayUtils.randomItem([...this.filter(this.saleFilter).values()]);
		this.sales.push({ itemId: random.aliases[0], discount: NumberUtils.randomNumber(1, 100) });
	}
}

/**
 * The sale filter.
 */
export type ItemSaleFilter = (item: Item) => boolean;

/**
 * The sale data.
 */
export interface ItemSale {
	/**
	 * The id of the item on sale.
	 */
	itemId: string;
	/**
	 * The discount for this sale.
	 */
	discount: number;
}

declare module '@sapphire/pieces' {
	interface StoreRegistryEntries {
		items: ItemStore;
	}
}