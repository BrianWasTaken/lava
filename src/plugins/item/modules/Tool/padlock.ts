import { CurrencyEntry, Colors } from 'lava/index';
import { ToolItem } from '../..';
import { Message } from 'discord.js';

export default class Tool extends ToolItem {
	constructor() {
		super('padlock', {
			assets: {
				name: 'Padlock',
				emoji: ':lock:',
				price: 3000,
				intro: 'Secure your coins!',
				info: 'Almost full protection from the pesky robbers!'
			},
			config: {
				rob: true,
				usable: true,
				push: true,
			},
		});
	}

	async use(ctx: Message, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = 1000 * 60 * 60;
		const expire = Date.now() + duration;

		await entry.subItem(this.id).activateItem(this.id, expire).save();
		
		return ctx.reply({ embeds: [{
			description: `Your ${this.id} will automatically break in ${parseTime(duration / 1000)}`,
			color: Colors.YELLOW, title: `You activated your ${this.name}!`,
		}]});
	}
}