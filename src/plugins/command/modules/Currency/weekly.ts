import { Command, Context, Colors } from 'lava/index';

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

	async exec(ctx: Context) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		const raw = ctx.client.util.randomNumber(1, 10);
		const multi = entry.calcMulti(ctx).unlocked.reduce((p, c) => p + c.value, 0);
		const won = Math.round(raw + (raw * (multi / 100))) * 1000000;
		await entry.addPocket(won).save();

		return ctx.channel.send({ embeds: [{
			title: `Here are your weekly coins, ${ctx.author.username}`,
			description: `**${won.toLocaleString()} coins** were placed in your pocket.`,
			color: Colors.BLUE,
			footer: {
				text: `Multiplier Bonus: +${multi}% (+${(won - raw).toLocaleString()} bonus)`,
			},
		}]}).then(() => true);
	}
}