import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class extends PowerUpItem {
	constructor() {
		super('wine', {
			name: 'Brian\'s Wine',
			emoji: ':wine:',
			price: 2000,
			checks: 'inventory',
			duration: 1000 * 60,
			shortInfo: 'Simply hack into your dice...',
			longInfo: 'Drink for temporary dice hax!',
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 3 },
				{ price: 5000, duration: 1000 * 60 * 5 },
				{ price: 10000, duration: 1000 * 60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setLuck('dice', 1);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}