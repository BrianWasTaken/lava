import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('cheese', {
			assets: {
				name: 'Luca\'s Cheese',
				emoji: ':cheese:',
				price: 10000,
				intro: 'Lactose for bits?',
				info: 'Give yourself some bits of xp boost!',
			},
			config: {
				duration: 1000 * 60,
				push: true
			},
			upgrades: [
				{ price: 15000, duration: 1000 * 60 * 3 },
				{ price: 25000, duration: 1000 * 60 * 5 },
				{ price: 50000, duration: 1000 * 60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.xpBoost(10);
	}
}
