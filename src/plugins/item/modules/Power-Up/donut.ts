import { CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('donut', {
			assets: {
				name: 'Bob\'s Donut',
				emoji: ':doughnut:',
				price: 20000,
				intro: 'Coin madness!',
				info: 'Temporarily increase coin payouts in multiplier-based gambling commands!',	
			},
			config: {
				duration: 1000 * 60 * 10,
				push: true
			},
			upgrades: [
				{ price: 23000, duration: 1000 * 60 * 15 },
				{ price: 27000, duration: 1000 * 60 * 30 },
				{ price: 35000, duration: 1000 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.payouts(0.2);
	}
}
