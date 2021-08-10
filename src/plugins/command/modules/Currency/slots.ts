import { Currency, Colors, CurrencyEntry } from 'lava/index';
import { GambleCommand } from '../..';
import { Message } from 'discord.js';

export default class extends GambleCommand {
	constructor() {
		super('slots', {
			aliases: ['slotmachine', 'slots'],
			description: 'Spin the slot machine to have a chance to win a jackpot!',
			name: 'Slots',
		});
	}

	get slots() {
		return (multi: number) => ({
			skull: [0.1, 0.3],
			clown: [0.1, 0.3],
			alien: [0.2, 0.4],
			peach: [0.2, 0.4],
			eggplant: [0.3, 0.5],
			flushed: [0.3, 0.5],
			trident: [0.4, 0.6],
			trophy: [0.4, 0.6],
			fire: [0.5, 1.0],
			// coin: [1, 3],
			// gem: [1, 3],
			// medal: [1, 3],
			// ring: [1, 3],
			// trophy: [2, 5],
			// crown: [2, 5],
			// trident: [2, 5],
			// fist: [2, 5],
			// fire: [10, multi]
		});
	}

	getSlots(entry: CurrencyEntry, emojis: string[]) {
		const { randomInArray, randomsInArray, randomNumber, deepFilter, shuffle } = this.client.util;
		const first = randomInArray(emojis);
		const odds = randomNumber(1, 100);

		if (randomNumber(1, 100) > 100 - entry.effects.slots) return Array(3).fill(first);
		return Array.from({ length: 3 }, () => randomInArray(emojis));
		
		if (odds > 95) {
			return Array(3).fill(first);
		}
		if (odds > 85) {
			return shuffle([...Array(2).fill(first), deepFilter(emojis, [first])]);
		}

		return randomsInArray(emojis, 3);
	}

	async exec(ctx: Message, args: { amount: string }) {
		const entry = await ctx.author.currency.fetch();
		const bet = GambleCommand.parseBet(entry, args.amount);
		if (typeof bet === 'string') return ctx.reply(bet).then(() => false);

		const multi = GambleCommand.getMulti(ctx, entry);
		const emojis = Object.keys(this.slots(multi));
		const slots = this.getSlots(entry, emojis);
		const { winnings, length } = this.calcSlots(slots, bet, multi);

		const msg = await ctx.channel.send({
			embeds: [{
				author: {
					name: `${ctx.author.username}'s slot machine`,
					iconURL: ctx.author.avatarURL({ dynamic: true })
				},
				color: ctx.client.util.randomColor(),
				description: `**>** :${Array(3).fill(emojis[emojis.length - 1]).join(':    :')}: **<**`
			}]
		});

		await ctx.client.util.sleep(1000);
		if ([1, 2].every(l => l !== length)) {
			const { props } = await entry.removePocket(bet).updateStats(this.id, bet, false).save();
			return msg.edit({
				embeds: [{
					...msg.embeds[0],
					color: Colors.RED,
					description: [
						`**>** :${slots.join(':    :')}: **<**\n`,
						`You lost **${bet.toLocaleString()}**.`,
						`You now have **${props.pocket.toLocaleString()}**.`
					].join('\n'),
				}]
			}).then(() => true);
		}

		const { props } = await entry.addPocket(winnings).updateStats(this.id, winnings, true).save();
		return msg.edit({
			embeds: [{
				...msg.embeds[0],
				color: Colors[length === 1 ? 'GOLD' : 'GREEN'],
				description: [
					`**>** :${slots.join(':    :')}: **<**\n`,
					`You won **${winnings.toLocaleString()}**.`,
					`**Multiplier** \`${Number((winnings / bet).toFixed(2))}x\``,
					`You now have **${props.pocket.toLocaleString()}**.`
				].join('\n'),
			}]
		}).then(() => true);
	}

	calcSlots(slots: string[], bet: number, multis: number) {
		const emojis = Object.keys(this.slots(multis));
		const rate = Object.values(this.slots(multis));

		const length = slots.filter((e, i, arr) => arr.indexOf(e) === i).length;
		const rates = rate.map((_, i, arr) => arr[emojis.indexOf(slots[i])]).filter(Boolean);
		const multi = rates.filter((r, i, arr) => arr.indexOf(r) !== i)[0];

		if ([1, 2].some(l => length === l)) {
			const index = length === 1 ? 1 : 0;
			let winnings = Math.round(bet + (bet * multi[index]));
			winnings = winnings + Math.round(winnings * (multis / 1000));
			winnings = Math.min(Currency.MAX_WIN, winnings + Math.ceil(winnings * (multis / 100)));

			return { length, winnings };
		}

		return { length, winnings: 0 };
	}
}