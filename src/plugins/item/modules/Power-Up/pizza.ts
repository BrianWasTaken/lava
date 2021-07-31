import { CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';
import { Message } from 'discord.js';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('pizza', {
			assets: {
				name: 'Pizza Hut',
				emoji: ':pizza:',
				price: 125000,
				intro: 'Yummy experience orbs...',
				info: 'Eat a pizza for xp boosts to grind!',
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
		return effects.xpBoost(10);
	}

	async use(ctx: Message, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = this.getDuration(entry);
		const expire = Date.now() + duration;
		const won = randomNumber(100, 1000);

		await entry.subItem(this.id).addPocket(won).activateItem(this.id, expire).save();
		return ctx.reply({ embeds: [{
			description: `Your ${this.id} will begone in ${parseTime(duration / 1000)}`,
			color: Colors.FUCHSIA, author: { name: `You activated your ${this.name}!` },
			footer: { text: `Coin Bonus: +${won.toLocaleString()} coins` }
		}]});
	}
}
