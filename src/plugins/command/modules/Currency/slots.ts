import { Context, Currency, Colors } from 'lava/index';
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
			coin: [1, 2],
			gem: [1, 2],
			medal: [1, 2],
			ring: [1, 2],
			trophy: [2, 4],
			crown: [2, 4],
			trident: [2, 4],
			fist: [2, 4],
			fire: [10, multi]
		});
	}

	getSlots(emojis: string[], multi: number) {
		const { randomInArray, randomsInArray, randomNumber, deepFilter, shuffle } = this.client.util;
		const first = randomInArray(emojis);
		const odds = randomNumber(1, 100);

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
		const slots = this.getSlots(Object.keys(this.slots(multi)), multi);
		const { winnings, length } = this.calcSlots(slots, bet, multi);

		if ([1, 2].every(l => l !== length)) {
			const { props } = await entry.removePocket(bet).updateStats(this.id, bet, false).save();
			return ctx.channel.send({
				embeds: [{
					color: Colors.RED,
					author: {
						name: `${ctx.author.username}'s slot machine`,
					},
					description: [
						`**>** :${slots.join(':    :')}: **<**\n`,
						`You lost **${bet.toLocaleString()}**.`,
						`You now have **${props.pocket.toLocaleString()}**.`
					].join('\n'),
					footer: {
						text: 'sucks to suck'
					}
				}]
			}).then(() => true);
		}

		const { props } = await entry.addPocket(winnings).updateStats(this.id, winnings, true).save();
		return ctx.channel.send({
			embeds: [{
				color: Colors[length === 1 ? 'GOLD' : 'GREEN'],
				author: {
					name: `${ctx.author.username}'s slot machine`,
				},
				description: [
					`**>** :${slots.join(':    :')}: **<**\n`,
					`You won **${winnings.toLocaleString()}**.`,
					`**Multiplier** \`${Math.floor(winnings / bet)}x\``,
					`You now have **${props.pocket.toLocaleString()}**.`
				].join('\n'),
				footer: {
					text: length === 1 ? 'poggers' : 'winner winner'
				}
			}]
		}).then(() => true);
	}

	calcSlots(slots: string[], bet: number, multis: number) {
		const rate = Object.values(this.slots(multis));
		const emojis = Object.keys(this.slots(multis));

		const length = slots.filter((e, i, arr) => arr.indexOf(e) === i).length;
		const rates = rate.map((_, i, arr) => arr[emojis.indexOf(slots[i])]).filter(Boolean);
		const multi = rates.filter((r, i, arr) => arr.indexOf(r) !== i)[0];

		if ([1, 2].some(l => length === l)) {
			const index = length === 1 ? 1 : 0;
			const mult = multi[index] as number;
			const winnings = bet * mult;
			// let winnings = Math.round(bet + (bet * mult));
			// winnings = winnings + Math.round(winnings * (multis / 10000));
			// winnings = Math.min(Currency.MAX_WIN, winnings + Math.ceil(winnings * (multis / 100)));

			return { length, winnings };
		}

		return { length, winnings: 0 };
	}
}