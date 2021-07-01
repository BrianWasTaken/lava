import { Command, Context } from 'lava/index';

export default class extends Command {
	constructor() {
		super('daily', {
			aliases: ['daily', '24hr'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Claim your daily coins and items!',
			name: 'Daily'
		});
	}

	async exec(ctx: Context) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		let { streak, time } = entry.data.daily;

		if (Date.now() - time > 172800000) {
			entry.resetDailyStreak();
			streak = 1;
		} else {
			entry.addDailyStreak();
			streak += 1;
		}

		const baseCoins = 10000;
		const streakBonus = Math.round(0.3 * (baseCoins * streak));
		const won = streak > 1 ? streakBonus : baseCoins;
		await entry.addPocket(won).recordDailyStreak().save();

		return ctx.channel.send({ embed: {
			title: `Here are your daily coins, ${ctx.author.username}`,
			description: `**${won.toLocaleString()}** were placed in your pocket.`,
			color: 'BLUE',
			footer: {
				text: `Streak: ${streak} days ${(streak > 1 ? `( +${streakBonus.toLocaleString()} )` : '')}`,
			},
		}})
	}
}