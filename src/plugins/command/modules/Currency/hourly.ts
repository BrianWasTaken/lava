import { Command, Context } from 'lava/index';

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
		const entry = await ctx.currency.fetch(ctx.author.id);
		const raw = ctx.client.util.randomNumber(1, 100);
		const multi = entry.calcMulti(ctx).unlocked.reduce((p, c) => p + c.value, 0);
		const won = Math.round(raw + (raw * (multi / 100))) * 100;
		await entry.addPocket(won).save();

		return ctx.channel.send({ embeds: [{
			title: `Here are your hourly coins, ${ctx.author.username}`,
			description: `**${won.toLocaleString()} coins** were placed in your pocket.`,
			color: 'BLUE',
			footer: {
				text: `Multiplier Bonus: +${multi}% (+${(won - raw).toLocaleString()} bonus)`,
			},
		}]}).then(() => true);
	}
}