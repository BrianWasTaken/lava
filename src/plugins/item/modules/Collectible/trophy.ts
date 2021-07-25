import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trophy', {
			assets: {
				name: 'Lava Trophy',
				emoji: ':trophy:',
				price: 30e6,
				intro: 'Embrace the powers of the almighty trophy!',
				info: 'A great amount of gambling multiplier boost!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 25e6 }, 
				{ price: 20e6 }, 
				{ price: 15e6 },
				{ price: 125e5 },
				{ price: 10e6 }
			],
			entities: {
				multipliers: [5, 10, 10, 15, 15, 20]
			}
		});
	}
}