import { GambleCommand } from '../..';
import { Message } from 'discord.js';
import { Colors } from 'lava/index';

export default class extends GambleCommand {
	constructor() {
		super('pair', {
			aliases: ['pair'],
			description: 'Get a matching pair of numbered emojis! The lower the number the higher the wins.',
			name: 'Pair'
		});
	}

	get pairs() {
		return <{ [emoji: string]: number }> {
			one: 10,
			two: 8,
			three: 6,
			four: 4,
			five: 2,
			six: 1
		};
	}

	getPair() {
		return Array.from({ length: 2 }, () => {
			return this.client.util.randomInArray(Object.keys(this.pairs));
		});
	}

	async exec(ctx: Message, args: { amount: string }) {
		const entry = await ctx.author.currency.fetch();
		const bet = GambleCommand.parseBet(entry, args.amount);
		if (typeof bet === 'string') return ctx.reply(bet).then(() => false);

		const intro = `:${Array.from({ length: 2 }, () => Object.keys(this.pairs)[0]).join(':    :')}:`;
		const msg = await ctx.channel.send({ 
			content: ctx.author.toString(),
			allowedMentions: { users: [ctx.author.id] },
			embeds: [{
				author: {
					name: `${ctx.author.username}'s pairing game`,
					iconURL: ctx.author.avatarURL({ dynamic: true })
				},
				color: ctx.client.util.randomColor(),
				description: intro
			}]
		});

		const pair = this.getPair();
		const won = this.calcPair(pair, bet);
		if (!won) {
			const { props } = await entry.removePocket(bet).updateStats(this.id, bet, false).save();
			await ctx.client.util.sleep(2000);
			return await msg.edit({ embeds: [{ 
				...msg.embeds[0], 
				description: `:${pair.join(':    :')}:\nYou didn't get an outstanding pair sad. You lost your bet.\nNow you have **${props.pocket.toLocaleString()}**`
			}]}).then(() => true);
		}

		const { props } = await entry.addPocket(won).updateStats(this.id, won, true).save();
		await ctx.client.util.sleep(2000);
		return await msg.edit({ embeds: [{
			...msg.embeds[0],
			description: `:${pair.join(':    :')}:\n**LUCKY PAIR!** You won **${Math.round(won / bet)}x** of your bet: **${won.toLocaleString()}**\nNow you have **${props.pocket.toLocaleString()}**`
		}]}).then(() => true);
	}

	calcPair(pair: string[], bet: number) {
		if (pair.every((e, i, arr) => arr[0] === e)) {
			return Math.round(this.pairs[pair[0]] * bet);
		}
	} 
}