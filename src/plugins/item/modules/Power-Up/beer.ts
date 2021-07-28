import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('beer', {
			assets: {
				name: 'Beer',
				emoji: ':beers:',
				price: 35000,
				intro: 'Slots rig eh? One time solution!',
				info: 'Drink for temporarily high chance of jackpots on slots!',
			},
			config: {
				duration: 1000 * 60,
				push: true
			},
			upgrades: [
				{ price: 27000, duration: 1000 * 60 * 3 },
				{ price: 20000, duration: 1000 * 60 * 5 },
				{ price: 15000, duration: 1000 * 60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.slots(5);
	}
}
