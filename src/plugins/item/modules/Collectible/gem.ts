import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('gem', {
			assets: {
				name: 'Crystal Gem',
				emoji: ':gem:',
				price: 5e6,
				intro: 'A little gambling boost yeah?',
				info: 'Gives you a boost in your gambling multipliers for more ching ching :money_mouth:',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 4e6 }, 
				{ price: 3e6 }, 
				{ price: 2e6 },
				{ price: 1e6 },
				{ price: 5e5 },
			],
			entities: {
				multipliers: [1, 1, 2, 3, 5, 10]
			}
		});
	}
}