import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('wine', {
			assets: {
				name: 'Red Wine',
				emoji: ':wine_glass:',
				price: 35000,
				intro: 'Just luck!',
				info: 'Good luck on any kind of robberies, no negative bullshit included!',
			},
			config: {
				duration: 1000 * 60 * 10,
				push: true
			},
			upgrades: [
				{ price: 37500, duration: 1000 * 60 * 15 },
				{ price: 42000, duration: 1000 * 60 * 30 },
				{ price: 50000, duration: 1000 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.rob(10);
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
