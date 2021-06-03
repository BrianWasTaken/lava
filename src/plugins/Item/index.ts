import { Plugin, ItemHandler, Item, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Item', (client: LavaClient) => new ItemHandler(
		client, {
			automateCategories: true,
			classToHandle: Item,
			directory: join(__dirname, 'items'),
		}
	)
);

export * from './categories/Collectible';