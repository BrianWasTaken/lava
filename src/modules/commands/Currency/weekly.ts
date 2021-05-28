import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('weekly', {
			name: 'Weekly',
			aliases: ['weekly', '7d'],
			channel: 'guild',
			description: 'Claim your weekly rewards.',
			category: 'Currency',
			cooldown: 1e3 * 60 * 60 * 24 * 7,
		});
	}

	public async exec(ctx: Context, entry: ContextDatabase): Promise<MessageOptions> {
		const won = 250000;
		await entry.addCd().addPocket(won).save();

		return {
			embed: {
				title: `Here are your daily coins, ${ctx.author.username}`,
				description: `**${won.toLocaleString()}** were placed in your pocket.`,
				color: 'INDIGO',
				footer: { text: `Thanks for supporting this trash bot!` },
			},
		};
	}
}