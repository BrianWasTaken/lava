import { Item, ItemCategories } from 'lava/akairo';
import { Message } from 'discord.js';

export default class Custom extends Item {
	constructor() {
		super('panda', {
			assets: {
				name: 'Panda Plushie',
				emoji: ':panda_face:',
				price: 999999999,
				intro: 'They\'re so cute!',
				info: 'Pandas eat bamboos 3 times a day. Requested by mashisha.',
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