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
			zero: 20,
			one: 0,
			two: 0,
			three: 0,
			four: 0,
			five: 0,
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
				description: intro,
				footer: {
					text: `${ctx.util.parsed.prefix} help ${ctx.util.parsed.command.aliases[0]} for how to play`
				}
			}]
		});

		const pair = this.getPair();
		const won = this.calcPair(pair, bet);
		if (!won) {
			const { props } = await entry.removePocket(bet).updateStats(this.id, bet, false).save();
			await ctx.client.util.sleep(1000);
			return await msg.edit({ embeds: [{ 
				...msg.embeds[0], 
				color: null,
				description: `:${pair.join(':    :')}:\nYou didn't get an outstanding pair sad. You lost your bet.\nNow you have **${props.pocket.toLocaleString()}**`
			}]}).then(() => true);
		}

		const { props } = await entry.addPocket(won.w).updateStats(this.id, won.w, true).save();
		await ctx.client.util.sleep(1000);
		return await msg.edit({ embeds: [{
			...msg.embeds[0],
			color: null,
			description: `:${pair.join(':    :')}:\n${won.ok === 2 ? '**LUCKY PAIR!**' : 'A single one, not bad.'} You won **${Number((won.w / bet).toFixed(1))}x** of your bet: **${won.w.toLocaleString()}**\nNow you have **${props.pocket.toLocaleString()}**`
		}]}).then(() => true);
	}

	calcPair(pair: string[], bet: number): { ok: number, w: number } | null {
		const emojis = Object.keys(this.pairs);
		const first = emojis[0];

		if (pair.every((e, i, arr) => arr[0] === e && e === first)) {
			return { ok: 2, w: Math.round(this.pairs[pair[0]] * bet) };
		}
		if (pair.some(e => emojis[0] === e)) {
			return { ok: 1, w: Math.round(bet * 4) };
		}
	} 
}