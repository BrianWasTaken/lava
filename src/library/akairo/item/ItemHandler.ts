import { AbstractHandlerOptions, AbstractHandler, LavaClient, Item } from 'lava/akairo';
import { Collection, Snowflake } from 'discord.js';
import { ItemEffects } from 'lava/utility';

export interface ItemHandlerOptions extends AbstractHandlerOptions {
	/**
	 * The sale interval in ms.
	 */
	saleInterval?: number;
}

export interface ItemSale {
	/**
	 * The discount from 1% to 100%
	 */
	discount: number;
	/**
	 * The stamp when the next sale would be.
	 */
	nextSale: number;
	/**
	 * The stamp when it was on sale.
	 */
	stamp: number;
	/**
	 * The item on sale.
	 */
	item: Item;
}

export class ItemHandler extends AbstractHandler<Item> {
	/** The sale item. */
	public sale: ItemSale = Object.create(null);
	/** Previous sales. */
	public sales: ItemSale[] = [];
	/** Item effects mapped from snowflake to item to effects. */
	public effects: Collection<string, ItemEffects> = new Collection();
	/** The sale interval */
	public saleInterval: number;

	/**
	 * Construct an item handler.
	 * @param client the client instance
	 * @param options the options for this item handler
	 */
	public constructor(client: LavaClient, options: ItemHandlerOptions) {
		super(client, options);
		/** @type {number} */
		this.saleInterval = options.saleInterval ?? 1000 * 60 * 15;

		/**
		 * Sale Item.
		*/
		this.client.once('ready', () => {
			if (!this.modules.size) return;
			this.setSaleItem();
			setInterval(() => this.setSaleItem(), this.saleInterval);
		});
	}

	/**
	 * Sets the sale item.
	 */
	private setSaleItem(): ItemSale {
		this.sales.unshift(this.sale);

		return this.sale = { 
			item: this.client.util.randomInArray([...this.modules.values()].filter(i => i.sale && !i.retired)), 
			nextSale: (this.sale.nextSale ?? Date.now()) + this.saleInterval, 
			discount: this.client.util.randomNumber(1, 99), 
			stamp: Date.now() 
		};
	}
}