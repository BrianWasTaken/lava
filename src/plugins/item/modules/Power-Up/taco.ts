import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('taco', {
			assets: {
				name: 'Crazy Dave\'s Taco',
				emoji: ':taco:',
				price: 25000,
				intro: 'Crazy for multipliers huh?',
				info: 'Multis multis and multis for few hours!',
			},
			config: {
				duration: 1000 * 60 * 60,
				push: true
			},
			upgrades: [
				{ price: 30000, duration: 1000 * 60 * 60 * 3 },
				{ price: 50000, duration: 1000 * 60 * 60 * 6 },
				{ price: 75000, duration: 1000 * 60 * 60 * 12 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.multi(15);
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = this.getDuration(entry);
		const expire = Date.now() + duration;
		const multi = 15;

		await entry.subItem(this.id).setItemMulti(this.id, multi).activateItem(this.id, expire).save();
		
		return ctx.reply({ embeds: [{
			description: `Your ${this.id} will begone in ${parseTime(duration / 1000)}`,
			color: Colors.FUCHSIA, title: `You activated your ${this.name}!`,
		}]});
	}
}
