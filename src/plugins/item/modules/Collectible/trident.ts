import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trident', {
			assets: {
				name: 'Neptune\'s Trident',
				emoji: ':trident:',
				price: 80e6,
				intro: 'Ready for ultimate grinding?',
				info: 'Grants you a great amount of XP boost NO ONE could ever get!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 50e6 }, 
				{ price: 40e6 }, 
				{ price: 35e6 },
				{ price: 30e6 },
				{ price: 25e6 }
			],
			entities: {
				xpBoost: [1, 2, 3, 4, 5, 10]
			}
		});
	}
}