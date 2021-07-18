import { Context, Currency } from 'lava/index';
import { GambleCommand } from '../..';

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
			coin: [50, 250],
			gem: [50, 250],
			medal: [50, 250],
			ring: [50, 250],
			trophy: [100, 500],
			crown: [100, 500],
			trident: [100, 500],
			fist: [100, 500],
			fire: [multi * 5, multi * 10]
		});
	}

	getSlots(emojis: string[], multi: number) {
		const { randomInArray, randomsInArray, randomNumber, deepFilter } = this.client.util;
		const first = randomInArray(emojis);
		const odds = randomNumber(1, 100);

		return Array.from({ length: 3 }, () => randomInArray(emojis));
		
		if (odds > 95) {
			return Array(3).fill(first);
		}
		if (odds > 85) {
			return [randomInArray(deepFilter(emojis, [first])), first, first]
				.sort(() => Math.random() * 0.5);
		}

		return randomsInArray(emojis, 3);
	}

	async exec(ctx: Context, args: { amount: string | number }) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const bet = this.parseArgs(ctx, args, entry);
		if (typeof bet === 'string') return ctx.reply(bet).then(() => false);
		const state = this.checkArgs(bet, entry);
		if (typeof state === 'string') return ctx.reply(state).then(() => false);

		const multi = this.calcMulti(ctx, entry);
		const slots = this.getSlots(Object.keys(this.slots(multi)), multi);
		const { winnings, length } = this.calcSlots(slots, bet, multi);

		if ([1, 2].every(l => l !== length)) {
			const { props } = await entry.removePocket(bet).updateStats(this.id, bet, false).save();
			return ctx.channel.send({
				embed: {
					color: 'RED',
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
				}
			}).then(() => true);
		}

		const { props } = await entry.addPocket(winnings).updateStats(this.id, winnings, true).save();
		return ctx.channel.send({
			embed: {
				color: length === 1 ? 'GOLD' : 'GREEN',
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
			}
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