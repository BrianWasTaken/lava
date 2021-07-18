import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('crown', {
			assets: {
				name: 'Royal Crown',
				emoji: ':crown:',
				price: 50e6,
				intro: 'You\'re the VIP of this shop...',
				info: 'Wearing this crown gives you a certain percentage of discount whenever you buy something!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 100e6 }, 
				{ price: 200e6 }, 
				{ price: 500e6 },
				{ price: 5000e6 },
				{ price: 10000e6 }
			],
			entities: {
				discount: [5, 10, 20, 40, 60, 100]
			}
		});
	}
}