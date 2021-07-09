import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('phone', {
			assets: {
				name: 'Smart Phone',
				emoji: ':mobile_phone:',
				price: 6000,
				intro: 'iPhone 13 release when?',
				info: 'Contact anyone using your phone, anywhere!'
			},
			config: {
				usable: true,
				push: true,
			},
		});
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		return ctx.reply('Your phone is currently off.'); // Prompt `y / n` for 1000 coins to turn it on.
	}
}