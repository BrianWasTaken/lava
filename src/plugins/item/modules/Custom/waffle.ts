import { Item, ItemCategories } from 'lava/akairo';
import { Message } from 'discord.js';

export default class Custom extends Item {
	constructor() {
		super('waffle', {
			assets: {
				name: 'Waffles',
				emoji: ':waffle:',
				price: 999999999,
				intro: 'Delicious breakfast cuisine!',
				info: 'Some sweet and delicious food to chew and digest. Requested by the waffle lord himself.',
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