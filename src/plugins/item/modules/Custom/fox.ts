import { Message } from 'discord.js';
import { Item } from 'lava/akairo';

export default class Custom extends Item {
	constructor() {
		super('fox', {
			assets: {
				name: 'Fox Plushie',
				emoji: ':fox:',
				price: 999999999,
				intro: 'What does the fox say?',
				info: 'Just a cute and huggable plushie. Requested by chip lord.',
				category: ItemCategory.CUSTOM,
				upgrade: 0,
				sellRate: 0
			},
			config: {
				usable: false,
				sellable: false,
				shop: false,
			}
		});
	}
}