import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('clover', {
			assets: {
				name: 'Clover',
				emoji: ':four_leaf_clover:',
				price: 65000,
				intro: 'Good luck!',
				info: 'Grant yourself a good amount of luck in gamble, beg and slots. No one knows how lucky you are!',
			},
			config: {
				duration: 1000 * 60,
				push: true
			},
			upgrades: [
				{ price: 69000, duration: 1000 * 60 * 3 },
				{ price: 75000, duration: 1000 * 60 * 5 },
				{ price: 90000, duration: 1000 * 60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.luck(5);
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
