import { Context, CurrencyEntry, ItemEffects, Colors } from 'lava/index';
import { PowerUpItem } from '../..';
import { Message } from 'discord.js';

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
				{ price: 500, duration: 1000 * 60 * 10 },
				{ price: 250, duration: 1000 * 60 * 20 },
				{ price: 100, duration: 1000 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.multi(entry.props.items.get(this.id).multiplier);
	}

	async use(ctx: Message, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = this.getDuration(entry);
		const expire = Date.now() + duration;
		const multi = randomNumber(1, 10);

		await entry.subItem(this.id).setItemMulti(this.id, multi).activateItem(this.id, expire).save();
		
		return ctx.reply({ embeds: [{
			description: `Your ${this.id} will begone in ${parseTime(duration / 1000)}`,
			color: Colors.FUCHSIA, title: `You activated your ${this.name}!`,
		}]});
	}
}
