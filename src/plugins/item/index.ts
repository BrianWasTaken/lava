import { Plugin, ItemHandler, Item, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Item', (client: LavaClient) => new ItemHandler(
		client, {
			automateCategories: true,
			classToHandle: Item,
			debug: true,
			directory: join(__dirname, 'modules'),
			saleInterval: 1000 * 60 * 60,
		}
	)
);

export * from './categories/Collectible';
export * from './categories/PowerUp';
export * from './categories/Tool';