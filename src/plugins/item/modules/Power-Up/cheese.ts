import { Context, CurrencyEntry } from 'lava/index';
import { PowerUpItem } from '../..';

export default class extends PowerUpItem {
	constructor() {
		super('cheese', {
			name: 'Luca\'s Cheese',
			emoji: ':cheese:',
			price: 2000,
			checks: 'time',
			duration: 1000 * 60,
			shortInfo: 'Permanent XP points what?',
			longInfo: 'Yes you got that right, i\'ll be granting you more xp points you earn per command!',
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 3 },
				{ price: 5000, duration: 1000 * 60 * 5 },
				{ price: 10000, duration: 1000 * 60 * 10 },
			]
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
