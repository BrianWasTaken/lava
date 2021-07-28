import { Item, ItemCategories } from 'lava/akairo';
import { Message } from 'discord.js';

export default class Custom extends Item {
	constructor() {
		super('cat', {
			assets: {
				name: 'Bongo Cat',
				emoji: ':cat:',
				price: 999999999,
				intro: 'Meow!',
				info: 'Bongo bongo bongo! Requested by inferno.',
				category: ItemCategories.CUSTOM,
				upgrade: 0,
				sellRate: 0
			},
			config: {
				usable: false,
				sellable: false,
				shop: false,
				sale: false
			},
			upgrades: []
		});
	}
}