import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('ring', {
			assets: {
				name: 'Fabled Ring',
				emoji: ':ring:',
				price: 10e6,
				intro: 'A lucky charm?',
				info: 'Grants you good amount of luck on coin gaining commands!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 15e6 }, 
				{ price: 20e6 }, 
				{ price: 25e6 },
				{ price: 50e6 },
				{ price: 100e6},
				{ price: 200e6},
				{ price: 500e6},
				{ price: 1000e6},
				{ price: 2000e6},
				{ price: 5000e6},
				{ price: 1000000e6},

			],
			entities: {
				luck: [1, 3, 5, 10, 15, 20, 50, 60, 75, 100, 1000000]
			}
		});
	}
}