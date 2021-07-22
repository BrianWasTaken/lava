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
				{ price: 7.5e6 }, 
				{ price: 6.5e6 }, 
				{ price: 6e6 },
				{ price: 5.5e6 },
				{ price: 5e6 },
			],
			entities: {
				luck: [1, 3, 5, 10, 15, 20]
			}
		});
	}
}