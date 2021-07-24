import { Command, Context, Colors } from 'lava/index';

export default class extends Command {
	constructor() {
		super('hourly', {
			aliases: ['hourly', '1hr'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60 * 60,
			description: 'Claim your hourly injection of coins!',
			name: 'Hourly'
		});
	}

	async exec(ctx: Context) {
		const entry = await ctx.author.currency.fetch();
		const won = 10000;
		await entry.addPocket(won).save();

		return ctx.channel.send({ embeds: [{
			title: `Here are your hourly coins, ${ctx.author.username}`,
			description: `**${won.toLocaleString()} coins** were placed in your pocket.`,
			color: Colors.BLUE,
		}]}).then(() => true);
	}
}