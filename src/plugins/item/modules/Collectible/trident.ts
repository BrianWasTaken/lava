import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trident', {
			assets: {
				name: 'Neptune\'s Trident',
				emoji: ':trident:',
				price: 80e7,
				intro: 'Ready for ultimate grinding?',
				info: 'Grants you a great amount of XP boost NO ONE could ever get!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 100e7 }, 
				{ price: 120e7 }, 
				{ price: 150e7 },
				{ price: 200e7 },
				{ price: 250e7 }
			],
			entities: {
				xpBoost: [100, 200, 300, 400, 500, 1000]
			}
		});
	}
}