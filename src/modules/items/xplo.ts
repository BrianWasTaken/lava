import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';

export default class PowerUp extends Item {
	constructor() {
		super('xplo', {
			category: 'Power-Up',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':bomb:',
			name: "Xplosive's Bomb",
			cost: 1500000,
			tier: 2,
			info: {
				short: 'Get sweet treats by giving a fuck about everything!',
				long:
					'Get a free item by risking what you earned so far from your whole progress.',
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { randomNumber, randomInArray, sleep } = this.client.util;
		const xplo = super.findInv(ctx.db.data.items, this);

		await ctx.send({
			reply: { messageReference: ctx.id, failIfNotExists: false },
			content: `**${this.emoji} Fusing your bomb...**`,
		});

		await sleep(randomNumber(1, 5) * 1e3);
		let odds = randomNumber(1, 100);

		if (odds >= 30) {
			const mods = this.client.handlers.item.modules.array().filter(i => !i.premium || i.cost <= 5e5);
			const items: Slot[] = [{ amt: 1, item: this }];
			type Slot = { amt?: number; item?: Item };
			const coins = randomNumber(1, 100) * 1e3;
			ctx.db.removeInv(this.id);

			for (let e = 0; e < randomNumber(1, 3); e++) {
				const filter = (m: Item) => !items.some((it) => it.item.id === m.id);
				const item = randomInArray(mods.filter(i => !i.premium).filter(filter));
				const amt = randomNumber(1, 5);
				items.push({ amt, item });
			}

			const map = ({ amt, item }: Slot) => `\`${amt.toLocaleString()}\` ${item.emoji} ${item.name}`;
			const sort = (a: Slot, b: Slot) => b.amt - a.amt;
			const its = items.sort(sort).map(map);

			items.forEach(({ amt, item }) => ctx.db.addInv(item.id, amt));
			await ctx.db.addPocket(coins).updateItems().save();
			return {
				reply: { messageReference: ctx.id, failIfNotExists: false },
				content: `**__:slight_smile: Bomb contents for ${ctx.author.toString()}__**\n${[
					`\`${coins.toLocaleString()} coins\``,
					...its,
				].join('\n')}`
			};
		}

		// Punishment: Clean one item from their inv and their pocket
		const inv = randomInArray(ctx.db.data.items.filter(i => i.amount > 1));
		const item = this.client.handlers.item.modules.get(inv.id);
		await ctx.db.removePocket(ctx.db.data.pocket).removeInv(this.id).removeInv(item.id, super.findInv(ctx.db.data.items, item as Item).amount).updateItems().save();
		return {
			reply: { messageReference: ctx.id, failIfNotExists: false },
			content: `**__LMAO you died from the bomb!__**\nYou lost your WHOLE pocket and ALL your ${item.name.slice(
				0,
				item.name.endsWith('y') ? -1 : undefined
			)}${item.name.endsWith('y') ? 'ies' : 's'} from your inventory.`
		};
	}
}