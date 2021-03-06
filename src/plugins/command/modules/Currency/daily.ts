import { Command, Colors } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('daily', {
			aliases: ['daily', '24hr'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60 * 60 * 24,
			description: 'Claim your daily coins and items!',
			name: 'Daily'
		});
	}

	async exec(ctx: Message) {
		const entry = await ctx.author.currency.fetch();
		let { streak, time } = entry.cache.daily;

		if (Date.now() - time > 172800000) {
			entry.resetDailyStreak();
			streak = 1;
		} else {
			entry.addDailyStreak();
			streak += 1;
		}

		const baseCoins = 10000;
		const streakBonus = Math.round(0.3 * (baseCoins * streak));
		const won = streak > 1 ? baseCoins + streakBonus : baseCoins;
		await entry.addPocket(won).recordDailyStreak().save();

		return ctx.channel.send({ embeds: [{
			title: `Here are your daily coins, ${ctx.author.username}`,
			description: `**${won.toLocaleString()} coins** were placed in your pocket.`,
			color: Colors.BLUE,
			footer: {
				text: `Streak: ${streak} days ${(streak > 1 ? `(+${streakBonus.toLocaleString()} bonus)` : '')}`,
			},
		}]}).then(() => true);
	}
}