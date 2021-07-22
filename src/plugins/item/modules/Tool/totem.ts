import { Context, CurrencyEntry, Colors } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('totem', {
			assets: {
				name: 'Totem of Hearts',
				emoji: ':heart:',
				price: 10000,
				intro: 'Death dodger?',
				info: 'Equip to prevent dying and not lose any cluster of your progress!'
			},
			config: {
				death: true,
				usable: true,
				push: true,
			},
		});
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = 1000 * 60 * 60;
		const expire = Date.now() + duration;

		await entry.activateItem(this.id, expire).save();

		return ctx.reply({ embeds: [{
			description: `Your ${this.id} will stop beating in ${parseTime(duration / 1000)}`,
			color: Colors.YELLOW, title: `You activated your ${this.name}!`,
		}]});
	}
}