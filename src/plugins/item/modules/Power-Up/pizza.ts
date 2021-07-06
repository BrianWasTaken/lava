import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('pizza', {
			assets: {
				name: 'Pizza Hut',
				emoji: ':pizza:',
				price: 125000,
				intro: 'Yummy experience orbs...',
				info: 'Eat a pizza for xp to grind!',
			},
			config: {
				duration: 1000 * 60 * 60 * 5,
				push: true
			},
			upgrades: [
				{ price: 165000, duration: 1000 * 60 * 60 * 10 },
				{ price: 225000, duration: 1000 * 60 * 60 * 20 },
				{ price: 320000, duration: 1000 * 60 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setXPBoost(5);
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		
	}
}
