import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('bacon', {
			assets: {
				name: 'Bacon',
				emoji: ':bacon:',
				price: 1000,
				intro: 'More ching chings!',
				info: 'Eat it for temporary multipliers',
			},
			config: {
				duration: 1000 * 60 * 5,
				push: true
			},
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 10 },
				{ price: 7000, duration: 1000 * 60 * 20 },
				{ price: 10000, duration: 1000 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.multi(entry.props.items.get(this.id).multiplier);
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = this.getDuration(entry);
		const expire = Date.now() + duration;
		const won = randomNumber(100, 1000);
		const multi = randomNumber(1, 10);

		await entry.addPocket(won).setItemMulti(this.id, multi).activateItem(this.id, expire).save();
		return ctx.reply({ embeds: [{
			description: `Your ${this.id} will begone in ${parseTime(duration / 1000)}`,
			color: 'FUCHSIA', author: { name: `You activated your ${this.name}!` },
			footer: { text: `Coin Bonus: +${won.toLocaleString()} coins` }
		}]});
	}
}
