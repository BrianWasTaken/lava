import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('medal', {
			info: {
				buy: 15e6,
				emoji: ':medal:',
				name: 'Medal of Honor',
				sell: 0,
			},
			description: {
				long: 'Honorable item for honorable people!',
				short: 'Grants a discount per item you buy, does not stack.'
			},
			upgrades: [
				{ price: 25e6 }, 
				{ price: 30e6 }, 
				{ price: 45e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [10, 15, 20, 30],
		};
	}
}