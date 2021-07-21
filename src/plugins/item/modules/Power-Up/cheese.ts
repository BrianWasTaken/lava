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

	async use(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = this.getDuration(entry);
		const expire = Date.now() + duration;
		const won = randomNumber(100, 1000);

		await entry.addPocket(won).activateItem(this.id, expire).save();
		return ctx.reply({ embeds: [{
			description: `Your ${this.id} will begone in ${parseTime(duration / 1000)}`,
			color: Colors.FUCHSIA, author: { name: `You activated your ${this.name}!` },
			footer: { text: `Coin Bonus: +${won.toLocaleString()} coins` }
		}]});
	}
}
