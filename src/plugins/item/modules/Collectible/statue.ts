import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('statue', {
			assets: {
				name: 'Brofist Statue',
				emoji: ':fist:',
				price: 100e6,
				intro: 'How tall can YOUR statue get?',
				info: 'A shitload of xp boosts, multipliers and steal shields. Congrats if you own this item.',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 250e6 }, 
				{ price: 500e6 }, 
				{ price: 1000e6 },
				{ price: 5000e6 },
				{ price: 10000e6 }
			],
			entities: {
				multipliers: [20, 30, 50, 60, 100, 200],
				xpBoost: [5, 10, 30, 50, 70, 100],
				shield: [5, 15, 20, 30, 50, 100],
			}
		});
	}
}