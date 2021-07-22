import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('medal', {
			assets: {
				name: 'Gold Medal',
				emoji: ':medal:',
				price: 15e6,
				intro: 'Barriers and barriers...',
				info: 'Grants you a steal barrier to decrease coins being robbed from you!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 12.5e6 }, 
				{ price: 10e6 }, 
				{ price: 7e6 },
				{ price: 6e6 },
				{ price: 5e6 }
			],
			entities: {
				shield: [5, 10, 15, 20, 30, 50]
			}
		});
	}
}