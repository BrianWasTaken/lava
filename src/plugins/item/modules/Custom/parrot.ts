import { Item, ItemCategories } from 'lava/akairo';
import { Message } from 'discord.js';

export default class Custom extends Item {
	constructor() {
		super('parrot', {
			assets: {
				name: 'Parrot Plushie',
				emoji: ':parrot:',
				price: 999999999,
				intro: 'Do parrots really talk?',
				info: 'A fluffy and huggable plushie. Requested by our dearest, levi.',
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