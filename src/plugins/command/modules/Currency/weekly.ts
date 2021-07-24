import { Command, Context, Colors } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('weekly', {
			aliases: ['weekly', '7d'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60 * 60 * 24 * 7,
			description: 'Claim your weekly injection of coins!',
			name: 'Weekly'
		});
	}

	async exec(ctx: Message) {
		const entry = await ctx.author.currency.fetch();
		const won = 500000;
		await entry.addPocket(won).save();

		return ctx.channel.send({ embeds: [{
			title: `Here are your weekly coins, ${ctx.author.username}`,
			description: `**${won.toLocaleString()} coins** were placed in your pocket.`,
			color: Colors.BLUE,
		}]}).then(() => true);
	}
}