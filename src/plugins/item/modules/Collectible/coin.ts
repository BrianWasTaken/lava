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
				{ price: 2e6 }, 
				{ price: 3e6 }, 
				{ price: 8e6 },
				{ price: 15e6 },
				{ price: 30e6 },
				{ price: 50e6},
				{ price: 100e6},
				{ price: 500e6},
				{ price: 1000e6},
				{ price: 5000e6},
			],
			entities: {
				payouts: [5, 10, 25, 50, 75, 100, 200, 300, 500, 1000]
			}
		});
	}
}