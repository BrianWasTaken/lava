import { GambleCommand } from '../..';
import { Context } from 'lava/index';

export default class extends GambleCommand {
	constructor() {
		super('slots', {
			aliases: ['slotmachine', 'slots'],
			description: 'Spin the slot machine to have a chance to win a jackpot!',
			name: 'Slots',
		});
	}

	get slots() {
		return {
			broken_heart: 		[0.2, 1, false],
			clown: 						[0.3, 1.15, false],
			pizza: 						[0.4, 1.3, false],
			eggplant: 				[0.5, 1.45, false],
			flushed: 					[0.6, 1.6, true],
			star2: 						[0.7, 1.75, true],
			fire: 						[0.8, 1.9, true],
			four_leaf_clover: [0.9, 2.1, true],
			kiss: 						[1, 2.25, true],
		}
	}

	getSlots(emojis: string[]) {
		const { randomInArray, randomNumber, deepFilter } = this.client.util;
		const first = randomInArray(emojis);
		const odds = randomNumber(1, 100);

		if (odds > 95) {
			return Array(3).fill(first);
		}
		if (odds > 65) {
			emojis = Array(3).fill(first);
			const index = randomNumber(1, emojis.length) - 1;
			const slots = Object.keys(this.slots);
			emojis[index] = randomInArray(slots.filter(e => e !== first));
			return emojis;
		}

		let second: string;
		const map = (_: string, index: number) => {
			if (index === 0) return second = randomInArray(deepFilter(emojis, [first]));
			return randomInArray(deepFilter(emojis, [first, second]));
		}

		return [first, ...Array(2).fill(first).map(map)];
	}

	async exec(ctx: Context, args: { amount: string | number }) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const bet = this.parseArgs(ctx, args, entry);
		if (!bet) return ctx.reply('You need to bet something!');
		
		const state = this.checkArgs(bet, entry);
		if (typeof state === 'string') return ctx.reply(state);

		const multi = entry.calcMulti(ctx).reduce((p, c) => c.value + p, 0);
		const slots = this.getSlots(Object.keys(this.slots));
		const { winnings, length } = this.calcSlots(slots, bet, multi);

		if ([1, 2].every(l => l !== length)) {
			const { props } = await entry.removePocket(bet).save();
			return ctx.channel.send({ embed: {
				color: 'RED',
				author: {
					name: `${ctx.author.username}'s slot machine`,
				},
				description: [
					`You lost **${bet.toLocaleString()}** coins.\n`,
					`You now have **${props.pocket.toLocaleString()}** coins.`
				].join('\n'),
				fields: [
					{ name: 'Outcome', value: `**>** :${slots.join(':    :')}: **<**` }
				],
				footer: {
					text: 'sucks to suck'
				}
			}});
		}

		const { props } = await entry.addPocket(winnings).save();
		return ctx.channel.send({ embed: {
			color: length === 1 ? 'GOLD' : 'GREEN',
			author: {
				name: `${ctx.author.username}'s slot machine`,
			},
			description: [
				`You won **${winnings.toLocaleString()}** coins.`,
				`**Multiplier** ${multi}% | **Percent of bet won** ${Math.round(winnings / bet * 100)}%\n`,
				`You now have **${props.pocket.toLocaleString()}** coins.`
			].join('\n'),
			fields: [
				{ name: 'Outcome', value: `**>** :${slots.join(':    :')}: **<**` }
			],
			footer: {
				text: 'winner winner'
			}
		}})
	}

	calcSlots(slots: string[], bet: number, multis: number) {
		const rate = Object.values(this.slots);
		const emojis = Object.keys(this.slots);

		const length = slots.filter((e, i, arr) => arr.indexOf(e) === i).length;
		const rates = rate.map((r, i, arr) => arr[emojis.indexOf(slots[i])]).filter(Boolean);
		const multi = rates.filter((r, i, arr) => arr.indexOf(r) !== i)[0];

		if ([1, 2].some(l => length === l)) {
			const index = length === 1 ? 1 : 0;
			const mult = multi[index] as number;
			let winnings = Math.round(bet + (bet * mult));
			winnings = winnings + (winnings * (multis / 10000)); 

			return { length, winnings };
		}

		return { length, winnings: 0 };
	}
}