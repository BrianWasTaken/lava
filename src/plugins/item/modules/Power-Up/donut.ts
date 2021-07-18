import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('donut', {
			assets: {
				name: 'KC\'s Donut',
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
		return effects.payouts(10);
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = this.getDuration(entry);
		const expire = Date.now() + duration;
		const won = randomNumber(100, 1000);

		await entry.addPocket(won).activateItem(this.id, expire).save();
		return ctx.reply({ embed: {
			description: `Your ${this.id} will begone in ${parseTime(duration / 1000)}`,
			color: 'FUCHSIA', author: { name: `You activated your ${this.name}!` },
			footer: { text: `Coin Bonus: +${won.toLocaleString()} coins` }
		}});
	}
}
