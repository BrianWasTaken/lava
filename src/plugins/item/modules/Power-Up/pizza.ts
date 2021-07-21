import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
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
				duration: 1000 * 60 * 5,
				push: true
			},
			upgrades: [
				{ price: 165000, duration: 1000 * 60 * 10 },
				{ price: 225000, duration: 1000 * 60 * 20 },
				{ price: 320000, duration: 1000 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.xpBoost(200);
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
