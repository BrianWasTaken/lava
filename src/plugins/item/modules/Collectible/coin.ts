import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('coin', {
			assets: {
				name: 'Lava Coin',
				emoji: ':coin:',
				price: 2e6,
				intro: 'Chings, Chings and Chings.',
				info: 'Increased payouts on multiplier-based gamble commands!'
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 1.5e6 }, 
				{ price: 1.25e6 }, 
				{ price: 1e6 },
				{ price: 750e3 },
				{ price: 500e3 },
			],
			entities: {
				payouts: [5, 10, 25, 50, 75, 100]
			}
		});
	}
}