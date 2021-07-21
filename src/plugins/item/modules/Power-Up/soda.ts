import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('soda', {
			assets: {
				name: 'Lemon Soda',
				emoji: ':tropical_drink:',
				price: 20000,
				intro: 'Premium shit droppin\' baby!',
				info: 'Temporarily increase your potential in dropping keys when you use commands!',
			},
			config: {
				duration: 1000 * 60 * 5,
				push: true
			},
			upgrades: [
				{ price: 28000, duration: 1000 * 60 * 7 },
				{ price: 40000, duration: 1000 * 60 * 10 },
				{ price: 60000, duration: 1000 * 60 * 15 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.keys(10);
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
